const db=require('../Models/Products');
const redisClient=require('../Database/redisconnect')



// Get all products
exports.getAllProducts = async (req, res) => {
    try {
        const cachedProducts = await redisClient.get("products");
        if (cachedProducts) {
            return res.status(200).json(JSON.parse(cachedProducts));
        }
        const products = await db.find();
        if (products.length === 0) {
            return res.status(404).json({ message: "No products found" });
        }
        redisClient.set("products", JSON.stringify(products));
        res.status(200).json(products);
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get a product by ID
exports.getProductById = async (req, res) => {
    try {
        const productId = req.params.id;
        const cachedProduct = await redisClient.get(`product:${productId}`);
        if (cachedProduct) {
            return res.status(200).json(JSON.parse(cachedProduct));
        }
        const product = await db.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        redisClient.set(`product:${productId}`, JSON.stringify(product));
        res.status(200).json(product);
    } catch (error) {
        console.error("Error fetching product:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Create a new product
exports.createProduct = async (req, res) => {
    try {
        const { name, price, description } = req.body;
        if (!name || !price || !description) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const newProduct = new db({
            name,
            price,
            description
        });
        await newProduct.save();
        redisClient.del("products");
        res.status(201).json({ message: "Product created successfully" });
    } catch (error) {
        console.error("Error creating product:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Update a product by ID
exports.updateProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const { name, price, description } = req.body;
        if (!name || !price || !description) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const updatedProduct = await db.findByIdAndUpdate(productId, {
            name,
            price,
            description
        }, { new: true });
        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }
        redisClient.del(`product:${productId}`);
        redisClient.del("products");
        redisClient.set(`product:${productId}`, JSON.stringify(updatedProduct));
        res.status(200).json(updatedProduct);
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Delete a product by ID
exports.deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const deletedProduct = await db.findByIdAndDelete(productId);
        if (!deletedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }
        redisClient.del(`product:${productId}`);
        redisClient.del("products");
        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
