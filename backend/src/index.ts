

const express = require("express");
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import { Chess } from "chess.js";
import path from "path";
// console.log("i'm in backend ");
const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
    },
});
// GET / route
app.get('/', (req: any, res: any) => {
    res.send({
        activeStatus: true,
        error: false
    });
});

class PlayersClass {
    public white: string;
    public black: string;
    public chess: Chess;

    constructor(white: string, black: string) {
        this.white = white
        this.black = black
        this.chess = new Chess();
    }
}
let Games: PlayersClass[] = [];


// check it "init_game"

// console.log("when the backend is start and Games array -> ", Games)
let pendingUser: string | null;
pendingUser = null
let currentPlayers: "w" | "b" = "w";
io.on("connection", (socket: Socket) => {

    /**
     * 1.find the game in the Games array which is one player 
     * 2.if the game is found, check if the player is white or black
     * 3.if the player is white, set the black player to the socket.id
     * 4. same as white
     * 5.if the game is not found, check if there is a pending user
     * 6.if there is no pending user, set the pending user to the socket.id and emit the "playersRole" event with "w"
     * 7.if there is a pending user, create a new game with the pending user and the socket.id, push it to the Games array and emit the "playersRole" event with "b"
     * 
     */

    const player = Games.find(game =>
        (game.white && !game.black) || (!game.white && game.black)
    );

    if (player) { // if any players are in the game(white or black)
        // console.log("i'm in player")
        if (player.white) {
            player.black = socket.id;
            socket.emit("playersRole", "b");
        } else {
            player.white = socket.id;
            socket.emit("playersRole", "w");
        }
        io.to(player.black).emit("startGame");
        io.to(player.white).emit("startGame");
    } else {
        if (!pendingUser) {
            pendingUser = socket.id
            socket.emit("playersRole", "w");
            // console.log("sending white role to player ", socket.id);
        } else {
            const players = new PlayersClass(pendingUser, socket.id);
            pendingUser = null;
            Games.push(players);
            // console.log("New game created with players, games status", Games);
            // console.log("Games array ",Games)
            socket.emit("playersRole", "b");
            // Games.push(players)
            if (players.white && players.black) {
                // console.log("here")
                io.to(players.black).emit("startGame");
                io.to(players.white).emit("startGame");
            }

        }
    }

    socket.on("disconnect", () => {
        /**
         * 1. find the player in the Games array which is connected with the socket.id
         * 2. if the player is found, check if the player is white or black
         * 3. if the player is white, emit the "opponetGone" event to the black player
         * 4. same as white
         * 5. remove the whole game from the Games array
         * 
         * 
         */
        const players = Games.find(p => p.black === socket.id || p.white === socket.id);
        if (!players) {
            console.warn("No matching player found on disconnect:", socket.id);
            return;
        }

        //    console.log(players)
        // players?.chess?.reset();

        if (socket.id === players?.white) {
            // players.white = ""
            // io.to(players.black).emit("boardState", players.chess.fen(), players.chess.history({ verbose: true }));
            io.to(players.black).emit("opponetGone");

        } else {
            // players.black = ""
            // io.to(players.white).emit("boardState", players.chess.fen(), players.chess.history({ verbose: true }));
            io.to(players.white).emit("opponetGone");
        }
        Games = Games.filter(game => {
            return game.white !== socket.id && game.black !== socket.id;
        });
        console.log("Player disconnected:", socket.id);
        console.log("Games array after disconnect", Games);
    });



    socket.on("timeUp", () => {
        let players: any;
        players = Games.find(p => p.black === socket.id || p.white === socket.id);
        if (socket.id === players?.white) {
            io.to(players.black).emit("TimeUp", "white");
        } else {
            io.to(players.white).emit("TimeUp", "balck");
        }
    }
    );

    socket.on("move", (move: any) => {
        //  console.log("after every movement ", Games)
        let players: any;
        players = Games.find(p => p.black === socket.id || p.white === socket.id);
        // console.log("move received:", move);

        // console.log(players?.chess?.history({ verbose: true }))
        try {
            if ((players.chess.turn() === "w" && socket.id !== players?.white) ||
                (players.chess.turn() === "b" && socket.id !== players?.black)) {
                return;
            }
            // console.log("befor result ")
            const result = players.chess.move(move);
            // console.log("after result ", result)
            if (result) {
                console.log("Move made:", move);
                currentPlayers = players.chess.turn();
                io.to(players.white).emit("move", move)
                io.to(players.white).emit("boardState", players.chess.fen(), players.chess.history({ verbose: true }));

                io.to(players.black).emit("move", move)
                io.to(players.black).emit("boardState", players.chess.fen(), players.chess.history({ verbose: true }));

                if (players.chess.isCheckmate() || players.chess.isCheck()) {

                    io.to(players.white).emit("Checkmate")
                    io.to(players.black).emit("Checkmate")
                    io.to(players.black).emit("boardState", players.chess.fen(), players.chess.history({ verbose: true }));
                    io.to(players.black).emit("boardState", players.chess.fen(), players.chess.history({ verbose: true }));

                    players.chess.reset();
                }
                else if (players.chess.isStalemate()) {
                    io.to(players.white).emit("Stalemate")
                    io.to(players.black).emit("Stalemate")
                    // io.emit("Stalemate");
                    // console.log('🤝 Stalemate. Game drawn.');
                } else if (players.chess.isDraw()) {
                    // console.log('📏 Game drawn by rule.');
                    io.to(players.white).emit("GameIsDraw")
                    io.to(players.black).emit("GameIsDraw")
                    // io.emit("GameIsDraw");
                }
            }
        } catch (error) {
            const players = Games.find(p => p.black === socket.id || p.white === socket.id);
            // console.log("Error in move:", error);
            if (socket.id === players?.white) {
                io.to(players.white).emit("Invalidmove", move);
                console.log("Invalid move by white player:", move);
            }
            if (socket.id === players?.black) {
                io.to(players?.black).emit("Invalidmove", move);
                console.log("Invalid move by black player:", socket.id);
            }
            // console.error("error happening in error part -> ", error);
        }
    });

    socket.on("undoMove", () => {
        let players: any;
        players = Games.find(p => p.black === socket.id || p.white === socket.id);
        if ((players.chess.turn() === "w" && socket.id !== players?.white) ||
            (players.chess.turn() === "b" && socket.id !== players?.black)) {
            return;
        }
        if (players) {
            players.chess.undo();
            io.to(players.white).emit("boardState", players.chess.fen(), players.chess.history({ verbose: true }));
            io.to(players.black).emit("boardState", players.chess.fen(), players.chess.history({ verbose: true }));
        }
    });

    // after game complitation (like - any user gone, win, other case )
    socket.on("reConnect", () => {

        if (!pendingUser) {
            pendingUser = socket.id
            socket.emit("playersRole", "w");

        } else {
            const players = new PlayersClass(pendingUser, socket.id);
            pendingUser = null;
            Games.push(players);
            // console.log("New game created with players, games status", Games);
            // console.log("Games array ",Games)
            socket.emit("playersRole", "b");
            // Games.push(players)
            if (players.white && players.black) {
                // console.log("here")
                io.to(players.black).emit("startGame");
                io.to(players.white).emit("startGame");
                // io.to(players.black).emit("printGames", Games);
                // io.to(players.white).emit("printGames", Games);
            }
            // console.log("sending black role to player ", socket.id);
            // }
        }
    })
    // socket.on("reStartGame", (socketId1, socketId2) => {


    //     const players = new PlayersClass(socketId1, socketId2);
    //     Games.push(players);
    //     io.to(players.black).emit("playersRole", "b");
    //     io.to(players.white).emit("playersRole", "w");
    //     // Games.push(players)
    //     if (players.white && players.black) {
    //         // console.log("here")
    //         io.to(players.black).emit("startGame");
    //         io.to(players.white).emit("startGame");
    //         // io.to(players.black).emit("printGames", Games);
    //         // io.to(players.white).emit("printGames", Games);
    //     }
    //     // console.log("sending black role to player ", socket.id);
    //     // }


    // });

    
});
server.listen(9000, () => {
        console.log("Listening on port 9000");
 });