import express from 'express';
import { userLoginController, userRegisterController } from '../controller/user.controller.js';
import { createPageController } from '../controller/page.controller.js';
/** define route */
const route = express.Router();

/** User */
route.post('/login', userLoginController);
route.post('/register', userRegisterController);
/** Page */
route.post('/create-page', createPageController);
// route.post('/delete-page');
export default route;
