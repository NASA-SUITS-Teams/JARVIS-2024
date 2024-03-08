const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const fs = require('fs')
const socketIO = require('socket.io');


const CONFIG = JSON.parse(fs.readFileSync('../config.json'));

const PORT_SOC = CONFIG['GATEWAY']['PORT_SOC'];
const PORT_WEB = process.env.PORT || CONFIG['GATEWAY']['PORT_WEB'];
const HOST = CONFIG['GATEWAY']['HOST']


//initialize Express, HTTP Server, and socket io
const app = express();
const server = http.createServer(app);

const io = socketIO(server);

const wss = new WebSocket.Server({ port : PORT_SOC, host : HOST });

server.listen(PORT_WEB, HOST, () => console.log(`Server running on port ${PORT_WEB}`));

let subscribers = [];

wss.on('connection', function connection(ws) {
	subscribers.push(ws);

	ws.on('message', function incoming(message) {
		
		console.log("RECEIVED MESSAGE")
		console.log(JSON.parse(message))
		console.log()

		subscribers.forEach(function each(client) {
			
			//if (client !== ws && client.readyState === WebSocket.OPEN) {
			if (client.readyState === WebSocket.OPEN) {
				client.send(message);
			}
		});
	});
});


// we don't really need a frontend for the gateway, but oh well, here it is
app.get('/', (req, res) => {
  res.send('JARVIS Inter-Device Gateway (what are you doing here?)');
});

// Handle new socket connections
io.on('connection', (socket) => {
	console.log("voice conn")
	socket.broadcast.emit("connection")

    // Handle incoming audio stream
    socket.on('audioStream', (audioData) => {
        socket.broadcast.emit('audioStream', audioData);
    });

    socket.on('disconnect', () => {
    });
});

