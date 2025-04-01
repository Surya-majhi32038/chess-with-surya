import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { Chess, Square } from "chess.js";

const socket = io("http://localhost:3000/");

const chess = new Chess();

const ChessBoard = () => {
  const [board, setBoard] = useState(chess.board());
  const [playerRole, setPlayerRole] = useState<string | null>(null);
  const [sourceSquare, setSourceSquare] = useState<{
    row: number;
    col: number;
  } | null>(null);

  useEffect(() => {
    const handlePlayersRole = (role: string) => {
      setPlayerRole(role);
      setBoard([...chess.board()]);
    };

    socket.on("playersRole", handlePlayersRole);
    socket.on("spectatorRole", () => {
      setPlayerRole(null);
      setBoard([...chess.board()]);
    });
    socket.on("boardState", (fen: string) => {
      chess.load(fen);
      setBoard([...chess.board()]);
    });
    socket.on("move", (move: { from: Square; to: Square }) => {
      chess.move(move);
      setBoard([...chess.board()]);
    });

    return () => {
      socket.off("playersRole", handlePlayersRole);
      socket.off("spectatorRole");
      socket.off("boardState");
      socket.off("move");
    };
  }, []);

  const handleMove = (
    source: { row: number; col: number },
    target: { row: number; col: number }
  ) => {
    const move = {
      from: `${String.fromCharCode(97 + source.col)}${
        8 - source.row
      }` as Square,
       to: `${String.fromCharCode(97 + target.col)}${8 - target.row}` as Square
    //   promotion: "q",
    };

    if (chess.move(move)) {
      socket.emit("move", move);
      setBoard([...chess.board()]);
    }
  };
  
  return (
    <>
    <div
      className={`text-black rounded-md ${
          playerRole === "w" ? "" : "rotate-180"
        } p-2`}
        >
      { board.map((row, rowIndex) => {
          //  console.log(rowIndex);
          return (
              <div key={rowIndex} className="flex">
                {row.map((square, squareIndex) => {
                    return (
                     
                    <div
                      key={`${rowIndex}-${squareIndex}`}
                      className={`
                            w-8  md:w-16 md:h-16 h-8 flex justify-center  cursor-pointer items-center ${
                              (rowIndex + squareIndex) % 2 == 0
                                ? "bg-[#769656]"
                                : "bg-[#EEEED2]"
                            } relative`}
                      onDragOver={(e: React.DragEvent<HTMLDivElement>) =>
                        e.preventDefault()
                      }
                      onDrop={(e: React.DragEvent<HTMLDivElement>) => {
                        e.preventDefault();
                        if (sourceSquare) {
                          handleMove(sourceSquare, {
                            row: rowIndex,
                            col: squareIndex,
                          });
                          setSourceSquare(null);
                        }
                      }}
                    >
                      {/* this part is for number and alphabat */}
                      {playerRole === "b" ? (
                        squareIndex == 7 ? (
                          <>
                            <p
                              className={`absolute ${
                                (rowIndex + squareIndex) % 2 == 0
                                  ? "text-[#EEEED2]"
                                  : "text-[#769656]"
                              } bottom-0 right-1 bg-transparent font-bold rotate-180`}
                            >
                              {8 - rowIndex}
                            </p>
                            {rowIndex == 0 && (
                              <p
                                className={`absolute ${
                                  (rowIndex + squareIndex) % 2 == 0
                                    ? "text-[#EEEED2]"
                                    : "text-[#769656]"
                                } top-0 left-1 bg-transparent font-bold rotate-180`}
                              >
                                a
                              </p>
                            )}
                          </>
                        ) : // how to add here a character 'a' when i == 7 and 'a' is bottom-0 and right-1
                        rowIndex == 0 ? (
                          <p
                            className={`absolute ${
                              (rowIndex + squareIndex) % 2 == 0
                                ? "text-[#EEEED2]"
                                : "text-[#769656]"
                            } ${
                              squareIndex == 0
                                ? `${
                                    rowIndex == 0
                                      ? "top-0 left-1"
                                      : "bottom-0 right-1"
                                  }`
                                : `${rowIndex == 0 ? "top-0 left-1" : null}`
                            }  bg-transparent font-bold rotate-180`}
                          >
                            {String.fromCharCode(104 - squareIndex)}
                          </p>
                        ) : null
                      ) : squareIndex == 0 ? (
                        <>
                          <p
                            className={`absolute ${
                              (rowIndex + squareIndex) % 2 == 0
                                ? "text-[#EEEED2]"
                                : "text-[#769656]"
                            } top-0 left-1 bg-transparent font-bold `}
                          >
                            {rowIndex + 1}
                          </p>
                          {rowIndex == 7 && (
                            <p
                              className={`absolute ${
                                (rowIndex + squareIndex) % 2 == 0
                                  ? "text-[#EEEED2]"
                                  : "text-[#769656]"
                              } bottom-0 right-1 bg-transparent font-bold `}
                            >
                              a
                            </p>
                          )}
                        </>
                      ) : // how to add here a character 'a' when i == 7 and 'a' is bottom-0 and right-1
                      rowIndex == 7 ? (
                        <p
                          className={`absolute ${
                            (rowIndex + squareIndex) % 2 == 0
                              ? "text-[#EEEED2]"
                              : "text-[#769656]"
                          } ${
                            squareIndex == 0
                              ? "top-0 left-1"
                              : `${rowIndex == 7 ? "bottom-0 right-1" : null}`
                          }  bg-transparent font-bold `}
                        >
                          {String.fromCharCode(97 + squareIndex)}
                        </p>
                      ) : null}

                      {square && (
                        <img
                          src={`/${
                            square?.color === "b"
                              ? square?.type
                              : `${square?.type?.toUpperCase()} copy`
                          }.png`}
                          alt={square.type}
                          className={`piece ${
                            square.color === "w" ? "white" : "black"
                          } w-full ${
                            square?.type === "p"
                              ? `py-3 px-4`
                              : `${
                                  square?.type === "k"
                                    ? `py-2 px-1 `
                                    : `py-2 px-3`
                                }`
                          } h-full bg-transparent ${
                            playerRole === "w" ? "" : "rotate-180"
                          }`}

                          draggable={playerRole === square.color}
                          onDragStart={(
                            e: React.DragEvent<HTMLImageElement>
                          ) => {
                            if (playerRole === square.color) {
                              setSourceSquare({
                                row: rowIndex,
                                col: squareIndex,
                              });
                              e.dataTransfer.setData("text/plain", "");
                            }
                          }}

                    
                        />
                      )}

                    </div>
                  );
                })}
                ;
              </div>
            );
          }) }

    </div>
     <p className="text-white text-2xl">Your are : {playerRole == "w"? "White":"Black"}</p>
    </>
  );
};

export default ChessBoard;
