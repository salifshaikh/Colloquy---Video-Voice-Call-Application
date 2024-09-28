const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { v4: uuidV4 } = require('uuid');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

io.on('connection', (socket) => {
  const userId = uuidV4(); // Generate unique username
  socket.emit('yourID', userId); // Send the unique ID to the user

  socket.on('callUser', ({ userToCall, signalData, from }) => {
    io.to(userToCall).emit('callReceived', { signal: signalData, from });
  });

  socket.on('answerCall', (data) => {
    io.to(data.to).emit('callAccepted', data.signal);
  });
});

server.listen(5000, () => console.log('Server is running on port 5000'));
