exports.up = function (knex) {
    return knex.schema.createTable('imagens_propriedade', function (table) {
        table.increments('Id').primary();
        table.string('ImageFileName');
        table.string('ImageUrl');
        table.timestamp("DataCriacao").defaultTo(knex.fn.now());
        
        table.integer('Propriedade_ID').notNullable();
        table.foreign('Propriedade_ID').references('Id').inTable('propriedade');
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('imagens_propriedade');
};
