
exports.up = (knex) => {
    return knex.schema.createTable('Categories', function(table) {
      table.increments('id').primary().notNullable().unique();
      table.string('name')
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at');
    }).then(() => {
      return knex.raw(`
        CREATE TRIGGER update_categories_timestamp
        BEFORE UPDATE ON Categories
        FOR EACH ROW
        BEGIN
          UPDATE Categories SET updated_at = datetime('now') WHERE id = NEW.id;
        END;
      `);
    });
  };
  
  exports.down = (knex) => {
      return knex.schema.dropTable('Categories');
  };
  