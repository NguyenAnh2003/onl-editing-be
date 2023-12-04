import express from 'express';
import { searchUserController, userLoginController, userRegisterController } from '../controller/user.controller.js';
import { createPageController, getDataByPageIdController, getPagesByUserIdController } from '../controller/page.controller.js';
import { addUser2PageController, getColabPageController } from '../controller/colab.controller.js';
import { askAIController } from '../controller/askai.controller.js';
/** define route */
const route = express.Router();

/** User */
route.post('/login', userLoginController);
route.post('/register', userRegisterController);
route.get('/search-user/:name', searchUserController);
/** Page */
route.post('/create-page', createPageController);
route.get('/get-pages/:userId', getPagesByUserIdController);
/** get page's data */
route.get('/get-page/:pageId', getDataByPageIdController);

// route.post('/delete-page');

/** Colab */
/** add2Page */
route.post('/add-user-to-page', addUser2PageController);
/** Get Colab */
route.get('/get-colab-pages/:userId', getColabPageController);

route.get('/get-ai', askAIController);
export default route;
