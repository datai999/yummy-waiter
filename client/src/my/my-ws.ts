import { JSON_replacer, JSON_reviver } from "./my-util";

let websocket: WebSocket;
let clienId: string;

export enum SYNC_TYPE {
    TABLE
}

export const syncServer = (type: SYNC_TYPE, data: any) => {
    const message = JSON.stringify({
        clientId: clienId,
        type: SYNC_TYPE[type],
        payload: data,
    }, JSON_replacer);
    websocket.send(message);
}

const initWsClient = (username: string) => {
    clienId = username;
    websocket = new WebSocket('ws://localhost:8080');

    websocket.onopen = () => {
        console.log('WebSocket is connected');
        websocket.send(JSON.stringify({
            clientId: clienId,
            type: 'message',
            payload: `I'm here: ${clienId}`,
        }));
    };

    websocket.onmessage = (evt) => {
        const message = (evt.data);
        const json = JSON.parse(message, JSON_reviver);
        console.log(json);
        console.log(`Received message: ${json}`);
    };

    websocket.onclose = () => {
        console.log('WebSocket is closed');
    };

    return () => {
        websocket.close();
    };
}

export default initWsClient;