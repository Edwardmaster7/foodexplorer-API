knex = require('../database/knex')

const AppError = require('../utils/AppError')

class FavouritesController {
    async create(request, response) {
        const user_id = request.user.id
        const dish_id = request.params.id
        const isAdmin = request.user.isAdmin

        // check if dish exists
        const dish = await knex('Dishes').where({ id: dish_id }).first()
        if (!dish) {
            throw new AppError('Dish not found')
        }

        // check if user is admin
        if (isAdmin) {
            throw new AppError('Admins can not add a favourite')
        }

        // check if favourite already exists
        const favouriteExists = await knex('Favourites').where({ user_id, dish_id }).first()
        if (favouriteExists) {
            throw new AppError('Favourite already exists')
        }

        const favourite = await knex('Favourites').insert({ user_id, dish_id })

        return response.status(201).json(favourite)
    }

    async delete(request, response) {
        const user_id = request.user.id
        const dish_id = request.params.id

        const favourite = await knex('Favourites').where({ user_id, dish_id }).delete()

        return response.status(204).json(favourite)
    }

    async index(request, response) {
        const user_id = request.user.id
        const isAdmin = request.user.isAdmin

        console.log(isAdmin)

        if (isAdmin) {
            const favourites = await knex('Favourites')
                                    .join('Dishes', 'Favourites.dish_id', '=', 'Dishes.id')
                                    .join('Categories', 'Dishes.category_id', '=', 'Categories.id')
                                    .groupBy('Dishes.category_id', 'Dishes.name', 'Categories.name')
                                    .select('Categories.name as category', 'Dishes.id', 'Dishes.name', 'Dishes.image', knex.raw('COUNT(*) as favouriteCount'))
                                    .orderBy('category')
            
            // const formatted = favourites.reduce((acc, dish) => {
            //     if (!acc[dish.category]) {
            //         acc[dish.category] = [];
            //     }
                
            //     const existingDish = acc[dish.category].find(d => d.name === dish.name);
                
            //     if (existingDish) {
            //         existingDish.favouriteCount++;
            //     } else {
            //         acc[dish.category].push({ ...dish });
            //     }
                
            //     return acc;
            //     }, {});                  

            return response.json(favourites)
        } else {
            const favourites = await knex('Favourites')
                                    .where({ user_id })
                                    .join('Dishes', 'Favourites.dish_id', '=', 'Dishes.id')
                                    .leftJoin('Categories', 'Dishes.category_id', '=', 'Categories.id')
                                    .select('Dishes.*', 'Categories.name as category')

            return response.json(favourites)
        }
    }
}

module.exports = FavouritesController