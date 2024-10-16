const { Router } = require("express")

const CategoriesController = require("../controllers/categoriesController")
const categoriesController = new CategoriesController()

const isAdmin = require("../middlewares/isAdmin") 

const categoriesRouter = Router()

categoriesRouter.get("/", categoriesController.index)
categoriesRouter.get("/:id", categoriesController.show)
categoriesRouter.post("/", isAdmin, categoriesController.create)
categoriesRouter.put("/:id", isAdmin, categoriesController.update)
categoriesRouter.delete("/:id", isAdmin, categoriesController.delete)

module.exports = categoriesRouter