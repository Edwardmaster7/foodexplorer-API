
exports.up = (knex) => {
    return knex.schema.createTable('Dishes', function(table) {
        table.increments('id').primary();
        table.string('name').notNullable();
        table.string('description', 160);
        table.decimal('price', 8, 2).notNullable();
        table.integer('category_id').references('id').inTable('Categories');
        table.text('image')
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at');
        }).then(() => {
            return knex.raw(`
            CREATE TRIGGER update_dishes_timestamp
            BEFORE UPDATE ON Dishes
            FOR EACH ROW
            BEGIN
                UPDATE Dishes SET updated_at = datetime('now') WHERE id = NEW.id;
            END;
            `);
        });
    };

exports.down = (knex) => {
    return knex.schema.dropTable('Dishes');
};
