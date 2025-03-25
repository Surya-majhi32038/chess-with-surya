"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const GameManager_1 = require("./GameManager");
const wss = new ws_1.WebSocketServer({ port: 8080 });
// console.log(wss)
const gameManager = new GameManager_1.GameManager();
wss.on("connection", function connection(ws) {
    // console.log("print the value of ws in the connection ",)
    gameManager.addUser(ws);
    console.log("we are in backend  ");
    wss.on("close", () => gameManager.removeUser(ws));
});
