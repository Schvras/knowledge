/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('archives', table => {
        table.string('id',1000).primary()
        table.string('name').notNull()
        table.integer('userId').references('id').inTable('users').notNull()
        table.timestamp('createdAt').notNull()
      })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('archives')
};
