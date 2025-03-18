import { WebSocket } from "ws";
import { Chess } from 'chess.js'
import { GAME_OVER, INIT_GAME, MOVE } from "./message";

export class Game {
    public player1: WebSocket;
    public player2: WebSocket;
    private board: Chess;
    //    private move : String[];
    private startTime: Date;


    constructor(player1: WebSocket, player2: WebSocket) {
        this.player1 = player1;
        this.player2 = player2;
        this.board = new Chess();

        this.startTime = new Date();
        this.player1.send(JSON.stringify({
            type: INIT_GAME,
            payload: {
                color: "white"
            }
        }));
        this.player2.send(JSON.stringify({
            type: INIT_GAME,
            payload: {
                color: "black"
            }
        })); // last 46:13
    }

    makeMove(socket: WebSocket, move: { 
        from: string; to: string; 
    }) {

        // validate the tyep of the move 
        console.log(this.board)
      //  console.log(socket)
        if (this.board.move.length % 2 == 0 && socket !== this.player1) // even and player2 
        {
            console.log("return first ")
            return;
        }


        if (this.board.move.length % 2 != 0 && socket !== this.player2) // odd and player1 
        {
            console.log("return second ")
            return;
        }

        try {
            this.board.move(move);
        } catch (e) {
            console.log("inside the try catch block")
            return;
        }

        if (this.board.isGameOver()) {
            // Send the game over message to both players
            this.player1.send(JSON.stringify({
                type: GAME_OVER,
                payload: {
                    winner: this.board.turn() === "w" ? "black" : "white" 
                }
            }))
            return;
        }

        if (this.board.move.length % 2 === 0) {
            this.player2.send(JSON.stringify({
                type: MOVE,
                payload: move
            }))
        } else {
            this.player1.send(JSON.stringify({
                type: MOVE,
                payload: move
            }))
        } // last 49 minits before testing 
    }
}