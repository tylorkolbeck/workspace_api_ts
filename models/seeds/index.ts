import bcrypt from "bcryptjs";

import { users } from "./seedData/users";
import { notes } from "./seedData/notes";
import { workspaces } from "./seedData/workspaces";
import { workspace_user } from "./seedData/workspace_user";
import { workspace_join_requests } from "./seedData/workspace_join_requests";
import { Knex } from "knex";

exports.seed = async function (knex: Knex) {
    // Deletes ALL existing entries

    // First set all notes user_id to null
    // so that all notes can be deleted
    // with foreign key relations
    return Promise.all([
        await knex("notes").update({
            user_id: null,
        }),

        // USERS
        await knex("users")
            .del()
            .then(function () {
                return knex("users").insert(
                    users.map((user) => {
                        return {
                            ...user,
                            password: bcrypt.hashSync(user.password, 8),
                        };
                    })
                );
            }),

        // WORKSPACES
        await knex("workspaces")
            .del()
            .then(function () {
                return knex("workspaces").insert(workspaces);
            }),

        // NOTES
        await knex("notes")
            .del()
            .then(function () {
                return knex("notes").insert(notes);
            }),

        // WORKSPACE_USER
        await knex("workspace_user")
            .del()
            .then(function () {
                return knex("workspace_user").insert(workspace_user);
            }),

        // WORKSPACE JOIN REQUESTS
        await knex("workspace_join_requests")
            .del()
            .then(function () {
                return knex("workspace_join_requests").insert(
                    workspace_join_requests
                );
            }),
    ]);
};
