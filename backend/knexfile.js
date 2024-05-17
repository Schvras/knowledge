module.exports = {
  client: 'postgresql',
  connection: {
      host:       process.env.POSTGRES_HOST,
      database:   process.env.POSTGRES_DATABASE,
      user:       process.env.POSTGRES_USER,
      password:   process.env.POSTGRES_PASSWORD,
      ssl:        process.env.POSTGRES_SSL ? { rejectUnauthorized: false } : false,
  },
  migrations: {
    tableName: 'knex_migrations',
    directory: './migrations'
  },
  seeds: {
    directory: './seeds'
  }
};
