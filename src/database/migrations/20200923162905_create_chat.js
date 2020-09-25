exports.up = function (knex) {
    return knex.schema.createTable('chat', function (table) {
        table.increments('Id').primary();
        
        table.string('Message');
        table.timestamp("DataCriacao").defaultTo(knex.fn.now());

        table.integer('From').notNullable();
        table.foreign('From').references('Id').inTable('usuario');
        table.integer('To').notNullable();
        table.foreign('To').references('Id').inTable('usuario');


    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('chat');
};
