const { Router } = require("express")

const DishesController = require("../controllers/dishesController")
const dishesController = new DishesController()

const multer = require("multer")
const uploadConfig = require("../configs/upload")
const upload = multer(uploadConfig.MULTER)
const DishImgController = require("../controllers/dishImgController")
const dishImgController = new DishImgController()

const isAdmin = require("../middlewares/isAdmin") 

const dishesRouter = Router()

dishesRouter.get("/", dishesController.index)
dishesRouter.get("/:id", dishesController.show)
dishesRouter.post("/", isAdmin, dishesController.create)
dishesRouter.put("/:id", isAdmin, dishesController.update)
dishesRouter.delete("/:id", isAdmin, dishesController.delete)
dishesRouter.patch("/img/:id", upload.single("img"), isAdmin, dishImgController.update)

module.exports = dishesRouter