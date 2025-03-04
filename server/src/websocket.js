const WebSocket = require('ws');

const { loadUsers } = require("./service/userService");
const { loadMenu } = require('./service/menuService');
const { readJsonFile, writeJsonFile, formatTime, existsSync } = require('./service/commonService.js');
const { getHistoryOrder } = require('./service/orderService.js');

let wss;

let ACTIVE_TABLES = {
    "Table 7": {
        "id": "Table 7", "status": "ACTIVE", "orderTime": "2025-01-14, 22:15:04:457",
        "bags": {
            "0": {
                "BEEF": { "pho": [{ "time": "2025-01-14, 22:15:04:457", "server": "Tai", "items": { "2025-01-14, 22:15:03:209": { "id": "2025-01-14, 22:15:03:209", "code": "DB", "note": "", "qty": 1, "actualQty": 1, "isPho": true, "combo": "#1:DB", "meats": ["Tái", "Chín", "Gầu", "Gân", "Sách", "BV"], "noodle": "BC", "preferences": ["Tái băm", "Tái riêng"], "referCode": "Bam,R" } } }, { "time": "2025-01-14, 22:15:35:929", "server": "Tai", "items": { "2025-01-14, 22:15:33:673": { "id": "2025-01-14, 22:15:33:673", "code": "XiG`BV", "note": "", "qty": 1, "actualQty": 1, "isPho": true, "combo": "#7:Xi,Gầu,Bò viên", "meats": ["Xi", "Gầu", "BV"], "noodle": "BT", "preferences": ["Không hành", "Không béo", "Ít bánh"], "referCode": "-b,0onion,0Béo" } } }], "nonPho": [{ "time": "2025-01-14, 22:15:35:929", "server": "Tai", "items": { "2025-01-14, 22:15:31:851": { "id": "2025-01-14, 22:15:31:851", "code": "HD", "qty": 1, "actualQty": 1 }, "2025-01-14, 22:15:32:178": { "id": "2025-01-14, 22:15:32:178", "code": "HT", "qty": 1, "actualQty": 1 }, "2025-01-14, 22:15:32:451": { "id": "2025-01-14, 22:15:32:451", "code": "NB", "qty": 1, "actualQty": 1 } } }], "action": ["2025-01-14, 22:15:03:210 [Tai] 1 DB", "2025-01-14, 22:15:31:851:Tai:HD", "2025-01-14, 22:15:32:179:Tai:HT", "2025-01-14, 22:15:32:451:Tai:NB", "2025-01-14, 22:15:33:674 [Tai] 1 XiG`BV"] },
                "CHICKEN": { "pho": [{ "time": "2025-01-14, 22:15:35:929", "server": "Tai", "items": { "2025-01-14, 22:15:23:609": { "id": "2025-01-14, 22:15:23:609", "code": "D", "note": "", "qty": 1, "actualQty": 0, "voided": [{ "trackedIndex": 1, "id": "2025-01-14, 22:15:41:323" }], "isPho": true, "combo": "Đùi", "meats": ["D"], "noodle": "Mì", "preferences": ["Măng", "Khô"], "referCode": "dry,bamboo" } } }, { "time": "2025-01-14, 22:15:49:17", "server": "Tai", "items": { "2025-01-14, 22:15:41:323": { "id": "2025-01-14, 22:15:41:323", "code": "D", "note": "", "qty": 1, "actualQty": 1, "void": { "trackedIndex": 0, "id": "2025-01-14, 22:15:23:609" }, "isPho": true, "combo": "Đùi", "meats": ["D"], "noodle": "Mì", "preferences": ["Măng", "Khô"], "referCode": "dry,bamboo" }, "2025-01-14, 22:15:46:338": { "id": "2025-01-14, 22:15:46:338", "code": "U", "note": "", "qty": 1, "actualQty": 1, "isPho": true, "combo": "Ức", "meats": ["U"], "noodle": "Mì", "preferences": ["Măng", "Khô"], "referCode": "dry,bamboo" } } }], "nonPho": [], "action": ["2025-01-14, 22:15:23:609 [Tai] 1 D", "2025-01-14, 22:15:46:338 [Tai] 1 U"] },
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
let VIEWING = { 'cashier': '', 'orderId': '', 'phone': '', receipt: null };
let CASHIER_USER = null;
let CUSTOMER_USER = null;

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
        else if (data.type === 'USERS') {
            writeJsonFile(data.payload, 'users');
            boardcastMessageExceptOwner(ws, messageConvert);
        }
        if (data.type === 'MENU') {
            writeJsonFile(data.payload, 'menu');
            boardcastMessageExceptOwner(ws, messageConvert);
        }
        if (data.type === 'ACTIVE_TABLES') {
            updateActiveTable(data.payload);
            boardcastMessageExceptOwner(ws, messageConvert);
        }
        if (data.type === 'LOCKED_TABLES') {
            updateLockedTable(data.payload);
            boardcastMessageExceptOwner(ws, messageConvert);
        }
        if (data.type === 'ON_CUSTOMER') {
            CUSTOMER_USER = ws;
            sendMessageTo(ws, JSON.stringify({
                senter: "SERVER",
                type: data.type,
                payload: VIEWING
            }));
        }
        if (data.type === 'ON_CASHIER') {
            CASHIER_USER = ws;
            VIEWING.cashier = data.payload.cashier;
            VIEWING.receipt = data.payload.receipt;
            sendMessageTo(CUSTOMER_USER, JSON.stringify({
                senter: "CASHIER",
                type: data.type,
                payload: VIEWING
            }));
        }
        if (data.type === 'CUSTOMER_VIEW_ORDER') {
            if (data.payload.view) VIEWING.orderId = data.payload.orderId;
            else VIEWING = { 'orderId': '', 'phone': '' };
            sendMessageTo(ws, JSON.stringify({
                senter: "SERVER",
                type: data.type,
                payload: VIEWING
            }));
        }
        if (data.type === 'GET_CUSTOMER') {
            const customer = linkCustomer(ws, data.payload);
            sendMessageTo(ws, JSON.stringify({
                senter: "SERVER",
                type: data.type,
                payload: customer
            }));
        }
        if (data.type === 'DONE_ORDER') {
            CASHIER_USER = null;
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

const linkCustomer = (ws, body) => {
    VIEWING.phone = body.phone;
    VIEWING.orderId = body.receipt.id;

    const path = `customers/${VIEWING.phone}.json`;
    let customer;
    if (existsSync(path))
        customer = readJsonFile(path);
    else {
        customer = {
            'phone': body.phone,
            'createdAt': formatTime(),
            'totalPoint': 0,
            'point': 0,
            'prePoint': 0,
            'rewardsTime': []
        };
    };

    VIEWING.customer = customer;

    // customer -> cashier
    if (ACTIVE_TABLES[VIEWING.orderId]) {
        ACTIVE_TABLES[VIEWING.orderId].customer = customer;
        customer.prePoint = customer.point;

        const newOrder = { [VIEWING.orderId]: ACTIVE_TABLES[VIEWING.orderId] };

        updateActiveTable(newOrder);
        boardcastMessage(ws, JSON.stringify({
            senter: "CUSTOMER",
            type: 'ACTIVE_TABLES',
            payload: newOrder
        }));

        return customer;
    }

    // cashier -> customer
    const orderPath = getOrderPathAndName(body.receipt);
    const receipt = readJsonFile(orderPath[1] + '/' + readJsonFile[0] + '.json');
    receipt.customer = customer;
    writeJsonFile({ ...receipt, point: customer.point + body.newPoint }, orderPath.fullPath);

    customerChangePoint(customer, body.newPoint);

    return customer;
}

const customerChangePoint = (customer, newPoint) => {
    customer.totalPoint += newPoint;
    customer.prePoint = customer.point;
    customer.point += newPoint;
    if (customer.point >= 100) {
        customer.point -= 100;
        customer.rewardsTime = [...customer.rewardsTime, formatTime()]
    }
    writeJsonFile(customer, customer.phone, '/customers');
}

const getOrderPathAndName = (order) => {
    const orderTime = order.orderTime.replaceAll(':', '-');
    const fileName = orderTime + ', ' + (order.id.startsWith('Togo') ? 'Togo' : order.id);

    const orderTimes = orderTime.split(', ')[0];
    const paths = orderTimes.split('-');
    const path = `/orders/${paths[0]}/${paths[1]}/${paths[2]}`;
    return { fileName, path, fullPath: path + '/' + fileName };
}

const doneOrder = (syncTables) => {
    Object.entries(syncTables).forEach(([tableId, syncTable]) => {  
        const orderPath = getOrderPathAndName(syncTable);
        writeJsonFile(syncTable, orderPath[0], orderPath[1]);

        if (syncTable.customer?.phone) {
            customerChangePoint(syncTable.customer, Math.floor(syncTable.finalTotal));
        }

        delete LOCKED_TABLES[tableId];
        delete ACTIVE_TABLES[tableId];
        writeJsonFile(ACTIVE_TABLES, 'active_tables');
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

const boardcastMessage = (ws, message) => {
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
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