import { instanceToPlain, plainToInstance } from "class-transformer";
import { LockedTable, Table } from "./my-class";
import { JSON_replacer, JSON_reviver } from "./my-util";

let websocket: WebSocket;
let clienId: string;

export enum SYNC_TYPE {
    REQUEST,
    USERS,
    MENU,
    ACTIVE_TABLES,
    LOCKED_TABLES,
    DONE_ORDER,
}

export const syncServer = (type: SYNC_TYPE, data: any) => {
    const message = JSON.stringify({
        senter: clienId,
        type: SYNC_TYPE[type],
        payload: instanceToPlain(data),
    });
    websocket.send(message);
}

const initWsClient = (username: string,
    onSyncTables: (senter: string, tables: Map<String, Table>) => void,
    onLockTables: (senter: string, lockedTables: Map<string, LockedTable>) => void,
    onDoneOrders: (senter: string, tables: Map<String, Table>) => void,
) => {
    clienId = username;
    websocket = new WebSocket('ws://192.168.12.182:8080' + '/' + clienId);

    websocket.onopen = () => {
        console.log(`WebSocket is connected:${clienId}`);
        websocket.send(JSON.stringify({
            senter: clienId,
            type: SYNC_TYPE[SYNC_TYPE.REQUEST],
            payload: "INITIAL",
        }));
    };

    websocket.onmessage = (evt) => {
        const data = JSON.parse(evt.data);
        // console.info(`[${formatTime()}]<${data.senter}><${data.type}>:Received message`);
        if (data.type === SYNC_TYPE[SYNC_TYPE.USERS]) {
            localStorage.setItem("users", JSON.stringify(data.payload));
        }
        if (data.type === SYNC_TYPE[SYNC_TYPE.MENU]) {
            localStorage.setItem("menu", JSON.stringify(data.payload));
        }
        if (data.type === SYNC_TYPE[SYNC_TYPE.ACTIVE_TABLES]) {
            const tables = new Map(Object.entries(data.payload)
                .map(([tableId, tableJson]) => [tableId, plainToInstance(Table, tableJson)]));
            onSyncTables(data.senter, tables);
        }
        if (data.type === SYNC_TYPE[SYNC_TYPE.LOCKED_TABLES]) {
            const lockedTables = new Map<string, LockedTable>(Object.entries(data.payload)
                .map(([tableId, lockedTable]) => [tableId, plainToInstance(LockedTable, lockedTable)]));
            onLockTables(data.senter, lockedTables);
        }
        if (data.type === SYNC_TYPE[SYNC_TYPE.DONE_ORDER]) {
            const tables = new Map(Object.entries(data.payload)
                .map(([tableId, tableJson]) => [tableId, plainToInstance(Table, tableJson)]));
            onDoneOrders(data.senter, tables);
        }
    };

    websocket.onclose = () => {
        console.log(`WebSocket is closed:${clienId}`);
    };

    return () => {
        websocket.close();
    };
}

export default initWsClient;