const knex = require('../database/knex');
const AppError = require('../utils/AppError');

class SearchController {
    async search(request, response) {
        const { query } = request.params;

        if (!query) {
            throw new AppError('Search query must be provided');
        }

        let dishes = await knex('Dishes')
            .whereLike('name', `%${query}%`)
            .orderBy('name');

        const ingredients = await knex('Ingredients')
            .whereLike('name', `%${query}%`)
            .orderBy('name');
        
        // if query is an ingredients object, filter the dishes by it
        if (ingredients.length > 0) {
            const ingredientIds = ingredients.map(ingredient => ingredient.id);
            dishes = await knex('Dishes')
                .whereIn('id', function() {
                    this.select('dish_id')
                        .from('DishIngredients')
                        .whereIn('ingredient_id', ingredientIds);
                })
                .orderBy('name');
        }

        return response.json({ dishes });
    }
}

module.exports = SearchController;