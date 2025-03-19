import { WebSocket } from "ws";
import { INIT_GAME, MOVE } from "./message";
import { Game } from "./Game";
import { Move } from "chess.js";

export class GameManager {
    private games: Game[];
    private pendingUsers: WebSocket | null;
    private users: WebSocket[];
    constructor() {
        this.games = [];
        this.pendingUsers = null;
        this.users = [];
    }
    addUser(socket: WebSocket) {
        this.users.push(socket);
        this.addHandler(socket);
    }
    removeUser(socket: WebSocket) {
        this.users = this.users.filter(user => user !== socket);
    }

    private addHandler(socket: WebSocket) {
        socket.on("message", (data) => {
            const message = JSON.parse(data.toString());
            console.log("sss555s", message.type)
            if (message.type === INIT_GAME) {
                console.log("inside the init game ", message.type)
                if (this.pendingUsers) {
                    // start a game
                    console.log("to create a new game ")
                    const game = new Game(this.pendingUsers, socket)
                    this.games.push(game);
                    this.pendingUsers = null;
                } else {
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
            if (message.type === MOVE) {
                console.log(" aa ")
                console.log("inside the move")
                const game = this.games.find(game => game.player1 === socket || game.player2 === socket);
                if (game) {
                    game.makeMove(socket, message.move);
                }
            }
        })
    }
}