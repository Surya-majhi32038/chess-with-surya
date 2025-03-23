import { WebSocket } from "ws";
import { Chess } from 'chess.js'
import { GAME_OVER, INIT_GAME, MOVE } from "./message";

export class Game {
    public player1: WebSocket;
    public player2: WebSocket;
    private board: Chess;
    private moveCount : number;

    //    private move : String[];
    public  startTime: Date;


    constructor(player1: WebSocket, player2: WebSocket) {
        this.player1 = player1;
        this.player2 = player2;
        this.moveCount = 0;
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
            console.log("return first ")
            return;
        }
        if (this.moveCount % 2 != 0 && socket !== this.player2) // odd and player1 
        {
            console.log("return second ")
            return;
        }
        
        try {
            console.log(move)
            this.board.move(move);
        } catch (e) {
            console.log("inside the try catch block",e)
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
        
        if (this.moveCount % 2 === 0) {
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
        this.moveCount++;
        console.log("number of move  -> ",this.moveCount)


    }
}