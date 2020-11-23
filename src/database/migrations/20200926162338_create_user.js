exports.up = function (knex) {
    return knex.schema.createTable('user', function (table) {
        table.increments('Id').primary();
        table.string('Login').notNullable();
        table.string('Password').notNullable();
        table.string('Document').notNullable();
        table.string('Email').notNullable();
        table.string('Contact').notNullable();
        table.string('FirstName').notNullable();
        table.string('LastName').notNullable();
        table.timestamp("created_at").defaultTo(new Date().toLocaleString('pt-BR'));
        table.enu('Type',['Física','Jurídica']).notNullable();
        
        table.string('ProfileImageUrl');
        
        table.unique('Login');
        table.unique('Document');
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('user');
};
