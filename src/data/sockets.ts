import {io} from "socket.io-client";

export function connectToWebSocket() {
    if (!window["WebSocket"]) {
        return {
            message: "Your Browser doesn't support Web Sockets",
            webSocketConnection: null
        }
    }
    if (window["WebSocket"]) {
        const webSocketConnection = io("ws://localhost:4001/ws");
        console.log('web socket connected')
        return {
            message: "You are connected to Chat Server",
            webSocketConnection
        }
    }
}