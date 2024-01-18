import * as events from "events";

const CHAT_SERVER_ENDPOINT = "localhost:4001";
let webSocketConnection: WebSocket | null = null;

export const eventEmitter = new events.EventEmitter();

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