const AppError = require("../utils/AppError")

const knex = require("../database/knex")

class CategoriesController {

    /**
     * Creates a new ingredient in the database.
     *
     * @param {Object} request - The request object containing the body data.
     * @param {Object} response - The response object to send back the result.
     * @param {string} request.body.name - The name of the ingredient to be created.
     * @throws Will throw an error if the name is not provided or if the ingredient already exists.
     * @returns {Object} - Returns a response object with status 201 and an empty JSON body.
     */
    async create(request, response) {
        const { names, name } = request.body

        // validate names is provided and not empty
        // check if the names is an array
        if (name || !Array.isArray(names)) {
            throw new AppError("Names is required and must be an array.")
        } else if (names.length === 0) {
            throw new AppError("At least one name is required.")
        }

        // check if one or more ingredients with the same name already exists
        const checkCategoryExists = await knex("Categories").whereIn("name", names).select("id")
        // console.log(checkCategoryExists)
        if (checkCategoryExists && checkCategoryExists.length > 0) {
            throw new AppError("One or more categories already exists.")
        }

        console.log(names)

        // insert all the ingredients into the database
        await knex("Categories").insert(names.map(name => ({ name })))

        return response.status(201).json()
    }

    async update(request, response) {
        const { id } = request.params
        const { name } = request.body

        // validate name is provided and not empty
        if (!name) {
            throw new AppError("Category name is required.")
        }

        // check if ingredient already exists
        const checkCategoryExists = await knex("Categories").where({ id }).first()
        if (!checkCategoryExists) {
            throw new AppError("Categories not found.")
        }

        await knex("Categories").where({ id }).update({ name })

        return response.status(200).json()
    }

    async delete(request, response) {
        const { id } = request.params

        // check if the category exists
        const checkCategoryExists = await knex("Categories").where({ id }).first()
        if (!checkCategoryExists) {
            throw new AppError("Category not found.")
        }

        // check if there is any dish with the given category
        const checkDishExists = await knex("Dishes").where({ category_id: id }).first()
        if (checkDishExists) {
            throw new AppError("Cannot delete a category that has dishes associated with it. Update them first.")
        }

        await knex("Categories").where({ id }).delete()

        return response.status(200).json()
    }

    async index(request, response) {
        const categories = await knex("Categories").orderBy("id", "asc")

        return response.json(categories)
    }

    async show(request, response) {
        const { id } = request.params

        const ingredient = await knex("Categories").where({ id }).first()

        // check if the ingredient was found
        if (!ingredient) {
            throw new AppError("Category not found.")
        }

        return response.json(ingredient)
    }
}

module.exports = CategoriesController 