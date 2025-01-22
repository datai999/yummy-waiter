const WebSocket = require('ws');

const { loadUsers } = require("./service/userService");
const { loadMenu } = require('./service/menuService');
const { readJsonFile, writeJsonFile } = require('./service/commonService.js');
const { getHistoryOrder } = require('./service/orderService.js');

let wss;

let ACTIVE_TABLES = {
    "Table 7": {
        "id": "Table 7", "status": "ACTIVE", "orderTime": "2025-01-14, 22:15:04:457",
        "bags": {
            "0": {
                "BEEF": { "pho": [{ "time": "2025-01-14, 22:15:04:457", "server": "Tai", "items": { "2025-01-14, 22:15:03:209": { "id": "2025-01-14, 22:15:03:209", "code": "DB", "note": "", "qty": 1, "actualQty": 1, "isPho": true, "combo": "#1:DB", "meats": ["Tái", "Chín", "Gầu", "Gân", "Sách", "BV"], "noodle": "BC", "preferences": ["Tái băm", "Tái riêng"], "referCode": "Bam,R" } } }, { "time": "2025-01-14, 22:15:35:929", "server": "Tai", "items": { "2025-01-14, 22:15:33:673": { "id": "2025-01-14, 22:15:33:673", "code": "XiG`BV", "note": "", "qty": 1, "actualQty": 1, "isPho": true, "combo": "#7:Xi,Gầu,Bò viên", "meats": ["Xi", "Gầu", "BV"], "noodle": "BT", "preferences": ["Không hành", "Không béo", "Ít bánh"], "referCode": "-b,0onion,0Béo" } } }], "nonPho": [{ "time": "2025-01-14, 22:15:35:929", "server": "Tai", "items": { "2025-01-14, 22:15:31:851": { "id": "2025-01-14, 22:15:31:851", "code": "HD", "qty": 1, "actualQty": 1 }, "2025-01-14, 22:15:32:178": { "id": "2025-01-14, 22:15:32:178", "code": "HT", "qty": 1, "actualQty": 1 }, "2025-01-14, 22:15:32:451": { "id": "2025-01-14, 22:15:32:451", "code": "NB", "qty": 1, "actualQty": 1 } } }], "action": ["2025-01-14, 22:15:03:210 [Tai] 1 DB", "2025-01-14, 22:15:31:851:Tai:HD", "2025-01-14, 22:15:32:179:Tai:HT", "2025-01-14, 22:15:32:451:Tai:NB", "2025-01-14, 22:15:33:674 [Tai] 1 XiG`BV"] },
                "CHICKEN": { "pho": [{ "time": "2025-01-14, 22:15:35:929", "server": "Tai", "items": { "2025-01-14, 22:15:23:609": { "id": "2025-01-14, 22:15:23:609", "code": "D", "note": "", "qty": 1, "actualQty": 0, "voided": [{ "trackedIndex": 1, "id": "2025-01-14, 22:15:41:323" }], "isPho": true, "combo": "Đùi", "meats": ["D"], "noodle": "Mì", "preferences": ["Măng", "Khô"], "referCode": "dry,bambo" } } }, { "time": "2025-01-14, 22:15:49:17", "server": "Tai", "items": { "2025-01-14, 22:15:41:323": { "id": "2025-01-14, 22:15:41:323", "code": "D", "note": "", "qty": 1, "actualQty": 1, "void": { "trackedIndex": 0, "id": "2025-01-14, 22:15:23:609" }, "isPho": true, "combo": "Đùi", "meats": ["D"], "noodle": "Mì", "preferences": ["Măng", "Khô"], "referCode": "dry,bambo" }, "2025-01-14, 22:15:46:338": { "id": "2025-01-14, 22:15:46:338", "code": "U", "note": "", "qty": 1, "actualQty": 1, "isPho": true, "combo": "Ức", "meats": ["U"], "noodle": "Mì", "preferences": ["Măng", "Khô"], "referCode": "dry,bambo" } } }], "nonPho": [], "action": ["2025-01-14, 22:15:23:609 [Tai] 1 D", "2025-01-14, 22:15:46:338 [Tai] 1 U"] },
                "DRINK": { "pho": [], "nonPho": [], "action": [] }
            },
            "1": {
                "BEEF": { "pho": [{ "time": "2025-01-14, 22:16:41:74", "server": "Tai", "items": { "2025-01-14, 22:16:31:90": { "id": "2025-01-14, 22:16:31:90", "code": "Pho BK", "note": "", "qty": 1, "actualQty": 1, "isPho": true, "combo": "#8a:Hủ tiếu BK", "meats": ["Pho BK"], "noodle": "BTS", "preferences": ["Ít bánh"], "referCode": "-b" } } }], "nonPho": [], "action": ["2025-01-14, 22:16:31:90 [Tai] 1 Pho BK"] },
                "CHICKEN": { "pho": [], "nonPho": [], "action": [] },
                "DRINK": { "pho": [], "nonPho": [], "action": [] }
            }
        }
    }
};

