const express=require("express")
const router=express.Router();
const fn=require('../Controllers/userControls')
const auth=require('../Middlewares/authentication')
const authorise=require('../Middlewares/authorization')

router.get('/login',fn.loginPage)
router.post('/login',fn.loginUser)
router.get('/signup',fn.signupPage)
router.post('/signup',fn.createUser)
router.get('/',auth,authorise("ADMIN"),fn.getAllUsers)
router.get('/:id',auth,authorise("ADMIN"),fn.getSingleUser)
router.delete('/:id',auth,authorise("ADMIN"),fn.deleteUser)
router.patch('/:id',auth,authorise("ADMIN"),fn.updateUser)

module.exports=router