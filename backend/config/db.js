const config = require('../knexfile.js');
const knex = require('knex')(config);


async function runMigrations() {
  try {
    await knex.migrate.latest();
    console.log('Migrações executadas com sucesso!');
  } catch (error) {
    console.error('Erro ao executar migrações:', error);
  }
}

runMigrations(); // Chama a função para executar migrações

module.exports = knex;