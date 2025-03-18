"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameManager = void 0;
const message_1 = require("./message");
const Game_1 = require("./Game");
class GameManager {
    constructor() {
        this.games = [];
        this.pendingUsers = null;
        this.users = [];
    }
    addUser(socket) {
        this.users.push(socket);
        this.addHandler(socket);
    }
    removeUser(socket) {
        this.users = this.users.filter(user => user !== socket);
    }
    addHandler(socket) {
        socket.on("message", (data) => {
            const message = JSON.parse(data.toString());
            console.log("sss555s", message.type);
            if (message.type === message_1.INIT_GAME) {
                console.log("inside the init game ", message.type);
                if (this.pendingUsers) {
                    // start a game
                    console.log("to create a new game ");
                    const game = new Game_1.Game(this.pendingUsers, socket);
                    this.games.push(game);
                    this.pendingUsers = null;
                }
                else {
                    this.pendingUsers = socket;
                }
            }
            /**
             "type" : "move",
             "move":{
                "from":"a2",
                "to":"a3"
             }
             {
    "type" : "move",
    "move":{
        "from":"a2",
        "to":"a3"
    }
}
             */
            if (message.type === message_1.MOVE) {
                console.log("inside the move ");
                const game = this.games.find(game => game.player1 === socket || game.player2 === socket);
                if (game) {
                    game.makeMove(socket, message.move);
                }
            }
        });
    }
}
exports.GameManager = GameManager;
