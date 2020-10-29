exports.up = function (knex) {
    return knex.schema.createTable('property', function (table) {
        table.increments('Id').primary();
        table.string('Address').notNullable();
        table.string('Description').notNullable();
        table.string('AreaJsonConfig').notNullable();
        table.enu('Type',['Casa','Apartamento','Terreno','Comercial','República']).notNullable();
        table.string('Informations');
        table.timestamp("created_at").defaultTo(new Date().toLocaleString('pt-BR'));

        
        table.integer('User_ID').notNullable();
        table.foreign('User_ID').references('Id').inTable('user');
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('property');
};
