import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { Chess, Square } from "chess.js";
// import AutoRefreshComponent from "./AutoRefreshComponent";

const chess = new Chess();

const ChessBoard = () => {
    console.log("chessBoard")
    const [showConnecting, setshowConnecting] = useState(true)

  const socket = useRef<Socket | null>(null);
  // let socket : Socket;
  useEffect(() => {
    // Connect to backend ONLY when this page is mounted
    socket.current = io("http://localhost:3000");

    socket.current.on("connect", () => {
      // console.log("Connected to socket:", socket?.id);
    });

    // Clean up when leaving the page
    return () => {
      socket.current?.disconnect();
      console.log("Socket disconnected");
    };
  }, []);

  const [board, setBoard] = useState(chess.board());
  const [playerRole, setPlayerRole] = useState<string | null>(null);
  const [sourceSquare, setSourceSquare] = useState<{
    row: number;
    col: number;
  } | null>(null);

  useEffect(() => {
    const handlePlayersRole = (role: string) => {
      console.log("role", role);
      setPlayerRole(role);
      setBoard([...chess.board()]);
    };
    // alert("alert")

    socket.current?.on("playersRole", (role: string) => {
      // console.log("role are here the id is ", socket.id);
      setPlayerRole(role);
     
      setBoard([...chess.board()]);
    });
    socket.current?.on("spectatorRole", () => {
    //   toast.success("You are Spectator")
      setPlayerRole(null);
      setBoard([...chess.board()]);
    });
    socket.current?.on("boardState", (fen: string) => {
      chess.load(fen);
      setBoard([...chess.board()]);
    });
    socket.current?.on("move", (move: { from: Square; to: Square }) => {
      chess.move(move);
      setBoard([...chess.board()]);
    });
    
    socket.current?.on("startGame",()=>{
        // toast.success("Start Game")
        setshowConnecting(!showConnecting)
        console.log("in startGame ",showConnecting)
        // console.log("isGameStart : ",isGameStart)
    })
    
    socket.current?.on("Checkmate",()=>{
        if(playerRole == "w"){
            // toast.success("THE WHITE IS WINNER")
        } else {
            // toast.success("THE BLACK IS WINNER")
        }
        setBoard([...chess.board()]);
    })
    socket.current?.on("Stalemate",()=>{
        // toast.info("Stalemate type of Draw")
        chess.reset();
        setBoard(chess.board())
    })
    socket.current?.on("GameIsDraw",()=>{
        // toast.info("Game is Draw By any Rule")
        chess.reset();
        setBoard(chess.board())
    })
    return () => {
        socket.current?.off("playersRole", handlePlayersRole);
        socket.current?.off("spectatorRole");
        socket.current?.off("boardState");
        socket.current?.off("move");
    };
});
socket.current?.on("stopGame",(loser)=>{
    console.log("before the clear",chess.fen());
    chess.reset();
    console.log("after the clear",chess.fen());
    // toast.info(`player ${loser.toUpperCase()} out of the game`)
    // setisGameStart(!isGameStart);
    // chess.reset();
    // setBoard([...chess.board()]);
})

  const handleMove = (
    source: { row: number; col: number },
    target: { row: number; col: number }
  ) => {
    const move = {
      from: `${String.fromCharCode(97 + source.col)}${
        8 - source.row
      }` as Square,
      to: `${String.fromCharCode(97 + target.col)}${8 - target.row}` as Square,
      //   promotion: "q",
    };
    
      socket.current?.emit("move", move);
  };

  console.log(playerRole, "playerRole");

  if(showConnecting && playerRole) return (
    <div> Connectiong....</div>
  )
  
  return (
    
    <>
      <div
        className={`text-black rounded-md  ${
          playerRole === "w" ? "" : "rotate-180"
        } p-2 ph:p-0`}
      >
        {board.map((row, rowIndex) => {
          //  console.log(rowIndex);
          return (
            <div key={rowIndex} className="flex">
              {row.map((square, squareIndex) => {
                return (
                  <div
                    key={`${rowIndex}-${squareIndex}`}
                    className={`
                            w-10 h-10  md:w-16 md:h-16  flex justify-center  cursor-pointer items-center ${
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
                        // console.log("player color :",playerRole,sourceSquare, "sourceSquare",{
                        //     row: rowIndex,
                        //     col: squareIndex,
                        //   });
                        setSourceSquare(null);
                      }
                    }}
                  >
                    {/* this part is for number and alphabat */}
                    {playerRole == null ? null : playerRole === "b" ? (
                      squareIndex == 7 ? (
                        <>
                          <p
                            className={`ph:text-[10px] ph:font-normal absolute ${
                              (rowIndex + squareIndex) % 2 == 0
                                ? "text-[#EEEED2]"
                                : "text-[#769656]"
                            } bottom-0 ph:text-xs right-1 bg-transparent font-bold rotate-180`}
                          >
                            {8 - rowIndex}
                          </p>
                          {rowIndex == 0 && (
                            <p
                              className={`ph:text-[10px] ph:font-normal absolute ${
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
                          className={`ph:text-[10px] ph:font-normal absolute ${
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
                    ) : // run when playerRole is white

                    
                    squareIndex == 0 ? (
                      <>
                        <p
                          className={`absolute ${
                            (rowIndex + squareIndex) % 2 == 0
                              ? "text-[#EEEED2]"
                              : "text-[#769656]"
                          } top-0 left-1 ph:text-[10px] ph:font-normal bg-transparent font-bold `}
                        >
                          {8 - rowIndex}
                        </p>
                        {rowIndex == 7 && (
                          <p
                            className={`ph:text-[10px] ph:font-normal absolute ${
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
                        className={`ph:text-[10px] ph:font-normal absolute ${
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
                            ? `py-3 px-4 ph:py-0 ph:px-1`
                            : `${
                                square?.type === "k"
                                  ? `py-2 px-1 ph:px-0 ph:py-0`
                                  : `py-2 px-3 ph:py-0 ph:px-1`
                              }`
                        } h-full bg-transparent ${
                          playerRole === "w" ? "" : "rotate-180"
                        }`}
                        draggable={playerRole === square.color}
                        onDragStart={(e: React.DragEvent<HTMLImageElement>) => {
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
            </div>
          );
        })}
      </div>
      <p className="text-white text-2xl">
        Your are : {playerRole == "w" ? "White" : playerRole == "b" ? "Black" : "Spectator"}
      </p>
      {/* <AutoRefreshComponent/> */}
    </>
  );
};

export default ChessBoard;
