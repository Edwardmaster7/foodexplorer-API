const config = require("../../../knexfile")
const knex = require("knex")

const connection = knex(config.production)

module.exports = connection