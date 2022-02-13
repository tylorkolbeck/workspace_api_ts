import { Server } from "socket.io";

type EventHandlerFn = () => void;

abstract class SocketEvent {
    public event: string;
    public eventHandler: EventHandlerFn;

    constructor(route: string, eventHandler: EventHandlerFn) {
        this.event = route;
        this.eventHandler = eventHandler;
    }
}

export default SocketEvent;
