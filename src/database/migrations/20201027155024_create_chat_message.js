exports.up = function (knex) {
    return knex.schema.createTable('chat_message', function (table) {
        table.increments('Id').primary();
        
        table.string('Message');
        table.timestamp("created_at").defaultTo(new Date().toLocaleString('pt-BR'));

        table.integer('User_ID').notNullable();
        table.foreign('User_ID').references('Id').inTable('user');
        table.integer('Chat_ID').notNullable();
        table.foreign('Chat_ID').references('Id').inTable('chat');
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('chat_message');
};
