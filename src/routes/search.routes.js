const { Router } = require("express")
const SearchController = require("../controllers/searchController")
const searchController = new SearchController()

const isAdmin = require("../middlewares/isAdmin") 

const searchRoutes = Router()

searchRoutes.get("/:query", searchController.search)

module.exports = searchRoutes