const initWsServer = () => {
    console.log('Init ws server');
    ACTIVE_TABLES = readJsonFile('active_tables.json');
    wss = new WebSocket.Server({ port: 8080 });
    wss.on('connection', onConnection);
    console.log('Done: Init ws server');
}

module.exports = {
    initWsServer
}

const USERS = {};
const LOCKED_TABLES = {};

const onConnection = (ws, req) => {
    ws.on('error', console.error);

    var userID = req.url.substr(1);
    USERS[userID] = ws;

    console.log(`[${new Date().toLocaleTimeString()}]:<${userID}>:Connected`);

    ws.on('message', (message, isBinary) => {
        const messageConvert = isBinary ? message : message.toString();
        const data = JSON.parse(messageConvert);
        console.log(`[${new Date().toLocaleTimeString()}]:<${data.senter}>:<${data.type}>:
                                ${data.type !== 'MESSAGE' ? '' : `:${data.payload}`}`);

        if (data.type === 'REQUEST') {
            if (data.senter.startsWith('Client'))
                sendMessageTo(ws, JSON.stringify({
                    senter: "SERVER",
                    type: "USERS",
                    payload: loadUsers()
                }));
            else sentDataOnConnect(ws);
        }
        if (data.type === 'ACTIVE_TABLES') {
            updateActiveTable(data.payload);
            boardcastMessageExceptOwner(ws, messageConvert);
        }
        if (data.type === 'LOCKED_TABLES') {
            updateLockedTable(data.payload);
            boardcastMessageExceptOwner(ws, messageConvert);
        }
        if (data.type === 'DONE_ORDER') {
            doneOrder(data.payload);
            boardcastMessageExceptOwner(ws, messageConvert);
        }
        if (data.type === 'HISTORY_ORDER') {
            sendMessageTo(ws, JSON.stringify({
                senter: "SERVER",
                type: data.type,
                payload: getHistoryOrder(data.payload)
            }));
        }
    });

    ws.on('close', () => {
        console.log(`[${new Date().toLocaleTimeString()}]:<${userID}>:Disconnected`);
        delete USERS[userID];
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
    writeJsonFile(ACTIVE_TABLES, 'active_tables');
}

const updateLockedTable = (syncTables) => {
    Object.entries(syncTables).forEach(([tableId, syncTable]) => {
        if (syncTable.locked) {
            LOCKED_TABLES[tableId] = syncTable;
        } else {
            delete LOCKED_TABLES[tableId];
        }
    });
}

const doneOrder = (syncTables) => {
    Object.entries(syncTables).forEach(([tableId, syncTable]) => {
        const orderTime = syncTable.orderTime.replaceAll(':', '-');
        const fileName = orderTime + ', ' + (tableId.startsWith('Togo') ? 'Togo' : tableId);

        const orderTimes = orderTime.split(', ')[0];
        const paths = orderTimes.split('-');
        const filePath = `/orders/${paths[0]}/${paths[1]}/${paths[2]}`;

        writeJsonFile(syncTable, fileName, filePath);
        delete LOCKED_TABLES[tableId];
        delete ACTIVE_TABLES[tableId];
    });
}

const sentDataOnConnect = (ws) => {
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