const { Router } = require("express")


const OrdersController = require("../controllers/ordersController")
const ordersController = new OrdersController()
const ordersRouter = Router()

ordersRouter.get("/", ordersController.index)
ordersRouter.get("/:id", ordersController.show)
ordersRouter.post("/", ordersController.create)
ordersRouter.put("/:id", ordersController.update)

module.exports = ordersRouter