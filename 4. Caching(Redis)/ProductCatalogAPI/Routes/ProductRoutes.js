const controls=require('../Controllers/ProductControllers.js');
const {auth} = require('../Middlewares/authenticate');
const express=require('express');
const router=express.Router();

// Route to get all products
router.get('/', auth, controls.getAllProducts);
// Route to get a product by ID
router.get('/get/:id', auth, controls.getProductById);
// Route to create a new product
router.post('/create', auth, controls.createProduct);
// Route to update a product by ID
router.put('/update/:id', auth, controls.updateProduct);
// Route to delete a product by ID
router.delete('/delete/:id', auth, controls.deleteProduct);

module.exports=router;