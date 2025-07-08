const db=require('../Models/Users');
const redisClient = require('../Database/redisconnect');
const bcrypt = require('bcryptjs');
const {generateToken}=require('../Utils/jwt');

// Register a new user
exports.registerUser = async (req, res) => {
    try {
        const existingUser = await db.findOne({
            email: req.body.email
        });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        const pass=await bcrypt.hash(req.body.password, 10); // Hashing the password
        const newUser = new db({
            name: req.body.name,
            email: req.body.email,
            password: pass, 
            role: req.body.role ? req.body.role : "user"
        });
        await newUser.save();
        const token = generateToken({ id: newUser._id, email: newUser.email ,name: newUser.name, role: newUser.role}); // Generate JWT token
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            maxAge: 24 * 60 * 60 * 1000 // Cookie expires in 1 day
        }); 
        res.status(201).json({ message: "User registered successfully" });
        redisClient.del("users");
        redisClient.set("users", JSON.stringify(await db.find()));
    }
     catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get all users
exports.getAllUsers = async (req, res) => {
    try {
        const cachedUsers = await redisClient.get("users");
        if (cachedUsers) {
            return res.status(200).json(JSON.parse(cachedUsers));
        }
        const users = await db.find();
        if (users.length === 0) {
            return res.status(404).json({ message: "No users found" });
        }
        redisClient.set("users", JSON.stringify(users));
        res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get a user by ID
exports.getUserById = async (req, res) => {
    try {
        const userId = req.params.id;
        const cachedUser = await redisClient.get(`user:${userId}`);
        if (cachedUser) {
            return res.status(200).json(JSON.parse(cachedUser));
        }
        const user = await db.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        redisClient.set(`user:${userId}`, JSON.stringify(user));
        res.status(200).json(user);
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Update a user by ID
exports.updateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const updatedUser = await db.findByIdAndUpdate(userId, {
            name: name,
            email: email,
            password: password
        }, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        redisClient.del(`user:${userId}`);
        redisClient.set(`user:${userId}`, JSON.stringify(updatedUser));
        res.status(200).json(updatedUser);
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Delete a user by ID
exports.deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const deletedUser = await db.findByIdAndDelete(userId);
        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        redisClient.del(`user:${userId}`);
        redisClient.del("users");
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


// User login
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }
        const user = await db.findOne
        ({
            email: email
        });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        const isPasswordValid = bcrypt.compareSync(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        const token = generateToken({ id: user._id, email: user.email, name: user.name, role: user.role });
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });
        res.status(200).json({ message: "Login successful" });
    } catch (error) {
        console.error("Error logging in user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
