const express=require('express')
const router=express.Router();
const fn=require('../Controllers/userControllers')
const {auth}=require('../Middlewares/authentication');
const authorise=require('../Middlewares/authorisation');

router.get('/',(req,res)=>{
    res.send("Welcome Users")
})

router.get('/login',fn.loginPage);
router.post('/login',fn.loginUser);
router.get('/register',fn.signupPage);
router.post('/register',fn.registerUser);

router.get('/all',auth,authorise("SUPPORT","ADMIN"),fn.getAllusers)
router.get('/:id',auth,authorise("SUPPORT","ADMIN"),fn.getSingleUserbyId);

router.delete('/:id',auth,authorise("SUPPORT","ADMIN"),fn.deleteUser);

router.put('/:id',auth,authorise("SUPPORT","ADMIN"),fn.updateUser);

module.exports=router;