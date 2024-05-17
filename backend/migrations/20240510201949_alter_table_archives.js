/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.alterTable('archives', table => {
      table.dropPrimary();
      table.dropColumn('id');
      table.string('id', 1000).primary();
    });
  };

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.alterTable('archives', table => {
      table.dropPrimary();
      table.dropColumn('id');
      table.integer('id').primary();
    });
  };
