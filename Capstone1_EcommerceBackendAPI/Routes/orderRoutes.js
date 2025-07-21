const express=require('express');
const router=express.Router();
const fn=require('../Controllers/orderControllers')
const {auth}=require('../Middlewares/authentication')
const authorise=require("../Middlewares/authorisation")

router.get('/',auth,fn.getAllOrders)
router.get('/:id',auth,fn.getSingleOrder)

router.delete('/:id',auth,fn.deleteOrder)

router.put('/:id',auth,authorise("ADMIN","SUPPORT"),fn.updateOrder);

router.post("/",auth,fn.createOrder);

module.exports=router;