import knex from 'knex';

// // Code referenced using knex documentation
// DB config
const db: any = knex({
  client: 'sqlite3',
  connection: {
    filename: './out/database.sqlite'
  },
  useNullAsDefault: true,
});

export default db;