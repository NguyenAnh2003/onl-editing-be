import express from 'express';
import { searchUserController, userLoginController, userRegisterController } from '../controller/user.controller.js';
import { createPageController, deletePageController, exportPDFController, getDataByPageIdController, getPagesByUserIdController } from '../controller/page.controller.js';
import { addUser2PageController, getColabPageByPageIdController, getColabPageController, getOneColabPageController, updateUserModeController } from '../controller/colab.controller.js';
import { askAIController } from '../controller/askai.controller.js';
import { uploadImageController } from '../controller/file.controller.js';

/** define route */
const route = express.Router();
/** User */
route.post('/login', userLoginController);
route.post('/register', userRegisterController);
route.get('/search-user/:name', searchUserController);
/** Page */
route.post('/create-page', createPageController);
route.get('/get-pages/:userId', getPagesByUserIdController);
route.get('/get-page/:pageId', getDataByPageIdController);
route.delete('/delete-page/:pageId', deletePageController);
route.post('/pdf-export', exportPDFController);
// route.post('/delete-page');
/** Colab */
route.post('/add-user-to-page', addUser2PageController);
route.get('/get-colab-pages/:userId', getColabPageController);
route.get('/get-colab-pages-pageid/:pageId', getColabPageByPageIdController);
route.get('/get-one-colab-page/:userId/:pageId', getOneColabPageController);
route.put('/update-user-mode/:colabId', updateUserModeController);
export default route;
