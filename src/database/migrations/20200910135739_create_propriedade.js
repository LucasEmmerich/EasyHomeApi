exports.up = function (knex) {
    return knex.schema.createTable('propriedade', function (table) {
        table.increments('Id').primary();

        table.string('Endereco').notNullable();
        table.string('Descricao').notNullable();
        table.string('AreaJsonConfig').notNullable();
        table.enu('Tipo',['Casa','Apartamento','Terreno','Comercial','República']).notNullable();
        table.string('Informacoes');

        
        table.integer('Usuario_ID').notNullable();
        table.foreign('Usuario_ID').references('Id').inTable('usuario');
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('propriedade');
};
