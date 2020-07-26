module.exports = ({ env }) => ({
  defaultConnection: "default",
  connections: {
    default: {
      connector: "bookshelf",
      settings: {
        client: "postgres",
        host: env("DATABASE_HOST", "localhost"),
        port: env.int("DATABASE_PORT", 5432),
        database: env("DATABASE_NAME", "database"),
        username: env("DATABASE_USERNAME", "username"),
        password: env("DATABASE_PASSWORD", "password"),
        ssl: env.bool("DATABASE_SSL", false),
      },
      options: {
        pool: {
          min: 0,
          max: 50,
          createTimeoutMillis: 30000,
          acquireTimeoutMillis: 600000,
          idleTimeoutMillis: 30000,
        },
      },
    },
  },
});
