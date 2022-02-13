const { Model } = require("objection");

class BaseModel extends Model {
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
}
export default BaseModel;
