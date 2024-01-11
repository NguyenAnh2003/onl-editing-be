import express from 'express';
import { Server } from 'socket.io';
import http from 'http';
import ACTIONS from './actions.js';
import cors from 'cors';
import randomColor from 'randomcolor';
import route from './src/routes/index.route.js';
import { getDataByPageIdService, updatePageService } from './src/services/page.services.js';
import Delta from 'quill-delta';
import { askAIController } from './src/controller/askai.controller.js';
import connection from './src/config/db.config.js';
import fileUpload from 'express-fileupload';
import { uploadCloudinaryController, uploadImageController } from './src/controller/file.controller.js';
import { decryptHelper, encryptHelper } from './src/utils/cipher.utils.js';
import { updatePageController } from './src/controller/page.controller.js';

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
app.use(fileUpload());
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
    console.log('name', userSocketMap[socketId].name, 'sessionId', socketId);
    return {
      socketId,
      name: userSocketMap[socketId].name,
      roomId,
      color: userSocketMap[socketId].color,
      userId: userSocketMap[socketId].userId,
    };
  });
};
/** RR Ws */
io.on('connection', (socket) => {
  console.log(`${socket.id} connected`);
  /** on Connection */
  socket.on(ACTIONS.JOIN, async ({ requestData }) => {
    const { roomId, name, userId } = decryptHelper(requestData);
    /**
     * RoomId -> SpaceId
     * Document -> Space editing
     */

    const data = await getDataByPageIdService(roomId);
    const color = randomColor();
    /* Join roomId */
    userSocketMap[socket.id] = { name, userId, color };
    console.log('checking', socket.id, 'name', name);
    socket.join(roomId);

    const clients = getAllConnected(roomId);
    console.log(clients);

    /** @emits clients, name, socketId, color, userId*/
    clients.forEach(({ socketId }) => {
      const userJoined = {
        color: randomColor(),
        socketId,
        name,
        userId,
      };
      const responseData = encryptHelper({ clients, userJoined });
      io.to(socketId).timeout(300).emit(ACTIONS.JOINED, {
        responseData,
      });
    });
    console.log(data);
    const responseData = encryptHelper(data);
    io.in(roomId).emit(ACTIONS.LOAD_DOC, { responseData });
  });

  /** text change*/
  socket.on(ACTIONS.TEXT_CHANGE, ({ requestData }) => {
    /**
     * return roomId, text, client
     * Socket send text change
     * Check username with senderClient
     * decrypt data
     */
    const { roomId, content, client } = decryptHelper(requestData);
    page.data = page.data.compose(new Delta(content));
    page.history.push(content);
    /** encrypt response */
    const responseData = encryptHelper({ content, client });
    socket.timeout(300).in(roomId).emit(ACTIONS.TEXT_CHANGE, { responseData });
    console.log({ roomId, content, client });

    setTimeout(async () => {
      const rs = await updatePageController(roomId, page.data);
      console.log('update', rs);
    }, 300);
  });

  /** cursor change */
  socket.on(ACTIONS.CURSOR_CHANGE, ({ requestData }) => {
    const { roomId, socketId, selection } = decryptHelper(requestData);
    if (selection) {
      console.log({ selection });
      const responseData = encryptHelper({ socketId, selection });
      socket.in(roomId).emit(ACTIONS.CURSOR_CHANGE, { responseData });
    }
  });

  /** message with AI */
  socket.on(ACTIONS.SEND_MESSAGE, async ({ requestData }) => {
    const { content, role, sessionId } = decryptHelper(requestData);
    console.log(content, role, sessionId);

    /** calling ai service */
    const response = await askAIController(content, role);
    const responseData = encryptHelper({ response, sessionId });
    io.to(sessionId).emit(ACTIONS.AI_RESPONSE, { responseData });
  });

  /** upload */
  socket.on('upload', async ({ file, filename, pageId }) => {
    console.log({ file, filename });
    const response = await uploadCloudinaryController(file);
    console.log(response);
    io.timeout(300).to(pageId).emit('upload', { imageURL: response });
  });

  /** leave room */
  socket.on(ACTIONS.LEAVE_ROOM, ({ pageId, sessionId }) => {
    console.log(pageId, sessionId);
  });

  /**
   * disconnect
   */
  socket.on('disconnecting', () => {
    const rooms = [...socket.rooms];
    rooms.forEach((roomId) => {
      const responseData = encryptHelper({ socketId: socket.id, name: userSocketMap[socket.id] });
      socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
        responseData,
      });
      console.log('before leave', userSocketMap[socket.id]);
      // delete userSocketMap[socket.id];
      socket.leave();
    });
  });
});

server.listen(PORT, () => console.log(`Listenning on port ${PORT}`));
