const WebSocket = require('ws');

const { loadUsers } = require("./service/userService");
const { loadMenu } = require('./service/menuService');

let wss;

const initWsServer = () => {
    console.log('Init ws server');
    wss = new WebSocket.Server({ port: 8080 });
    wss.on('connection', onConnection);
    console.log('Done: Init ws server');
}

module.exports = {
    initWsServer
}

const USERS = {};
const LOCKED_TABLES = {};
const ACTIVE_TABLES = {
    "Table 7": {
        "id": "Table 7", "status": "ACTIVE", "orderTime": "2025-01-06T07:21:21.377Z", "timer": 0,
        "bags": {
            "0": {
                "BEEF": {
                    "pho": [
                        { "time": "2025-01-06T07:21:21.377Z", "staff": "Tài", "items": { "1/5/25, 23:21:19 560": { "id": "1/5/25, 23:21:19 560", "meats": ["BPN"], "noodle": "BC", "qty": 1 } } }
                    ],
                    "nonPho": [],
                    "action": ["2025-01-06T07:21:19.560Z:add pho"]
                },
                "CHICKEN": { "pho": [], "nonPho": [], "action": [] },
                "DRINK": { "pho": [], "nonPho": [], "action": [] }
            },
            "1": { "BEEF": { "pho": [], "nonPho": [], "action": [] }, "CHICKEN": { "pho": [], "nonPho": [], "action": [] }, "DRINK": { "pho": [], "nonPho": [], "action": [] } }
        }
    },
    "Table 5": {
        "id": "Table 5", "status": "ACTIVE", "orderTime": "2025-01-06T07:26:39.775Z", "timer": 0,
        "bags": {
            "0": {
                "BEEF": {
                    "pho": [
                        { "time": "2025-01-06T07:26:39.775Z", "staff": "Tài", "items": { "1/5/25, 23:26:38 856": { "id": "1/5/25, 23:26:38 856", "meats": ["BPN"], "noodle": "BC", "qty": 1 } } }
                    ],
                    "nonPho": [],
                    "action": ["2025-01-06T07:26:38.856Z:add pho"]
                },
                "CHICKEN": { "pho": [], "nonPho": [], "action": [] },
                "DRINK": { "pho": [], "nonPho": [], "action": [] }
            },
            "1": { "BEEF": { "pho": [], "nonPho": [], "action": [] }, "CHICKEN": { "pho": [], "nonPho": [], "action": [] }, "DRINK": { "pho": [], "nonPho": [], "action": [] } }
        }
    }
}

const onConnection = (ws, req) => {
    ws.on('error', console.error);

    var userID = parseInt(req.url.substr(1), 10);
    USERS[userID] = ws;

    sentDataOnConnect(ws);

    ws.on('message', (message, isBinary) => {
        const messageConvert = isBinary ? message : message.toString();
        const data = JSON.parse(messageConvert);
        console.log(`[${new Date().toLocaleTimeString()}]<${data.senter}><${data.type}>
                                ${data.type !== 'MESSAGE' ? '' : `:${data.payload}`}`);

        if (data.type === 'REQUEST') {
        }
        if (data.type === 'ACTIVE_TABLES') {
            updateActiveTable(data.payload);
            boardcastMessageExceptOwner(ws, messageConvert);
        }
        if (data.type === 'LOCKED_TABLES') {
            updateLockedTable(data.senter, data.payload);
            boardcastMessageExceptOwner(ws, messageConvert);
        }
    });

    ws.on('close', () => {
        console.log(`[${new Date().toLocaleTimeString()}]:Client disconnected`);
    });
};

const updateActiveTable = (syncTables) => {
    Object.entries(syncTables).forEach(([tableId, syncTable]) => {
        if (syncTable.status === 'ACTIVE') {
            ACTIVE_TABLES[tableId] = syncTable;
        } else {
            delete ACTIVE_TABLES[tableId];
        }
    });
}

const updateLockedTable = (senter, syncTables) => {
    Object.entries(syncTables).forEach(([tableId, syncTable]) => {
        if (syncTable) {
            LOCKED_TABLES[tableId] = senter;
        } else {
            delete LOCKED_TABLES[tableId];
        }
    });
}

const sentDataOnConnect = (ws) => {
    sendMessageTo(ws, JSON.stringify({
        senter: "SERVER",
        type: "USERS",
        payload: loadUsers()
    }));

    sendMessageTo(ws, JSON.stringify({
        senter: "SERVER",
        type: "MENU",
        payload: loadMenu()
    }));

    sendMessageTo(ws, JSON.stringify({
        senter: "SERVER",
        type: 'ACTIVE_TABLES',
        payload: ACTIVE_TABLES
    }));

    sendMessageTo(ws, JSON.stringify({
        senter: "SERVER",
        type: 'LOCKED_TABLES',
        payload: LOCKED_TABLES
    }));
}

const boardcastMessageExceptOwner = (ws, message) => {
    wss.clients.forEach(client => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
}

const sendMessageTo = (ws, message) => {
    wss.clients.forEach(client => {
        if (client === ws && client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
}

const JSON_reviver = (key, value) => {
    if (typeof value === 'object' && value !== null) {
        if (value.dataType === 'Map') {
            // console.log(value.value);
            return value.value.reduce((json, value, key) => { json[key] = value[1]; return json; }, {});
        }
    }
    return value;
}