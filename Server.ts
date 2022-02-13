import { Application, RequestHandler } from "express";
import http from "http";
import KnexDb from "./models";
import Controller from "./Typings/Controller";
import SocketServer from "./SocketServer";

class Server {
    private app: Application;
    private readonly port: number;
    private database: KnexDb;
    private server: http.Server;

    constructor(app: Application, db: KnexDb, port: number) {
        this.app = app;
        this.port = port;
        this.database = db;
        this.server = http.createServer(app);

        // Bind socket server to http server
        const socketServer = new SocketServer([
            {
                event: "connection",
                eventHandler: () => console.log("USER CONNECTED"),
            },
        ]);
        socketServer.bindHttpServer(this.server);
        socketServer.bindSocketEvents();
    }

    public run(): http.Server {
        return this.server.listen(this.port, () => {
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
