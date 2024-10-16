
exports.up = (knex) => {
    return knex.schema.createTable('Favourites', function(table) {
      table.increments('id').primary().notNullable().unique();
      table.integer('user_id').notNullable().references('id').inTable('Users');
      table.integer('dish_id').notNullable().references('id').inTable('Dishes');
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at');
    }).then(() => {
      return knex.raw(`
        CREATE TRIGGER update_favourites_timestamp
        BEFORE UPDATE ON Favourites
        FOR EACH ROW
        BEGIN
          UPDATE Favourites SET updated_at = datetime('now') WHERE id = NEW.id;
        END;
      `);
    });
  };
  
  exports.down = (knex) => {
      return knex.schema.dropTable('Favourites');
  };
  