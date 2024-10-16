const { Router } = require('express')

const FavouritesController = require('../controllers/favouritesController')
const favouritesController = new FavouritesController()

const favouritesRouter = Router()

favouritesRouter.post('/:id', favouritesController.create)
favouritesRouter.get('/', favouritesController.index)
favouritesRouter.delete('/:id', favouritesController.delete)

module.exports = favouritesRouter