const dotenv = require('dotenv');

console.log(process.env.NODE_ENV)

const aa = dotenv.config({
  path: `./envConfig/service-config/${process.env.NODE_ENV}.env`
});

module.exports = {
  "type": process.env.PostgreSQLContext_TYPE,
  "host": process.env.PostgreSQLContext_HOST,
  "port": process.env.PostgreSQLContext_PORT,
  "username": process.env.PostgreSQLContext_USERNAME,
  "password": process.env.PostgreSQLContext_PASSWORD,
  "database": process.env.PostgreSQLContext_DATABASE,
  "synchronize": false,
  "logging": false,
  "entities": [
    "src/entity/**/*.ts"
  ],
  "migrations": [
    "src/migration/**/*.ts"
  ],
  "subscribers": [
    "src/subscriber/**/*.ts"
  ],
  "cli": {
    "entitiesDir": "src/entity",
    "migrationsDir": "src/migration",
    "subscribersDir": "src/subscriber"
  },
  seeds: ['src/database/seeds/**/*{.ts,.js}'],
  factories: ['src/database/factories/**/*{.ts,.js}']
}
