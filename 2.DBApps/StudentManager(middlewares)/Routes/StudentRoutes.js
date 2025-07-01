const express=require('express');
const router=express.Router();
const student=require('../Controllers/StudentController')

const validCheck=require('../Middlewares/validator')

router.get('/search',student.search);

router.post('/',validCheck,student.createStudent)
router.delete('/:id',student.deleteStudent)
router.patch('/:id',student.updateStudent)

router.get('/',student.getAllStudents)
router.get('/:name',student.getStudents)

module.exports=router;