const express=require('express');
const controller=require('../Controllers/TodoControllers.js');
const router=express.Router();

router.get('/',controller.getAllTodo);
router.post('/',controller.createTodo);
router.put('/:id',controller.updateTodo);
router.delete('/:id',controller.deleteTodo);

module.exports=router;