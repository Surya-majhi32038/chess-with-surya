"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const chess_js_1 = require("chess.js");
console.log("i'm in backend");
const app = express();
const server = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "*",
    },
});
// GET / route
app.get('/', (req, res) => {
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
    constructor(white, black) {
        this.white = white;
        this.black = black;
        this.chess = new chess_js_1.Chess();
    }
}
let Games = [];
// check it "init_game"
let pendingUser;
pendingUser = null;
let currentPlayers = "w";
io.on("connection", (socket) => {
    console.log("New client connected", socket.id);
    // console.log("Games array ",Games)
    // try to find any plaers have any type like white or black empty or not
    let player;
    player = Games.find(game => (game.white && !game.black) || (!game.white && game.black));
    if (player) {
        if (player.white) {
            player.black = socket.id;
            socket.emit("playersRole", "b");
        }
        else {
            player.white = socket.id;
            socket.emit("playersRole", "w");
        }
        io.to(player.black).emit("startGame");
        io.to(player.white).emit("startGame");
    }
    else {
        if (!pendingUser) {
            pendingUser = socket.id;
            socket.emit("playersRole", "w");
            // console.log("sending white role to player ", socket.id);
        }
        else {
            const players = new PlayersClass(pendingUser, socket.id);
            pendingUser = null;
            Games.push(players);
            // console.log("Games array ",Games)
            socket.emit("playersRole", "b");
            // Games.push(players)
            if (players.white && players.black) {
                console.log("here");
                io.to(players.black).emit("startGame");
                io.to(players.white).emit("startGame");
            }
            // console.log("sending black role to player ", socket.id);
        }
    }
    socket.on("disconnect", () => {
        var _a;
        Games = Games.filter(game => game.white || game.black);
        // console.log("Games array disconnect",Games)
        let players;
        players = Games.find(p => p.black === socket.id || p.white === socket.id);
        if (!players) {
            console.warn("No matching player found on disconnect:", socket.id);
            return;
        }
        //    console.log(players)
        (_a = players === null || players === void 0 ? void 0 : players.chess) === null || _a === void 0 ? void 0 : _a.reset();
        if (socket.id === (players === null || players === void 0 ? void 0 : players.white)) {
            players.white = "";
            io.to(players.black).emit("boardState", players.chess.fen(), players.chess.history({ verbose: true }));
            io.to(players.black).emit("opponetGone");
        }
        else {
            players.black = "";
            io.to(players.white).emit("boardState", players.chess.fen(), players.chess.history({ verbose: true }));
            io.to(players.white).emit("opponetGone");
        }
    });
    socket.on("timeUp", () => {
        let players;
        players = Games.find(p => p.black === socket.id || p.white === socket.id);
        if (socket.id === (players === null || players === void 0 ? void 0 : players.white)) {
            io.to(players.black).emit("TimeUp", "white");
        }
        else {
            io.to(players.white).emit("TimeUp", "balck");
        }
    });
    socket.on("move", (move) => {
        let players;
        players = Games.find(p => p.black === socket.id || p.white === socket.id);
        // console.log("move received:", move);
        // console.log(players?.chess?.history({ verbose: true }))
        try {
            if ((players.chess.turn() === "w" && socket.id !== (players === null || players === void 0 ? void 0 : players.white)) ||
                (players.chess.turn() === "b" && socket.id !== (players === null || players === void 0 ? void 0 : players.black))) {
                return;
            }
            const result = players.chess.move(move);
            if (result) {
                currentPlayers = players.chess.turn();
                io.to(players.white).emit("move", move);
                io.to(players.white).emit("boardState", players.chess.fen(), players.chess.history({ verbose: true }));
                io.to(players.black).emit("move", move);
                io.to(players.black).emit("boardState", players.chess.fen(), players.chess.history({ verbose: true }));
                // io.emit("move", move); // Broadcast move event
                // io.emit("boardState", chess.fen());
                // any type of things are happend
                if (players.chess.isCheckmate() || players.chess.isCheck()) {
                    io.to(players.white).emit("Checkmate");
                    io.to(players.black).emit("Checkmate");
                    io.to(players.black).emit("boardState", players.chess.fen(), players.chess.history({ verbose: true }));
                    io.to(players.black).emit("boardState", players.chess.fen(), players.chess.history({ verbose: true }));
                    // io.emit("Checkmate")
                    // io.emit("boardState", chess.fen());
                    players.chess.reset();
                }
                else if (players.chess.isStalemate()) {
                    io.to(players.white).emit("Stalemate");
                    io.to(players.black).emit("Stalemate");
                    // io.emit("Stalemate");
                    console.log('🤝 Stalemate. Game drawn.');
                }
                else if (players.chess.isDraw()) {
                    console.log('📏 Game drawn by rule.');
                    io.to(players.white).emit("GameIsDraw");
                    io.to(players.black).emit("GameIsDraw");
                    // io.emit("GameIsDraw");
                }
            }
            else {
                console.log("Invalid move:", move);
                socket.emit("InvalidMove", move);
            }
        }
        catch (error) {
            console.error("error happening in error part -> ", error, players.chess.fen());
        }
    });
    socket.on("undoMove", () => {
        let players;
        players = Games.find(p => p.black === socket.id || p.white === socket.id);
        if ((players.chess.turn() === "w" && socket.id !== (players === null || players === void 0 ? void 0 : players.white)) ||
            (players.chess.turn() === "b" && socket.id !== (players === null || players === void 0 ? void 0 : players.black))) {
            return;
        }
        if (players) {
            players.chess.undo();
            io.to(players.white).emit("boardState", players.chess.fen(), players.chess.history({ verbose: true }));
            io.to(players.black).emit("boardState", players.chess.fen(), players.chess.history({ verbose: true }));
        }
    });
});
server.listen(3000, () => {
    console.log("Listening on port 3000");
});
