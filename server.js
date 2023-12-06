import express from 'express';
import { Server } from 'socket.io';
import http from 'http';
import ACTIONS from './actions.js';
import connection from './src/db/db.config.js';
import cors from 'cors';
import randomColor from 'randomcolor';
import route from './src/routes/index.route.js';
import { getDataByPageIdService, updatePage } from './src/services/page.services.js';
import Delta from 'quill-delta';
import { askAIController } from './src/controller/askai.controller.js';

const page = {
  data: new Delta([]),
  history: [],
};

const PORT = 5000;
const app = express();
const server = http.createServer(app);
const io = new Server(server);

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

/**
 * WS
 * userSocketMap for joining
 *  */
const userSocketMap = {};
/** temp array for pageId */
const getAllConnected = (roomId) => {
  return Array.from(
    /** sockets.adapter.rooms.get()? */
    io.sockets.adapter.rooms.get(roomId) || []
  ).map((socketId) => {
    /** @returns (socketId, name, roomId, color, selection) */
    return {
      socketId,
      name: userSocketMap[socketId].name,
      roomId,
      color: randomColor(),
      userId: userSocketMap[socketId].userId,
    };
  });
};
/** RR Ws */
io.on('connection', (socket) => {
  console.log(`${socket.id} connected`);
  /** on Connection */
  socket.on(ACTIONS.JOIN, async ({ roomId, name, userId }) => {
    /**
     * RoomId -> SpaceId
     * Document -> Space editing
     */
    const data = await getDataByPageIdService(roomId);

    /* Join roomId */
    userSocketMap[socket.id] = {name, userId};
    socket.join(roomId);

    const clients = getAllConnected(roomId);
    console.log(clients);

    /** @emits clients, name, socketId, color, userId*/
    clients.forEach(({ socketId }) => {
      console.log(data);
      io.to(socketId)
        .timeout(300)
        .emit(ACTIONS.JOINED, {
          clients,
          userJoined: {
            color: randomColor(),
            socketId,
            name,
            userId,
          },
          // data,
        });
    });

    io.in(roomId).emit(ACTIONS.LOAD_DOC, { data });
  });

  /** text change*/
  socket.on(ACTIONS.TEXT_CHANGE, ({ roomId, content, client }) => {
    /**
     * return roomId, text, client
     * Socket send text change
     * Check username with senderClient
     */
    page.data = page.data.compose(new Delta(content));
    page.history.push(content);

    socket.timeout(300).in(roomId).emit(ACTIONS.TEXT_CHANGE, { content, client });
    console.log({ roomId, content, client });

    setTimeout(async () => {
      const rs = await updatePage(roomId, page.data);
      console.log('update', rs);
    }, 300);
  });

  /** cursor change */
  socket.on(ACTIONS.CURSOR_CHANGE, ({ roomId, socketId, selection }) => {
    if (selection) {
      console.log({ selection });
      socket.in(roomId).emit(ACTIONS.CURSOR_CHANGE, { socketId, selection });
    }
  });

  /** message with AI */
  socket.on(ACTIONS.SEND_MESSAGE, async ({ message, sessionId }) => {
    console.log(message);
    /** calling ai service */
    const response = await askAIController(message);
    console.log(response);
    io.to(sessionId).emit(ACTIONS.AI_RESPONSE, { response, sessionId });
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
