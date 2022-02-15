import http from "http";
import { Server } from "socket.io";
import SocketEvent from "./Typings/SocketEvent";

class SocketServer {
    public io!: Server;
    private socketEvents: SocketEvent[] = [];

    constructor(socketEvents: SocketEvent[]) {
        this.socketEvents = socketEvents;
    }

    public bindHttpServer(httpServer: http.Server) {
        this.io = new Server(httpServer, {
            cors: {
                origin: "http://localhost:3000",
            },
        });
    }

    public bindSocketEvents() {
        this.socketEvents.forEach((event: SocketEvent) => {
            this.io?.on(event.event, event.eventHandler);
        });
    }
}

export default SocketServer;
