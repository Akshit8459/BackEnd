const express=require('express');
const publisherRouter=express.Router();
const publ=require('../Controllers/PublisherControllers.js');

publisherRouter.get('/',publ.getAllPublishers);
publisherRouter.get('/:id',publ.getPublisher);
publisherRouter.post('/',publ.createPublisher);
publisherRouter.delete('/:id',publ.deletePublisher);
publisherRouter.put('/:id',publ.updatePublisher);

module.exports=publisherRouter;