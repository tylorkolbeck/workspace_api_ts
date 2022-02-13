import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    // USER
    await knex.schema.createTable("users", function (table) {
        table.increments("id").primary();
        table.string("email").notNullable().unique();
        table.string("name").notNullable();
        table.string("password").notNullable();
        table.boolean("activated").notNullable().defaultTo(false);
        table.string("confirmationCode").unique();
        table.timestamp("created_at").defaultTo(knex.fn.now());
        table.timestamp("updated_at").defaultTo(knex.fn.now());
        table.enu("role", ["admin", "user"]);
    });

    //  WORKSPACE
    await knex.schema.createTable("workspaces", function (table) {
        table.increments("id").primary();
        table.string("name").notNullable();
        table
            .integer("user_id")
            .unsigned()
            .notNullable()
            .references("id")
            .inTable("users")
            .onDelete("CASCADE");
        table.timestamp("created_at").defaultTo(knex.fn.now());
        table.timestamp("updated_at").defaultTo(knex.fn.now());
    });
    //  NOTE
    await knex.schema.createTable("notes", function (table) {
        table.increments("id").primary();
        table.string("title").notNullable();
        table.string("body").notNullable();
        table
            .integer("workspace_id")
            .unsigned()
            .notNullable()
            .references("id")
            .inTable("workspaces")
            .onDelete("CASCADE");
        table.timestamp("created_at").defaultTo(knex.fn.now());
        table.timestamp("updated_at").defaultTo(knex.fn.now());
        table
            .integer("user_id")
            .unsigned()
            .nullable()
            .references("id")
            .inTable("users");
    });
    //  WORKSPACE USER MANY TO MANY INTERMITERARY
    await knex.schema.createTable("workspace_user", function (table) {
        table.unique(["workspace_id", "user_id"]);
        table.increments("id").primary();
        table
            .integer("workspace_id")
            .unsigned()
            .notNullable()
            .references("id")
            .inTable("workspaces")
            .onDelete("CASCADE");

        table
            .integer("user_id")
            .unsigned()
            .notNullable()
            .references("id")
            .inTable("users")
            .onDelete("CASCADE");
        table.timestamp("created_at").defaultTo(knex.fn.now());
        table.timestamp("updated_at").defaultTo(knex.fn.now());
        table.index(["workspace_id", "user_id"]);
    });
    // WORKSPACE REQUESTS MANY TO MANY INTERMITTERARY
    await knex.schema.createTable("workspace_join_requests", function (table) {
        table.increments("id").primary();
        table.unique(["workspace_id", "sent_to_user_id"]);
        table
            .integer("workspace_id")
            .unsigned()
            .notNullable()
            .references("id")
            .inTable("workspaces")
            .onDelete("CASCADE");
        table.timestamp("created_at").defaultTo(knex.fn.now());
        table.timestamp("updated_at").defaultTo(knex.fn.now());
        table.boolean("accepted").notNullable().defaultTo(false);
        table
            .integer("sent_by_user_id")
            .unsigned()
            .notNullable()
            .references("id")
            .inTable("users")
            .onDelete("CASCADE");
        table
            .integer("sent_to_user_id")
            .unsigned()
            .notNullable()
            .references("id")
            .inTable("users")
            .onDelete("CASCADE");
        table.boolean("declined").notNullable().defaultTo(false);
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable("notes");
    await knex.schema.dropTable("workspace_user");
    await knex.schema.dropTable("workspaces");
    await knex.schema.dropTable("users");
    await knex.schema.dropTable("workspace_join_requests");
}
