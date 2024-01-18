import express from "express";
import {
  searchUserController,
  userLoginController,
  userRegisterController,
} from "../controller/user.controller.js";
import {
  createPageController,
  deletePageController,
  exportPDFController,
  getDataByPageIdController,
  getPagesByUserIdController,
  updatePageNameControllter,
} from "../controller/page.controller.js";
import {
  addUser2PageController,
  deletUserColabController,
  getColabPageByPageIdController,
  getColabPageController,
  getOneColabPageController,
  updateUserModeController,
} from "../controller/colab.controller.js";

/** define route */
const route = express.Router();
/** User */
route.post("/login", userLoginController);
route.post("/register", userRegisterController);
route.get("/search-user/:name", searchUserController);
/** Page */
route.post("/create-page", createPageController);
route.get("/get-pages/:userId", getPagesByUserIdController);
route.get("/get-page/:pageId", getDataByPageIdController);
route.delete("/delete-page/:pageId", deletePageController);
route.put("/update-page-name/:pageId", updatePageNameControllter);
route.post("/pdf-export", exportPDFController);
// route.post('/delete-page');
/** Colab */
route.post("/add-user-to-page", addUser2PageController);
route.get("/get-colab-pages/:userId", getColabPageController);
route.get("/get-colab-pages-pageid/:pageId", getColabPageByPageIdController);
route.get("/get-one-colab-page/:userId/:pageId", getOneColabPageController);
route.put("/update-user-mode/:colabId", updateUserModeController);
route.delete("/delete-user-colab/:colabId", deletUserColabController);
export default route;
