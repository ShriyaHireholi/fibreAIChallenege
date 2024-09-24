import knex from 'knex';

const db: any = knex({
  client: 'sqlite3',
  connection: {
    filename: './out/database.sqlite'
  },
  useNullAsDefault: true,
});

export default db;