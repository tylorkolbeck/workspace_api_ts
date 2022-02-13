import express, {
    Application,
    RequestHandler,
    urlencoded,
    json,
} from "express";
import Server from "./Server";
import cors from "cors";
import { NODE_ENV, PORT } from "./config";
import controllers from "./controllers";
import KnexDb from "./models";
import dbConfig from "./models/dbConfig";

const globalMiddleware: Array<RequestHandler> = [
    urlencoded({ extended: false }),
    json(),
    cors({ credentials: true, origin: true }),
];

// DB setup
const db: KnexDb = new KnexDb(dbConfig[NODE_ENV!]);

// Express setup
const app: Application = express();

// Initialize server
const server: Server = new Server(app, db, PORT);

Promise.resolve()
    .then(() => server.initDatabase())
    .then(() => {
        // Global middleware setup
        server.loadMiddleware(globalMiddleware);

        // Load controllers into server
        server.loadControllers(controllers);

        // Start the server
        server.run();
    });
