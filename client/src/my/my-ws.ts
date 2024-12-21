

const initWsClient = () => {
    const websocket = new WebSocket('ws://localhost:8080');

    websocket.onopen = () => {
        console.log('WebSocket is connected');
        const clienId = Math.floor(Math.random() * 10);
        websocket.send(JSON.stringify({
            type: 'message',
            payload: `I'm here: ${clienId}`,
            clientId: clienId
        }));
    };

    websocket.onmessage = (evt) => {
        const message = (evt.data);
        console.log(`Received message: ${message}`);
    };

    websocket.onclose = () => {
        console.log('WebSocket is closed');
    };

    return () => {
        websocket.close();
    };
}

export default initWsClient;