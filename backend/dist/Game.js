"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const chess_js_1 = require("chess.js");
const message_1 = require("./message");
class Game {
    constructor(player1, player2) {
        this.player1 = player1;
        this.player2 = player2;
        this.moveCount = 0;
        this.board = new chess_js_1.Chess();
        this.startTime = new Date();
        this.player1.send(JSON.stringify({
            type: message_1.INIT_GAME,
            payload: {
                color: "white"
            }
        }));
        this.player2.send(JSON.stringify({
            type: message_1.INIT_GAME,
            payload: {
                color: "black"
            }
        })); // last 46:13
    }
    makeMove(socket, move) {
        /**
         * ok , there are few work with done with stpe by step
         * 1. validation here
         * 2. is it this user move
         * 3. is the move valid
         * 4. update the board
         * 5. push the move
         * 6.check if the game is over
         * 7. send the updated board both players
         *
         */
        // validate the tyep of the move 
        //  console.log(socket)
        if (this.moveCount % 2 == 0 && socket !== this.player1) // even and player2 
         {
            console.log("return first ");
            return;
        }
        if (this.moveCount % 2 != 0 && socket !== this.player2) // odd and player1 
         {
            console.log("return second ");
            return;
        }
        try {
            console.log(move);
            this.board.move(move);
        }
        catch (e) {
            console.log("inside the try catch block", e);
            return;
        }
        if (this.board.isGameOver()) {
            // Send the game over message to both players
            this.player1.send(JSON.stringify({
                type: message_1.GAME_OVER,
                payload: {
                    winner: this.board.turn() === "w" ? "black" : "white"
                }
            }));
            return;
        }
        if (this.moveCount % 2 === 0) {
            this.player2.send(JSON.stringify({
                type: message_1.MOVE,
                payload: move
            }));
        }
        else {
            this.player1.send(JSON.stringify({
                type: message_1.MOVE,
                payload: move
            }));
        } // last 49 minits before testing 
        this.moveCount++;
        console.log("number of move  -> ", this.moveCount);
    }
}
exports.Game = Game;
