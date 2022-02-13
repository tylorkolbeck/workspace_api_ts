import knex, { Knex } from "knex";
import { Model } from "objection";

class KnexDb {
    private _knex: Knex;

    constructor(config: Knex.Config) {
        this._knex = knex(config);
        Model.knex(this._knex);
    }

    get knex(): Knex {
        return this._knex;
    }

    public async initDatabase(): Promise<string> {
        const connected = await this._knex.raw("SELECT 1");
        let result = connected ? "Connected to db" : "Could not connect to db";
        return result;
    }
}

export default KnexDb;
