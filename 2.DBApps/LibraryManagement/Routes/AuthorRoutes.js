const express=require('express');
const router=express.Router();
const auth=require('../Controllers/AuthorControllers.js');

router.get('/', auth.getAllauthors);
router.get('/:id',auth.getAuthor);
router.delete('/:id',auth.deleteAuthor);
router.put('/:id',auth.updateAuthor);
router.post('/',auth.createAuthor);

module.exports=router;