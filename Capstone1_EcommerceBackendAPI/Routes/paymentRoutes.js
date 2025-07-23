const express=require('express')
const router=express.Router();
const fn=require('../Controllers/paymentControllers')
const {auth}=require('../Middlewares/authentication')
const authorise=require('../Middlewares/authorisation')

router.post('/pay/:id',auth,authorise("ADMIN","SUPPORT"),fn.getPaymentGateway);
router.get('/payment-success', fn.paymentSuccess);
router.get('/',auth,authorise("ADMIN","SUPPORT"),fn.getAllPayments);
router.get('/:id',auth,authorise("ADMIN","SUPPORT"),fn.getSinglePayment);

router.post('/',auth,authorise("ADMIN","SUPPORT"),fn.createPayment);

router.delete('/:id',auth,authorise("ADMIN","SUPPORT"),fn.deletePayment);

router.put('/:id',auth,authorise("ADMIN","SUPPORT"),fn.updatePayment);

module.exports=router;
