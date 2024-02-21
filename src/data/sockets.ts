import { ClientActionsApi } from './api.ts';

let webSocketConnection: WebSocket | null = null;

export function connectToWebSocket(userID: string) {
    if (userID === '' && userID === null) {
        return {
            message: 'You need User ID to connect to the Chat server',
            webSocketConnection: null,
        };
    } else if (!window['WebSocket']) {
        return {
            message: "Your Browser doesn't support Web Sockets",
            webSocketConnection: null,
        };
    }
    if (window['WebSocket']) {
        webSocketConnection = new WebSocket(`${import.meta.env.VITE_APIWSHOST}/ws/${userID}/`);

        webSocketConnection.onopen = function () {
            new ClientActionsApi().UpdateConnectionState({
                Online: true,
                LastStampMillis: Date.now(),
            });
        };

        webSocketConnection.onclose = function () {
            new ClientActionsApi().UpdateConnectionState({
                Online: false,
                LastStampMillis: Date.now(),
            });
        };
    }
}

export const closeWebSocket = () => {
    if (webSocketConnection !== null) {
        webSocketConnection.close();
    }
};
