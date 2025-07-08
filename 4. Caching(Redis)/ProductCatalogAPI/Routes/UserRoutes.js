const controls=require('../Controllers/UserController');
const {auth}=require('../Middlewares/authenticate');
const authorise=require('../Middlewares/authorise');

const express=require('express');
const router=express.Router();

// User registration route
router.get('/register', (req, res) => {
    const html=`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>User Registration</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
            }
        </style>
    </head>
    <body>
        <h1>User Registration</h1>
        <form action="/api/users/register" method="POST">
            <label for="username">Username:</label>
            <input type="text" id="username" name="name" required>
            <br>
            <label for="email">Email:</label>
            <input type="email" id="email" name="email" required>
            <br>
            <label for="password">Password:</label>
            <input type="password" id="password" name="password" required>
            <br>
            <label for="role">Role:</label>
            <select id="role" name="role">
                <option value="user">User</option>
                <option value="admin">Admin</option>
            </select>
            <br>
            <button type="submit">Register</button>
        </form>
    </body>
    </html>
    `
    res.send(html);
});
router.post('/register', controls.registerUser);

// User login route
router.get('/login', (req, res) => {
    const html=`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>User Login</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
            }
        </style>
    </head>
    <body>
        <h1>User Login</h1>
        <form action="/api/users/login" method="POST">
            <label for="email">Email:</label>
            <input type="email" id="email" name="email" required>
            <br>
            <label for="password">Password:</label>
            <input type="password" id="password" name="password" required>
            <br>
            <button type="submit">Login</button>
        </form>
    </body>
    </html>
    `
    res.send(html);
});
router.post('/login', controls.loginUser);

// Get all users route
router.get('/getAll', auth, authorise('admin'), controls.getAllUsers);

// Update user by ID route
router.put('/update/:id', auth, controls.updateUser);

// Get user by ID route
router.get('/get/:id', auth, authorise('admin'), controls.getUserById);

// Delete user by ID route
router.delete('/delete/:id', auth, authorise('admin'), controls.deleteUser);

module.exports=router;
