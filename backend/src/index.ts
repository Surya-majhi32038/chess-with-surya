

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

// interface Players {
//     white?: string;
//     black?: string;
// }

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
    // console.log("New client connected", socket.id);
    // console.log("Games array ",Games)
    // try to find any plaers have any type like white or black empty or not
    let player: any;
    player = Games.find(game =>
        (game.white && !game.black) || (!game.white && game.black)
    );

    if (player) { // if any players are in the game(white or black)
        console.log("i'm in player")
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
            // console.log("Games array ",Games)
            socket.emit("playersRole", "b");
            // Games.push(players)
            if (players.white && players.black) {
                console.log("here")
                io.to(players.black).emit("startGame");
                io.to(players.white).emit("startGame");
                io.to(players.black).emit("printGames",Games);
                io.to(players.white).emit("printGames",Games);
            }
            // console.log("sending black role to player ", socket.id);
        }
    }
    // console.log("Games array (every connection)", Games)




    socket.on("disconnect", () => {
        // console.log("Client disconnected", socket.id);
        // console.log("Games array before disconnect",Games)
        Games = Games.filter(game => game.white || game.black); // if any of the player is not present then remove the game from the array
        // console.log("Games array disconnect",Games)
        Games = Games.filter(game => !(game.white == "" && game.black == "")); // if any of the player is not present then remove the game from the array
        Games = Games.filter(game =>
            !(
                (game.white === socket.id && game.black == null) ||
                (game.black === socket.id && game.white == null)
            )
        );

        let players: any;
        players = Games.find(p => p.black === socket.id || p.white === socket.id);
        if (!players) {
            console.warn("No matching player found on disconnect:", socket.id);
            return;
        }

        //    console.log(players)
        players?.chess?.reset();

        if (socket.id === players?.white) {
            players.white = ""
            io.to(players.black).emit("boardState", players.chess.fen(), players.chess.history({ verbose: true }));
            io.to(players.black).emit("opponetGone");

        } else {
            players.black = ""
            io.to(players.white).emit("boardState", players.chess.fen(), players.chess.history({ verbose: true }));
            io.to(players.white).emit("opponetGone");
        }

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
     console.log("after every movement ", Games)
        let players: any;
        players = Games.find(p => p.black === socket.id || p.white === socket.id);
        // console.log("move received:", move);

        // console.log(players?.chess?.history({ verbose: true }))
        try {
            if ((players.chess.turn() === "w" && socket.id !== players?.white) ||
                (players.chess.turn() === "b" && socket.id !== players?.black)) {
                return;
            }
            console.log("befor result ")
            const result = players.chess.move(move);
            if (result) {
                currentPlayers = players.chess.turn();
                io.to(players.white).emit("move", move)
                io.to(players.white).emit("boardState", players.chess.fen(), players.chess.history({ verbose: true }));

                io.to(players.black).emit("move", move)
                io.to(players.black).emit("boardState", players.chess.fen(), players.chess.history({ verbose: true }));

                io.to(players.black).emit("checkGamesArray", Games);
                console.log("send the games array to black ", Games);
                io.to(players.white).emit("checkGamesArray", Games);
                // io.emit("move", move); // Broadcast move event
                // io.emit("boardState", chess.fen());

                // any type of things are happend
                if (players.chess.isCheckmate() || players.chess.isCheck()) {

                    io.to(players.white).emit("Checkmate")
                    io.to(players.black).emit("Checkmate")
                    io.to(players.black).emit("boardState", players.chess.fen(), players.chess.history({ verbose: true }));
                    io.to(players.black).emit("boardState", players.chess.fen(), players.chess.history({ verbose: true }));
                    // io.emit("Checkmate")
                    // io.emit("boardState", chess.fen());
                    players.chess.reset();
                }
                else if (players.chess.isStalemate()) {
                    io.to(players.white).emit("Stalemate")
                    io.to(players.black).emit("Stalemate")
                    // io.emit("Stalemate");
                    console.log('🤝 Stalemate. Game drawn.');
                } else if (players.chess.isDraw()) {
                    console.log('📏 Game drawn by rule.');
                    io.to(players.white).emit("GameIsDraw")
                    io.to(players.black).emit("GameIsDraw")
                    // io.emit("GameIsDraw");
                }
            } else {
                console.log("Invalid move:", move);
                socket.emit("InvalidMove", move);
            }
        } catch (error) {
            console.error("error happening in error part -> ", error, players.chess.fen());
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
        //1. destroy the corrent game 

        //2. find a new game , if present then start the game 
    })


});

server.listen(9000, () => {
    console.log("Listening on port 3000");
});
