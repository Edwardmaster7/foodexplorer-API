const { Router } = require("express")

const ensureAuthenticated = require('../middlewares/ensureAuthenticated');

const usersRouter = require('./users.routes');
const sessionsRouter = require('./sessions.routes');
const ingredientsRouter = require('./ingredients.routes');
const dishesRouter = require('./dishes.routes');
const searchRouter = require('./search.routes');
const categoriesRouter = require("./categories.routes");
const ordersRouter = require('./orders.routes');
const favouritesRouter = require('./favourites.routes');

const routes = Router();

routes.use('/users', usersRouter);
routes.use('/sessions', sessionsRouter);
routes.use('/ingredients', ensureAuthenticated, ingredientsRouter);
routes.use('/dishes', ensureAuthenticated, dishesRouter);
routes.use('/search', ensureAuthenticated, searchRouter);
routes.use('/categories', ensureAuthenticated, categoriesRouter);
routes.use('/orders', ensureAuthenticated, ordersRouter);
routes.use('/favourites', ensureAuthenticated, favouritesRouter);

module.exports = routes;