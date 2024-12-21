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

    ws.on('message', message => {
        const data = JSON.parse(message);
        console.log(`Received: ${data.payload} from client ${data.clientId}`);
        // Broadcast the message to all connected clients
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(`Client ${data.clientId} sent -> ${data.payload}`);
            }
        });
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
};