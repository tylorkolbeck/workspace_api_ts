import { Model } from "objection";
var path = require("path");

class WorkspaceUser extends Model {
    id!: number;
    workspace_id!: number;
    user_id!: number;
    created_at!: string;
    updated_at!: string;

    static tableName = "workspace_user";

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
            // users: {
            //     relation: Model.HasManyRelation,
            //     modelClass: path.join(
            //         __dirname,
            //         "..",
            //         "UserModel",
            //         "UserModel"
            //     ),
            //     join: {
            //         from: "workspace_user.user_id",
            //         to: "users.id",
            //     },
            // },
            workspace_info: {
                relation: Model.HasOneRelation,
                modelClass: path.join(__dirname, "WorkspaceModel"),
                join: {
                    from: "workspace_user.workspace_id",
                    to: "workspaces.id",
                },
            },
        };
    };
}

export default WorkspaceUser;
