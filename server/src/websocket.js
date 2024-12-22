const WebSocket = require('ws');

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
const activeTables = {};

const onConnection = (ws, req) => {
    ws.on('error', console.error);

    var userID = parseInt(req.url.substr(1), 10);
    users[userID] = ws;

    ws.on('message', (message, isBinary) => {
        const messageConvert = isBinary ? message : message.toString();
        const data = JSON.parse(messageConvert, JSON_reviver);
        console.log(`[${new Date().toLocaleTimeString()}]<${data.senter}><${data.type}>
                                ${data.type !== 'MESSAGE' ? null : `:${data.payload}`}`);

        if (data.type === 'REQUEST') {
            sendMessageTo(ws, JSON.stringify({
                senter: "SERVER",
                type: 'REQUEST',
                payload: activeTables
            }));
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

const updateActiveTable = (syncTable) => {
    if (syncTable.status === 'ACTIVE') {
        activeTables[syncTable.id] = syncTable;
    } else {
        delete activeTables[syncTable.id];
    }
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