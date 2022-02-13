import { Application, RequestHandler } from "express";
import http from "http";
import KnexDb from "./models";
import Controller from "./Typings/Controller";
import * as socketio from "socket.io";

class Server {
    private app: Application;
    private readonly port: number;
    private database: KnexDb;
    private server: http.Server;
    public io: socketio.Socket;

    constructor(app: Application, db: KnexDb, port: number) {
        this.app = app;
        this.port = port;
        this.database = db;

        this.server = require("http").Server(app);
        this.io = require("socket.io")(this.server);

        this.io.on("connection", function (socket: any) {
            console.log("a user connected");
        });

        return this;
    }

    public run(): http.Server {
        return this.app.listen(this.port, () => {
            console.log(`Server running on port ${this.port}`);
        });
    }

    public loadMiddleware(middlewares: Array<RequestHandler>): void {
        middlewares.forEach((middleware) => {
            this.app.use(middleware);
        });
    }

    public loadControllers(controllers: Array<Controller>): void {
        controllers.forEach((controller) => {
            this.app.use(controller.path, controller.setRoutes());
        });
    }

    public async initDatabase(): Promise<void> {
        try {
            const connection = await this.database.initDatabase();
            if (connection) console.log("Connected to database");
        } catch (error) {
            console.log("Could not connect to database ", error);
        }
    }
}

export default Server;
