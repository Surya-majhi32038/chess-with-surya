import { useEffect, useState } from "react";
import { ChessBoard } from "../components/ChessBoard";
import { useSockts } from "../hooks/useSockts";
import Button from "./Button";
import { Chess } from "chess.js";

export const INIT_GAME = "init_game";
export const MOVE = "move";
export const GAME_OVER = "game_over";
const Game = () => {
    const socket = useSockts();
    const [chess, setChess] = useState(new Chess());
    const [board, setBoard] = useState(chess.board());

    useEffect(() => {
        if (!socket) {
            return;
        }
        socket.onmessage = (e) => {
            const message = JSON.parse(e.data);
            // console.log(message);
            switch (message.type) {
                case INIT_GAME:
                    setChess(new Chess());
                    setBoard(chess.board());
                    console.log("Game initialized");
                    break;
                case MOVE:
                    const move = message.payload;
                    chess.move(move);
                    setBoard(chess.board());
                    console.log("Move made");
                    break;
                case GAME_OVER:
                    console.log("Game over");
                    break;
            }
        };
    }, [socket]);

    if (!socket) return <div>Connecting...</div>;
    return (
        <div className="flex justify-center">
            <div className="pt-8 max-w-screen-lg w-full">
                <div className="grid grid-cols-6 gap-4 w-full ">
                    <div className="col-span-4 bg-red-200 w-full">
                        <ChessBoard board={board} socket={socket} />
                    </div>
                    <div className="col-span-2 flex items-center justify-center bg-green-200 w-full">
                        <Button
                            onClick={() => {
                                socket.send(
                                    JSON.stringify({
                                        type: INIT_GAME, // The function JSON.stringify() converts a JavaScript object or value into a JSON-formatted string.
                                    })
                                );
                            }}
                        >
                            Play
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Game;
