import express from 'express';
import { searchUserController, userLoginController, userRegisterController } from '../controller/user.controller.js';
import { addUser2PageController, createPageController, getColabPageController, getDataByPageIdController, getPagesByUserIdController } from '../controller/page.controller.js';
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
route.get('/get-colab-pages/:userId', getColabPageController);
/** add2Page */
route.post('/add-user-to-page', addUser2PageController);
// route.post('/delete-page');
export default route;
