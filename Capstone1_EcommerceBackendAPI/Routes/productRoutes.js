const express=require('express');
const router=express.Router();
const fn=require('../Controllers/productControllers');
const {auth}=require('../Middlewares/authentication');
const authorise=require('../Middlewares/authorisation');


router.get("/",auth,fn.getAllProducts);
router.get('/:id',auth,fn.getSingleProductById);
router.post("/",auth,authorise("ADMIN","SUPPORT"),fn.createProduct);
router.delete("/:id",auth,authorise("ADMIN","SUPPORT"),fn.deleteProduct);
router.put("/:id",auth,authorise("ADMIN","SUPPORT"),fn.updateProduct);

module.exports=router;