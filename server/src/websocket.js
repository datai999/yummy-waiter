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

const onConnection = ws => {
    ws.on('error', console.error);

    ws.on('message', (message, isBinary) => {
        const messageConvert = isBinary ? message : message.toString();
        const data = JSON.parse(messageConvert, JSON_reviver);
        console.log(`[${new Date().toLocaleTimeString()}]<${data.clientId}><${data.type}>
                                ${data.type !== 'MESSAGE' ? null : `:${data.payload}`}`);

        if (data.type === 'TABLE') {
            boardcastMessageExceptOwner(ws, messageConvert);
        }
    });

    ws.on('close', () => {
        console.log(`[${new Date().toLocaleTimeString()}]:Client disconnected:${JSON.stringify(ws)}`);
    });
};

const boardcastMessageExceptOwner = (ws, message) => {
    wss.clients.forEach(client => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
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