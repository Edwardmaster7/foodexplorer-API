
exports.up = (knex) => {
  return knex.schema.createTable('DishIngredients', function(table) {
    table.increments('id').primary().notNullable().unique();
    table.integer('dish_id').notNullable().references('id').inTable('Dishes');
    table.integer('ingredient_id').notNullable().references('id').inTable('Ingredients');
  });
};

exports.down = (knex) => {
  return knex.schema.dropTable('DishIngredients');
};
