exports.up = (knex) => {
    return knex.schema.createTable('Orders', function(table) {
      table.increments('id').primary().notNullable().unique();
      table.integer('user_id').notNullable().references('id').inTable('Users');
      table.string('status').notNullable().defaultTo('pending');
      table.decimal('total_price', 8, 2).notNullable().defaultTo(0.00);
      table.string('payment_method').notNullable();
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at');
    }).then(() => {
      return knex.raw(`
        CREATE TRIGGER update_orders_timestamp
        BEFORE UPDATE ON Orders
        FOR EACH ROW
        BEGIN
          UPDATE Orders SET updated_at = datetime('now') WHERE id = NEW.id;
        END;
      `);
    });
  };
  
  exports.down = (knex) => {
    return knex.schema.dropTable('Orders');
  };
  