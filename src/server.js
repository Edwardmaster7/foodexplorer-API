require("express-async-errors");
require("dotenv/config");
// const migrationsRun = require("./database/sqlite/migrations") 

const AppError = require("./utils/AppError");
const express = require("express");

const cors = require("cors");
const routes = require("./routes"); // by default routes will load index.js
const uploadConfig = require("./configs/upload");

// migrationsRun();

const app = express();

const port = process.env.PORT || 3333;

app.use(cors());

app.use(express.json());

app.use("/files", express.static(uploadConfig.UPLOADS_DIR));

app.use(routes);


app.use((error, request, response, next) => {
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      status: "error",
      message: error.message
    });
  };

  console.error(error); 

  return response.status(500).json({ status: "error", message: "Internal server error" });
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});