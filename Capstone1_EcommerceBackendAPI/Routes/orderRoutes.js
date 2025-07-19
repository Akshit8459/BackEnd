const express=require('express');
const router=express.Router();
const fn=require('../Controllers/orderControllers')
const {auth}=require('../Middlewares/authentication')
const authorise=require("../Middlewares/authorisation")

router.get('/',auth,authorise("ADMIN","SUPPORT"),fn.getAllOrders)
router.get('/:id',auth,authorise("ADMIN","SUPPORT"),fn.getSingleOrder)

router.delete('/:id',auth,authorise("ADMIN","SUPPORT"),fn.deleteOrder)

router.put('/:id',auth,authorise("ADMIN","SUPPORT"),fn.updateOrder);

router.post("/",auth,authorise("ADMIN","SUPPORT"),fn.createOrder);

module.exports=router;