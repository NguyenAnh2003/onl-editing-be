import express from 'express';
import { Server } from 'socket.io';
import http from 'http';
import ACTIONS from './actions.js';

const PORT = 5000;
const app = express();
const server = http.createServer(app);
const io = new Server(server);

const userSocketMap = {};

const getAllConnected = (roomId) => {
  /**
   *
   */
  return Array.from(
    /**
     * sockets.adapter.rooms.get()?
     */
    io.sockets.adapter.rooms.get(roomId) || []
  ).map((socketId) => {
    return {
      socketId,
      name: userSocketMap[socketId],
      roomId: roomId,
    };
  });
};

io.on('connection', (socket) => {
  console.log(`${socket.id} connected`);
  /** on Connection */
  socket.on(ACTIONS.JOIN, ({ roomId, name }) => {
    userSocketMap[socket.id] = name;
    socket.join(roomId);
    const clients = getAllConnected(roomId);
    console.log(clients);
    clients.forEach(({ socketId }) => {
      io.to(socketId).emit(ACTIONS.JOINED, {
        clients,
        name,
        socketId: socket.id,
      });
    });
  });
  /**
   * disconnect
   */
  socket.on('disconnecting', () => {
    const rooms = [...socket.rooms];
    rooms.forEach((roomId) => {
      socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
        socketId: socket.id,
        name: userSocketMap[socket.id],
      });
      console.log('before leave', userSocketMap[socket.id]);
      // delete userSocketMap[socket.id];
      socket.leave();
    });
  });
});

server.listen(PORT, () =>
  console.log(`Listenning on port ${PORT}`)
);
