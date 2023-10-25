import express from 'express';
import { Server } from 'socket.io';
import http from 'http';
import ACTIONS from './actions.js';
import connection from './src/db/db.config.js';
import cors from 'cors';
import { getDocumemt, updateDocumemt } from './src/controller/document.controller.js';
import randomColor from 'randomcolor';
import route from './src/routes/index.route.js';

const PORT = 5000;
const app = express();

/** database connection
 * function call
 * mongodb
 */
connection();

// config
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
// REST
app.use('/api', route);

const server = http.createServer(app);
const io = new Server(server);

/**
 * WS
 * userSocketMap for joining
 *  */
const userSocketMap = {};
/** random color sending for each socket */
const color = randomColor();
/** temp array for pageId */
const getAllConnected = (roomId) => {
  return Array.from(
    /**
     * sockets.adapter.rooms.get()?
     */
    io.sockets.adapter.rooms.get(roomId) || []
  ).map((socketId) => {
    /**
     * @returns (socketId, name, roomId, color, selection)
     */
    return {
      socketId,
      name: userSocketMap[socketId],
      roomId,
      color,
    };
  });
};
/** RR Ws */
io.on('connection', (socket) => {
  console.log(`${socket.id} connected`);
  /** on Connection */
  socket.on(ACTIONS.JOIN, async ({ roomId, name }) => {
    /**
     * RoomId -> SpaceId
     * Document -> Space editing
     */

    /* Join roomId */
    userSocketMap[socket.id] = name;
    socket.join(roomId);

    const clients = getAllConnected(roomId);
    console.log(clients);

    /**
     * @emits clients, name, socketId, color, selection?
     */
    clients.forEach(({ socketId }) => {
      io.to(socketId).timeout(300).emit(ACTIONS.JOINED, {
        clients,
        color,
      });
    });
  });

  /** Create space */
  socket.on(ACTIONS.LOAD_DOC, async ({ roomId }) => {
    const doc = await getDocumemt(roomId);

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
     * Socket send text change
     * Check username with senderClient
     */
    socket.timeout(300).in(roomId).emit(ACTIONS.TEXT_CHANGE, { content, client });
    // console.log({ roomId, content, client });
  });

  /** cursor change */
  socket.on(ACTIONS.CURSOR_CHANGE, ({ roomId, socketId, selection }) => {
    if (selection) {
      console.log({ selection });
      socket.in(roomId).emit(ACTIONS.CURSOR_CHANGE, { socketId, selection });
    }
  });

  /**
   * Save document on text change
   */
  socket.on(ACTIONS.SAVE_TEXT, async ({ roomId, content }) => {
    if (roomId && content) {
      const rs = await updateDocumemt(roomId, content);
      console.log(rs ? 'update success' : 'update failed');
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