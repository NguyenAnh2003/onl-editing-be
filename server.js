import express from 'express';
import { Server } from 'socket.io';
import http from 'http';
import ACTIONS from './actions.js';
import connection from './src/db/db.config.js';
import { getDocumemt } from './src/controller/document.controller.js';

const PORT = 5000;
const app = express();
const server = http.createServer(app);
const io = new Server(server);

/** database connection
 * function call
 * mongodb
 *
 */
connection();

const userSocketMap = {};

const getAllConnected = (roomId) => {
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
  socket.on(ACTIONS.JOIN, async ({ roomId, name }) => {
    /**
     * RoomId -> SpaceId
     * Document -> Space editing
     */
    /** Create space */
    const doc = await getDocumemt(roomId);

    /**
     * Join roomId
     */
    userSocketMap[socket.id] = name;
    socket.join(roomId);

    const clients = getAllConnected(roomId);
    console.log(clients);
    clients.forEach(({ socketId }) => {
      io.to(socketId).timeout(300).emit(ACTIONS.JOINED, {
        clients,
        name,
        socketId: socket.id,
      });
    });

    if (doc) {
      /** Load space content */
      io.timeout(300).to(roomId).emit(ACTIONS.LOAD_DOC, { doc: doc.data });
      console.log('SpaceId', doc, 'Load space data success');
    }
  });
  /**
   * text change
   */
  socket.on(ACTIONS.TEXT_CHANGE, ({ roomId, content, client }) => {
    /**
     * return roomId, text, client
     */
    const clients = getAllConnected(roomId);
    const rs = clients.filter((i) => i.name.includes(client));
    console.log(rs);
    if (rs === client) return;
    else {
      socket.in(roomId).emit(ACTIONS.TEXT_CHANGE, { content, client });
      console.log({ roomId, content, client });
    }
  });

  /**
   * sync text
   */
  socket.on(ACTIONS.SYNC_TEXT, ({ socketId, content, client, roomId }) => {
    if (!content) {
      console.log('nulll content');
      return;
    } else {
      io.in(roomId).to(socketId).emit(ACTIONS.TEXT_CHANGE, {
        content,
        client,
      });
      console.log('sync data server', {
        content,
        client,
        roomId,
      });
    }
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

server.listen(PORT, () => console.log(`Listenning on port ${PORT}`));
