const express=require('express');
const bookRouter=express.Router();
const book=require('../Controllers/BookControllers.js');

bookRouter.get('/',book.getAllBooks);
bookRouter.get('/:id',book.getBook);
bookRouter.post('/',book.createBook);
bookRouter.delete('/:id',book.deleteBook);
bookRouter.put('/:id',book.updateBook);

module.exports=bookRouter;

//router.patch->updates only the field in req.body;
//router.put->updates whole colomn with the provided data only, previous data is removed or overwritten;