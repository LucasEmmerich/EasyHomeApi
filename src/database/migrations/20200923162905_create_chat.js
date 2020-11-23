exports.up = function (knex) {
    return knex.schema.createTable('chat', function (table) {
        table.increments('Id').primary();
        table.integer('User1_ID').notNullable();
        table.foreign('User1_ID').references('Id').inTable('user');
        table.integer('User2_ID').notNullable();
        table.foreign('User2_ID').references('Id').inTable('user');
        
        table.timestamp("created_at").defaultTo(new Date().toLocaleString('pt-BR'));
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('chat');
};
