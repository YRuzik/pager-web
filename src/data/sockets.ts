let webSocketConnection = null;

export function connectToWebSocket(userID: string) {
    if (userID === "" && userID === null) {
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
        webSocketConnection = new WebSocket(`ws://localhost:4001/ws/${userID}/`);
        return {
            message: "You are connected to Chat Server",
            webSocketConnection
        }
    }
}