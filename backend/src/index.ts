import { WebSocketServer } from "ws";
import { GameManager } from "./GameManager";

const wss = new WebSocketServer({ port: 8080 });
// console.log(wss)
const gameManager = new GameManager();
wss.on("connection", function connection(ws) { // the connection work or called when click the "Paly game "
    // console.log("print the value of ws in the connection ",ws)
    gameManager.addUser(ws);
    console.log("connected and call add user with ws value : ");
    wss.on("close", () => gameManager.removeUser(ws));
});
