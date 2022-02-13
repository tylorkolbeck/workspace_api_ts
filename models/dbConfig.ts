import { Knex } from "knex";

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
const dbConfig: any = {
    development: {
        client: "mysql2",
        connection: {
            host: "127.0.0.1",
            port: 3306,
            user: "root",
            password: "password",
            database: "note_api",
        },
    },
    migrations: {
        tableName: "knex_migrations",
    },
    useNullAsDefault: true,
};

export default dbConfig;
