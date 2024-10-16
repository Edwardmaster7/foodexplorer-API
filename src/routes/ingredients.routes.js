const { Router } = require("express")

const IngredientsController = require("../controllers/ingredientsController")
const ingredientsController = new IngredientsController()

const isAdmin = require("../middlewares/isAdmin") 

const ingredientsRouter = Router()

ingredientsRouter.get("/", ingredientsController.index)
ingredientsRouter.get("/:id", ingredientsController.show)
ingredientsRouter.post("/", isAdmin, ingredientsController.create)
ingredientsRouter.put("/:id", isAdmin, ingredientsController.update)
ingredientsRouter.delete("/:id", isAdmin, ingredientsController.delete)

module.exports = ingredientsRouter