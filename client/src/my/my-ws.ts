import { Table } from "myTable";
import { JSON_replacer, JSON_reviver } from "./my-util";

let websocket: WebSocket;
let clienId: string;

export enum SYNC_TYPE {
    MESSAGE,
    REQUEST,
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

const initWsClient = (username: string, onSyncTables: (tables: Map<String, Table>) => void) => {
    clienId = username;
    websocket = new WebSocket('ws://192.168.12.182:8080');

    websocket.onopen = () => {
        console.log('WebSocket is connected');
        websocket.send(JSON.stringify({
            senter: clienId,
            type: SYNC_TYPE[SYNC_TYPE.REQUEST],
            payload: "TABLES_ACTIVE",
        }));
    };

    websocket.onmessage = (evt) => {
        const data = JSON.parse(evt.data, JSON_reviver);
        console.log(`[${new Date().toLocaleTimeString()}]<${data.senter}><${data.type}>:Received message`);
        if (data.type === SYNC_TYPE[SYNC_TYPE.REQUEST]) {
            onSyncTables(new Map(Object.entries(data.payload)));
        }
        if (data.type === SYNC_TYPE[SYNC_TYPE.TABLE]) {
            onSyncTables(new Map(Object.entries(data.payload)));
        }
    };

    websocket.onclose = () => {
        console.log('WebSocket is closed');
    };

    return () => {
        websocket.close();
    };
}

export default initWsClient;