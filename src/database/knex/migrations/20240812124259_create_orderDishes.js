
exports.up = (knex) => {
  return knex.schema.createTable('OrderDishes', function(table) {
    table.increments('id').primary();
    table.integer('quantity').notNullable().defaultTo(0);
    table.integer('order_id').notNullable().references('id').inTable('Orders');
    table.integer('dish_id').notNullable().references('id').inTable('Dishes');
  });
};


exports.down = (knex) => {
  return knex.schema.dropTable('OrderDishes');
};
