const AppError = require("../utils/AppError");

const knex = require("../database/knex");

class IngredientsController {

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
        const { names } = request.body;

        // validate name is provided and not empty
        if (!names) {
            throw new AppError("Name is required.");
        }

        // check if the name is an array
        if (!Array.isArray(names)) {
            throw new AppError("Names must be an array.");
        } else if (names.length === 0) {
            throw new AppError("At least one name is required.");
        }

        // check if one or more ingredients with the same name already exists
        const checkIngredientExists = await knex("Ingredients").whereIn("name", names).select("id");
        // console.log(checkIngredientExists);
        if (checkIngredientExists && checkIngredientExists.length > 0) {
            throw new AppError("One or more ingredients already exists.");
        }

        // insert all the ingredients into the database and get the corresponding ids
        const insertedIds = await knex("Ingredients").insert(names.map(name => ({ name })), "id");

        // return the ids in the id: [] format
        const groupedIds = { id: insertedIds.map(id => id.id) };

        // console.log(groupedIds);

        return response.status(201).json(groupedIds);
    }

    async update(request, response) {
        const { id } = request.params;
        const { name } = request.body;

        // validate name is provided and not empty
        if (!name) {
            throw new AppError("Name is required.");
        }

        // check if ingredient already exists
        const checkIngredientExists = await knex("Ingredients").where({ id }).first();
        if (!checkIngredientExists) {
            throw new AppError("Ingredient not found.");
        }

        await knex("Ingredients").where({ id }).update({ name });

        return response.status(200).json();
    }

    async delete(request, response) {
        const { id } = request.params;

        // check if ingredient exists
        const checkIngredientExists = await knex("Ingredients").where({ id }).first();
        if (!checkIngredientExists) {
            throw new AppError("Ingredient not found.");
        }

        // check if ingredient is used in any dish
        const checkIngredientInDish = await knex("DishesIngredients").where({ ingredient_id: id }).first();
        if (checkIngredientInDish) {
            throw new AppError("Ingredient is used in a dish. Cannot delete it.");
        }

        await knex("Ingredients").where({ id }).delete();

        return response.status(200).json();
    }

    async index(request, response) {
        const ingredients = await knex("Ingredients").orderBy("id", "asc")

        return response.json(ingredients)
    }

    async show(request, response) {
        const { id } = request.params

        const ingredient = await knex("Ingredients").where({ id }).first();

        // check if the ingredient was found
        if (!ingredient) {
            throw new AppError("Ingredient not found.");
        }

        return response.json(ingredient);
    }
}

module.exports = IngredientsController;