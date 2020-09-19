exports.up = function (knex) {
    return knex.schema.createTable('usuario', function (table) {
        table.increments('Id').primary();
        table.string('Login', 20).notNullable();
        table.string('Senha', 15).notNullable();
        table.string('Email').notNullable();
        table.string('Contato');
        table.string('Nome');
        
        table.enu('Tipo',['Física','Jurídica']).notNullable();
        table.string('Documento');
        
        table.unique('Login');
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('usuario');
};
