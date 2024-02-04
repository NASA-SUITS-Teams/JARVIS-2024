const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

//initialize Express, HTTP Server, and socket io
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve a simple test page
app.get('/', (req, res) => {
  res.send('Hi! Testing Yay');
});

// listens for new websocket connections
io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });



  // Example: listening for a custom event
  socket.on('example_event', (data) => {
    console.log('Example event received:', data);
    // Broadcast the data to all connected clients
    io.emit('example_response', { message: 'Data received!' });
  });
});


//Starting the server. Determines the port number on which the server will listen
const PORT = process.env.PORT || 3000;

//starts HTTPs erver listening on the port
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
