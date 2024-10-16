
exports.up = (knex) => {
  return knex.schema.createTable('Ingredients', function(table) {
    table.increments('id').primary().notNullable().unique();
    table.string('name').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at');
  }).then(() => {
    return knex.raw(`
      CREATE TRIGGER update_ingredients_timestamp
      BEFORE UPDATE ON Ingredients
      FOR EACH ROW
      BEGIN
        UPDATE Ingredients SET updated_at = datetime('now') WHERE id = NEW.id;
      END;
    `);
  });
};

exports.down = (knex) => {
    return knex.schema.dropTable('Ingredients');
};
