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

const users = {};
const activeTables = {
    "Table 6": { "id": "Table 6", "status": "ACTIVE", "orderTime": "2024-12-22T19:39:18.726Z", "bags": { "dataType": "Map", "value": [[0, { "beef": { "dataType": "Map", "value": [["12/22/24, 11:39:18 78", { "id": "12/22/24, 11:39:18 78", "meats": ["BPN"], "noodle": "REGULAR", "preferences": [], "note": "", "noodleCode": "BC", "meatCodes": "BPN", "preferenceCodes": "" }]] }, "beefSide": { "dataType": "Map", "value": [] }, "beefUpdated": ["2024-12-22T19:39:18.079Z:add beef"], "chicken": { "dataType": "Map", "value": [] }, "chickenSide": { "dataType": "Map", "value": [] }, "chickenUpdated": [], "drink": { "dataType": "Map", "value": [] }, "dessert": { "dataType": "Map", "value": [] } }], [1, { "beef": { "dataType": "Map", "value": [] }, "beefSide": { "dataType": "Map", "value": [] }, "beefUpdated": [], "chicken": { "dataType": "Map", "value": [] }, "chickenSide": { "dataType": "Map", "value": [] }, "chickenUpdated": [], "drink": { "dataType": "Map", "value": [] }, "dessert": { "dataType": "Map", "value": [] } }]] } }
    , "Table 9": { "id": "Table 9", "status": "ACTIVE", "orderTime": "2024-12-22T19:39:26.373Z", "bags": { "dataType": "Map", "value": [[0, { "beef": { "dataType": "Map", "value": [["12/22/24, 11:39:25 630", { "id": "12/22/24, 11:39:25 630", "meats": ["TENDON"], "noodle": "REGULAR", "preferences": [], "note": "", "noodleCode": "BC", "meatCodes": "g", "preferenceCodes": "" }], ["12/22/24, 11:39:42 694", { "id": "12/22/24, 11:39:42 694", "meats": ["BEEF_BALL"], "noodle": "REGULAR", "preferences": [], "note": "", "noodleCode": "BC", "meatCodes": "BV", "preferenceCodes": "" }]] }, "beefSide": { "dataType": "Map", "value": [] }, "beefUpdated": ["2024-12-22T19:39:25.630Z:add beef", "2024-12-22T19:39:42.694Z:add beef"], "chicken": { "dataType": "Map", "value": [] }, "chickenSide": { "dataType": "Map", "value": [] }, "chickenUpdated": [], "drink": { "dataType": "Map", "value": [] }, "dessert": { "dataType": "Map", "value": [] } }], [1, { "beef": { "dataType": "Map", "value": [] }, "beefSide": { "dataType": "Map", "value": [] }, "beefUpdated": [], "chicken": { "dataType": "Map", "value": [] }, "chickenSide": { "dataType": "Map", "value": [] }, "chickenUpdated": [], "drink": { "dataType": "Map", "value": [] }, "dessert": { "dataType": "Map", "value": [] } }]] } }
}

const onConnection = (ws, req) => {
    ws.on('error', console.error);

    var userID = parseInt(req.url.substr(1), 10);
    users[userID] = ws;

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
        payload: activeTables
    }));

    ws.on('message', (message, isBinary) => {
        const messageConvert = isBinary ? message : message.toString();
        const data = JSON.parse(messageConvert);
        console.log(`[${new Date().toLocaleTimeString()}]<${data.senter}><${data.type}>
                                ${data.type !== 'MESSAGE' ? '' : `:${data.payload}`}`);

        if (data.type === 'REQUEST') {
        }
        if (data.type === 'TABLE') {
            updateActiveTable(data.payload);
            boardcastMessageExceptOwner(ws, messageConvert);
        }
    });

    ws.on('close', () => {
        console.log(`[${new Date().toLocaleTimeString()}]:Client disconnected`);
    });
};

const updateActiveTable = (syncTables) => {
    Object.entries(syncTables).forEach((tableId, syncTable) => {
        if (syncTable.status === 'ACTIVE') {
            activeTables[tableId] = syncTable;
        } else {
            delete activeTables[tableId];
        }
    });
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