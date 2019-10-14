const WebSocket = require('ws');
const express = require('express');
const http = require('http');

const app = express();
const server = http.createServer(app);

const wss = new WebSocket.Server({ server });

// const ws = new WebSocket('ws://localhost:2222/local');

wss.on('open', function open() {
  ws.send('something');
});

wss.on('message', function incoming(data) {
  console.log(data);
});

server.listen(2222, () => {
  console.log(`Server started!`);
});
