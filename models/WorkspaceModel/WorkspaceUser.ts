import { Model } from "objection";

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
}

export default WorkspaceUser;
