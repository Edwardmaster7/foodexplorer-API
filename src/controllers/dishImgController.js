
const knex = require('../database/knex')
const DiskStorage = require('../providers/DiskStorage')
const path = require('path')

class DishImgController {

    async update(request, response) {
        const { id } = request.params
        const imgFilename = request.file.filename

        const diskStorage = new DiskStorage()

        const dish = await knex('Dishes').where('id', id).first()

        console.log(dish)

        if (dish.image) {
           await diskStorage.deleteFile(dish.image)
        }

        await diskStorage.saveFile(imgFilename)
        
        dish.image = imgFilename

        const updatedDish = await knex('Dishes').where('id', id).update({ image: dish.image }).returning('*')

        return response.json(updatedDish)
    }
}

module.exports = DishImgController