import { Model, RelationMappings, RelationMappingsThunk } from "objection";
// import WorkspaceUser from "./WorkspaceUser.model";
var path = require("path");
// import UserModel from "../UserModel/UserModel";

class Workspace extends Model {
    id!: number;
    name!: string;
    user_id!: number;
    created_at!: string;
    updated_at!: string;

    static tableName = "workspaces";

    $beforeInsert() {
        this.created_at = new Date()
            .toISOString()
            .slice(0, 19)
            .replace("T", " ");
        this.updated_at = new Date()
            .toISOString()
            .slice(0, 19)
            .replace("T", " ");
    }

    static jsonSchema = {
        type: "object",
    };

    static relationMappings = () => {
        return {
            users: {
                relation: Model.ManyToManyRelation,
                // modelClass: UserModel,
                modelClass: path.join(
                    __dirname,
                    "..",
                    "UserModel",
                    "UserModel"
                ),
                join: {
                    from: "workspaces.id",
                    through: {
                        from: "workspace_user.workspace_id",
                        to: "workspace_user.user_id",
                    },
                    to: "users.id",
                },
            },
        };
    };
}

export default Workspace;
