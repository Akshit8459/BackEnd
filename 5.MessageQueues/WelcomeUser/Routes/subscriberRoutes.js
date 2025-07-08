const express=require('express');
const router=express.Router();
const controls=require('../Controllers/subscriberControls');

router.get('/',controls.subscribePage);
router.post('/subscribe',controls.subscribeUser); 
module.exports=router;