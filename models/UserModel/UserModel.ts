// import { Model } from "objection";
import { Model } from "objection";

class User extends Model {
    id!: number;
    email!: string;
    password!: string;
    name!: string;
    role!: string;
    confirmationCode!: string;
    activated!: boolean;

    created_at!: string;
    updated_at!: string;

    static tableName = "users";

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
        required: ["password", "email"],
    };
}

export default User;
