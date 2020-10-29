exports.up = function (knex) {
    return knex.schema.createTable('property_images', function (table) {
        table.increments('Id').primary();
        table.string('Description');
        table.string('ImageUrl');
        table.timestamp("created_at").defaultTo(new Date().toLocaleString('pt-BR'));
        
        table.integer('Property_ID').notNullable();
        table.foreign('Property_ID').references('Id').inTable('property');
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('property_images');
};
