"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const chess_js_1 = require("chess.js");
const app = express();
const server = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "*",
    },
});
const chess = new chess_js_1.Chess();
let players = {};
let currentPlayers = "w";
io.on("connection", (socket) => {
    console.log("Connected socket:", socket.id);
    if (!players.white) {
        players.white = socket.id;
        socket.emit("playersRole", "w");
    }
    else if (!players.black) {
        players.black = socket.id;
        socket.emit("playersRole", "b");
    }
    else {
        socket.emit("spectatorRole", "spectator");
    }
    socket.on("disconnect", () => {
        if (socket.id === players.white) {
            delete players.white;
        }
        else if (socket.id === players.black) {
            delete players.black;
        }
    });
    socket.on("move", (move) => {
        try {
            if ((chess.turn() === "w" && socket.id !== players.white) ||
                (chess.turn() === "b" && socket.id !== players.black)) {
                return;
            }
            const result = chess.move(move);
            if (result) {
                currentPlayers = chess.turn();
                io.emit("move", move); // Broadcast move event
                io.emit("boardState", chess.fen());
            }
            else {
                console.log("Invalid move:", move);
                socket.emit("InvalidMove", move);
            }
        }
        catch (error) {
            console.error(error);
        }
    });
});
server.listen(3000, () => {
    console.log("Listening on port 3000");
});
