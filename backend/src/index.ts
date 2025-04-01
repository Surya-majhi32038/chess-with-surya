const express = require("express");
import {createServer} from "http";
import { Server, Socket } from "socket.io";
import { Chess } from "chess.js";
import path from "path";

const app = express();
const server = createServer(app);
const io = new Server(server,{
    cors: {
        origin: "*",
    },
});

const chess = new Chess();

interface Players {
    white?: string;
    black?: string; 
}

let players: Players = {};
let currentPlayers: "w" | "b" = "w";
io.on("connection", (socket: Socket) => {
    console.log("Connected socket:", socket.id);

    if (!players.white) {
        players.white = socket.id;
        socket.emit("playersRole", "w");
    } else if (!players.black) {
        players.black = socket.id;
        socket.emit("playersRole", "b");
    } else {
        socket.emit("spectatorRole", "spectator");
    }

    socket.on("disconnect", () => {
        if (socket.id === players.white) {
            delete players.white;
        } else if (socket.id === players.black) {
            delete players.black;
        }
    });

    socket.on("move", (move: any) => {
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
            } else {
                console.log("Invalid move:", move);
                socket.emit("InvalidMove", move);
            }
        } catch (error) {
            console.error(error);
        }
    });
});

server.listen(3000, () => {
    console.log("Listening on port 3000");
});
