//importo express
const express = require('express');
//creo istanza oggetto rotte
const router = express.Router();
//importo sita posts da posts.js
const listaPosts = require('../data/postsList')
//importo il controller della risorsa posts
const postController = require('./../controllers/postsController');


//rotte di crud a cui assegno come parametro della funzione la rotta che mi gestisce la logica
// index
router.get('/', postController.index)
// show
router.get('/:id', postController.show)
// store
router.post('/', postController.store)
// update
router.put('/:id', postController.update)
// modify
router.patch('/:id', postController.modify)
// destroy
router.delete('/:id', postController.destroy)

//esporto istanza rootte
module.exports = router;