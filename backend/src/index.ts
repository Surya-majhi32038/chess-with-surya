const express = require("express");
import {createServer} from "http";
import { Server, Socket } from "socket.io";
import { Chess } from "chess.js";
import path from "path";
console.log("i'm in backend");
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
// let Games = []

let players: Players = {};
let currentPlayers: "w" | "b" = "w";
io.on("connection", (socket: Socket) => {
    console.log("Connected socket:", socket.id);
    if (!players.white) {
        players.white = socket.id;
        socket.emit("playersRole", "w");
        console.log("sending white role to player ",socket.id); 
        if(players.white && players.black){
            console.log("here")
            io.emit("startGame");
        }
    } else if (!players.black) {
        players.black = socket.id;
        socket.emit("playersRole", "b");
        // Games.push(players)
        if(players.white && players.black){
            console.log("here")
            io.emit("startGame");
        }
        console.log("sending black role to player ",socket.id);
    } else {
        socket.emit("spectatorRole", "spectator");
        console.log("sending spectator role  to player ",socket.id);
    }
    

    socket.on("disconnect", () => {

        if (socket.id === players.white ) {

            io.emit("stopGame","white");
            delete players.white
            // console.log("after the deletion white -> white",players.white," black",players.black)
        } else if (socket.id === players.black) {
            io.emit("stopGame","black");
            delete players.black
            // console.log("after the deletion black -> white",players.white," black",players.black)
        }
        chess.reset();
        io.emit("boardState", chess.fen());
        // const sockets = io.sockets.sockets.get(socket.id);
        // if (sockets) {
        //   sockets.disconnect(true); // true means it closes the underlying connection
        //   console.log(`Socket with ID ${sockets.id} disconnected.`);
        // } else {
        //   console.log(`Socket with ID  not found.`);
        // }
    });

    socket.on("move", (move: any) => {
        console.log("move received:", move);
        
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

                // any type of things are happend
                if(chess.isCheckmate()) {
                    io.emit("Checkmate")
                    chess.reset();
                    io.emit("boardState", chess.fen());
                }
                 else if (chess.isStalemate()) {
                    io.emit("Stalemate");
                    console.log('🤝 Stalemate. Game drawn.');
                } else if (chess.isDraw()) {
                    console.log('📏 Game drawn by rule.');
                    io.emit("GameIsDraw");
                } 
            } else {
                console.log("Invalid move:", move);
                socket.emit("InvalidMove", move);
            }
        } catch (error) {
            console.error("error happening in error part -> ",error,chess.fen());
        }
    });
});

server.listen(3000, () => {
    console.log("Listening on port 3000");
});
