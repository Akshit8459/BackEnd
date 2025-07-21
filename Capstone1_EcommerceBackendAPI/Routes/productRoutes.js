const express=require('express');
const router=express.Router();
const fn=require('../Controllers/productControllers');
const {auth}=require('../Middlewares/authentication');
const authorise=require('../Middlewares/authorisation');


router.get("/",auth,fn.getAllProducts);
router.get("/create", (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>Create Product</title>
        <style>
            body {
                font-family: sans-serif;
                background: #f8f9fa;
                padding: 30px;
            }
            h2 {
                text-align: center;
            }
            form {
                max-width: 500px;
                margin: auto;
                background: #fff;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 0 10px rgba(0,0,0,0.1);
            }
            label {
                display: block;
                margin-top: 15px;
                font-weight: bold;
            }
            input, textarea {
                width: 100%;
                padding: 8px;
                margin-top: 5px;
                border: 1px solid #ccc;
                border-radius: 4px;
                font-size: 1em;
            }
            button {
                margin-top: 20px;
                width: 100%;
                padding: 10px;
                background: #28a745;
                color: white;
                border: none;
                border-radius: 4px;
                font-size: 1em;
                cursor: pointer;
            }
            button:hover {
                background: #218838;
            }
        </style>
    </head>
    <body>
        <h2>Create New Product</h2>
        <form action="/products" method="POST">
            <label for="name">Product Name</label>
            <input type="text" name="name" required>

            <label for="description">Description</label>
            <textarea name="description" required></textarea>

            <label for="price">Price</label>
            <input type="number" name="price" step="0.01" required>

            <label for="category">Category</label>
            <input type="text" name="category" required>

            <label for="stock">Stock</label>
            <input type="number" name="stock" required>

            <label for="images">Image URLs (comma-separated)</label>
            <input type="text" name="images">

            <button type="submit">Create Product</button>
        </form>
    </body>
    </html>
    `);
});
router.get('/:id',auth,authorise("ADMIN","SUPPORT"),fn.getProductEditPage);
router.post("/",auth,authorise("ADMIN","SUPPORT"),fn.createProduct);
router.delete("/:id",auth,authorise("ADMIN","SUPPORT"),fn.deleteProduct);
router.put("/:id",auth,authorise("ADMIN","SUPPORT"),fn.updateProduct);

module.exports=router;