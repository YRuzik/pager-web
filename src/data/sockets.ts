type Listener<T extends Array<any>> = (...args: T) => void;

export class EventEmitter<EventMap extends Record<string, Array<any>>> {
    private eventListeners: {
        [K in keyof EventMap]?: Set<Listener<EventMap[K]>>;
    } = {};

    on<K extends keyof EventMap>(eventName: K, listener: Listener<EventMap[K]>) {
        const listeners = this.eventListeners[eventName] ?? new Set();
        listeners.add(listener);
        this.eventListeners[eventName] = listeners;
    }

    emit<K extends keyof EventMap>(eventName: K, ...args: EventMap[K]) {
        const listeners = this.eventListeners[eventName] ?? new Set();
        for (const listener of listeners) {
            listener(...args);
        }
    }
}

const CHAT_SERVER_ENDPOINT = "localhost:4001";
let webSocketConnection: WebSocket | null = null;

export const eventEmitter = new EventEmitter()

export function connectToWebSocket(userID: string) {
    if (userID === "" && userID === null && userID === undefined) {
        return {
            message: "You need User ID to connect to the Chat server",
            webSocketConnection: null
        }
    } else if (!window["WebSocket"]) {
        return {
            message: "Your Browser doesn't support Web Sockets",
            webSocketConnection: null
        }
    }
    if (window["WebSocket"]) {
        webSocketConnection = new WebSocket("ws://" + CHAT_SERVER_ENDPOINT + "/ws/" + userID);
        return {
            message: "You are connected to Chat Server",
            webSocketConnection
        }
    }
}

export function listenToWebSocketEvents() {

    if (webSocketConnection === null) {
        return;
    }

    webSocketConnection.onclose = (event) => {
        eventEmitter.emit('disconnect', event);
    };

    webSocketConnection.onmessage = (event) => {
        try {
            const socketPayload = JSON.parse(event.data);
            switch (socketPayload.eventName) {
                case 'chatlist-response':
                    if (!socketPayload.eventPayload) {
                        return
                    }
                    eventEmitter.emit(
                        'chatlist-response',
                        socketPayload.eventPayload
                    );

                    break;

                case 'disconnect':
                    if (!socketPayload.eventPayload) {
                        return
                    }
                    eventEmitter.emit(
                        'chatlist-response',
                        socketPayload.eventPayload
                    );

                    break;

                case 'message-response':

                    if (!socketPayload.eventPayload) {
                        return
                    }

                    eventEmitter.emit('message-response', socketPayload.eventPayload);
                    break;

                default:
                    break;
            }
        } catch (error) {
            console.log(error)
            console.warn('Something went wrong while decoding the Message Payload')
        }
    };
}