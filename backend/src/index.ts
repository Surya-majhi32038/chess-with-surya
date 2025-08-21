

const express = require("express");
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import { Chess } from "chess.js";
import dotenv from "dotenv";
import path from "path";
const GameModel = require("./database/GameModel.js");
const { connectDB } = require("./database/connectDB.js");
dotenv.config({ path: path.resolve(__dirname, "../.env") });
// console.log("i'm in backend ");
const app = express();
const server = createServer(app);
const allowedOrigins = [
    "http://localhost:5173",
    "https://chess-with-surya-1-frontend.onrender.com"
];
connectDB();
const io = new Server(server, {
    cors: {
        origin: allowedOrigins,
        methods: ["GET", "POST"]
    }
});

// GET / route
app.get('/', (req: any, res: any) => {
    res.send({
        activeStatus: true,
        error: false
    });
});


let game = {
    chess: null as Chess | null,
    players: { white: null as string | null, black: null as string | null },
};

io.on("connection", async (socket: Socket) => {
  await GameModel.deleteMany({
  white: "",
  $or: [
    { black: { $exists: false } },
    { black: null }
  ]
});


    // await GameModel.deleteAll(); // Clear all games at the start of a new connection
    console.log("Player connected:", socket.id);

    // Try to join or create game
    const existingGame = await GameModel.findOne({ status: "waiting" });

    if (!existingGame) {
        const newGame = await GameModel.create({ white: socket.id });
        // game.chess = new Chess();
        game.players.white = socket.id;
        socket.emit("playersRole", "w");
        console.log("White joined:", socket.id);
    } else {
        if (existingGame.black) {
            existingGame.white = socket.id;
            game.players.white = socket.id;
            socket.emit("playersRole", "w");
        } else if (existingGame.white && !existingGame.black) {
            existingGame.black = socket.id;
            game.players.black = socket.id;
            socket.emit("playersRole", "b");
            console.log("Black joined:", socket.id);
        }
        game.chess = new Chess();
        existingGame.status = "ongoing";
        await existingGame.save();
        io.to(game.players.white!).emit("startGame");
        io.to(game.players.black!).emit("startGame");
    }

    // Handle disconnect
    socket.on("disconnect", async () => {
        console.log("Disconnected:", socket.id);
        console.log("Current game state:", game);
        const findGame = await GameModel.findOne({
            $or: [
                { white: socket.id },
                { black: socket.id }
            ]
        });
        if (socket.id === findGame?.white) {
            console.log("White player disconnected, resetting game state.");
            game.chess = null; // Reset chess instance
            game.players.white = null; // Reset white player
            /// find the game 

            console.log("findGame -> ", findGame); //
            if (findGame.black == "") {
                console.log("No black player found, deleting game. -- findGame.black -> ", findGame.black, " !findGame.black -> ", !findGame.black);
                console.log("No black player found, deleting game.");
                await GameModel.findOneAndDelete({ white: socket.id });
                game.players.black = null; // Reset black player
            } else {
                findGame.white = "";
                findGame.status = "waiting";
                game.players.black = findGame.black; // Reset black player
                await findGame.save();
                io.to(findGame.black!).emit("opponetGone");
                console.log("White player disconnected, waiting for black player to reconnect.(opponentGone)", game.players.black);
            }
        } else if (socket.id === findGame?.black) {
            game.chess = null; // Reset chess instance
            game.players.black = null; // Reset black player


            // console.log("findGame -> ", findGame.white);
            if (findGame.white == "") {
                await GameModel.findOneAndDelete({ black: socket.id });
                game.players.white = null; // Reset white player
            } else {
                game.players.white = findGame.white; // Reset black player
                findGame.black = "";
                findGame.status = "waiting";
                await findGame.save();
                io.to(findGame.white!).emit("opponetGone");
                console.log("balck player disconnected, waiting for white player to reconnect.(opponentGone)", game.players.white);
            }
        }

        //game = { chess: null, players: { white: null, black: null } };

    });




    socket.on("timeUp", () => {

        if (socket.id === game.players.white!) {
            io.to(game.players.black!).emit("TimeUp", "white");
        } else {
            io.to(game.players.white!).emit("TimeUp", "balck");
        }
    }
    );


    socket.on("move", async (move: any) => {


        // console.log("move received:", move);

        // console.log(players?.chess?.history({ verbose: true }))
        try {
            if ((game.chess!.turn() === "w" && socket.id !== game.players.white!) ||
                (game.chess!.turn() === "b" && socket.id !== game.players.black)) {
                return;
            }
            // console.log("befor result ")
            const result = game.chess!.move(move);
            // console.log("after result ", result)
            if (result) {
                // console.log("Move made:", move);
                // currentPlayers = players.chess.turn();
                io.to(game.players.white!).emit("move", move)
                io.to(game.players.white!).emit("boardState", game.chess!.fen(), game.chess!.history({ verbose: true }));

                io.to(game.players.black!).emit("move", move)
                io.to(game.players.black!).emit("boardState", game.chess!.fen(), game.chess!.history({ verbose: true }));

                if (game.chess!.isCheckmate() || game.chess!.isCheck()) {
                    const findWinGame = await GameModel.findOne({
                        $or: [
                            { white: game.players.white! },
                            { black: game.players.black! }
                        ]
                    });
                    const winner = game.chess!.turn() === "w" ? "b" : "w";

                    // Send final board state before resetting
                    const fen = game.chess!.fen();
                    const history = game.chess!.history({ verbose: true });

                    // Emit board state to both players
                    io.to(game.players.white!).emit("boardState", fen, history);
                    io.to(game.players.black!).emit("boardState", fen, history);

                    // Emit Checkmate event to both players
                    io.to(game.players.white!).emit("Checkmate", winner);
                    io.to(game.players.black!).emit("Checkmate", winner);
                    findWinGame.status = "finished";
                    // Reset after short delay to ensure frontend receives final state
                    setTimeout(() => {
                        game.chess!.reset();
                    }, 200);
                }

                else if (game.chess!.isStalemate()) {
                    const findWinGame = await GameModel.findOne({
                        $or: [
                            { white: game.players.white! },
                            { black: game.players.black! }
                        ]
                    });
                    io.to(game.players.white!).emit("Stalemate")
                    io.to(game.players.black!).emit("Stalemate")
                    findWinGame.status = "Stalemate";
                    // io.emit("Stalemate");
                    // console.log('🤝 Stalemate. Game drawn.');
                } else if (game.chess!.isDraw()) {
                    const findWinGame = await GameModel.findOne({
                        $or: [
                            { white: game.players.white! },
                            { black: game.players.black! }
                        ]
                    });
                    findWinGame.status = "draw";
                    // console.log('📏 Game drawn by rule.');
                    io.to(game.players.white!).emit("GameIsDraw")
                    io.to(game.players.black!).emit("GameIsDraw")
                    // io.emit("GameIsDraw");
                }
            }
        } catch (error) {

            // console.log("Error in move:", error);
            if (socket.id === game.players.white!) {
                io.to(game.players.white!).emit("Invalidmove", move);
                console.log("Invalid move by white player:", move);
            }
            if (socket.id === game.players.black!) {
                io.to(game.players.black!).emit("Invalidmove", move);
                console.log("Invalid move by black player:", socket.id);
            }
            // console.error("error happening in error part -> ", error);
        }
    });

    socket.on("undoMove", () => {
        if ((game.chess!.turn() === "w" && socket.id !== game.players.white!) ||
            (game.chess!.turn() === "b" && socket.id !== game.players.black!)) {
            return;
        }

        game.chess!.undo();
        io.to(game.players.white!).emit("boardState", game.chess!.fen(), game.chess!.history({ verbose: true }));
        io.to(game.players.black!).emit("boardState", game.chess!.fen(), game.chess!.history({ verbose: true }));

    });

    // after game complitation (like - any user gone, win, other case )
    socket.on("reConnect", async () => {
        const existingGame = await GameModel.findOne({ // find a game that is waiting for players (not it self)
            status: "waiting",
            white: { $ne: socket.id },
            black: { $ne: socket.id },
        });
        console.log("reConnect called for socket:", socket.id, existingGame);
        if (!existingGame) { // not found any game except it self
            // const findGame = await GameModel.findOne({ // find a game where the user is already a player
            //     $or: [
            //         { white: socket.id },
            //         { black: socket.id }
            //     ]
            // });
            // if (!findGame) {

            //     const newGame = await GameModel.create({ white: socket.id });
            //     game.chess = new Chess();
            //     game.players.white = socket.id;
            //     socket.emit("playersRole", "w");
            //     console.log("White joined:", socket.id);
            // }
        } else {
            // find a game where the user is not already a player
            await GameModel.findOneAndDelete({
                $or: [
                    { white: socket.id },
                    { black: socket.id }
                ]
            });
            if (existingGame.black) {
                existingGame.white = socket.id;
                game.players.white = socket.id;
                game.players.black = existingGame.black;
                socket.emit("playersRole", "w");
            } else {
                existingGame.black = socket.id;
                game.players.black = socket.id;
                game.players.white = existingGame.white;
                socket.emit("playersRole", "b");
                console.log("Black joined:", socket.id);
            }
            game.chess = new Chess();
            existingGame.status = "ongoing";
            await existingGame.save();
            io.to(game.players.white!).emit("startGame");
            io.to(game.players.black!).emit("startGame");
        }
    });

});

// ✅ Add this AFTER all API and socket setup
app.use(express.static(path.join(__dirname, "client", "dist")));

app.get("*", (req:any, res:any) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});
server.listen(9000, () => {
    console.log("Listening on port 9000");
});