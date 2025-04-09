import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { Chess, Square } from "chess.js";
import Modal from "./Modal";
import CountdownTimer from "./CountdownTimer";
// import AutoRefreshComponent from "./AutoRefreshComponent";

const chess = new Chess();

const ChessBoard = () => {
  console.log("chessBoard");
  const [showConnecting, setshowConnecting] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [h1Tag, seth1Tag] = useState("");
  const [p1, setp1] = useState("");
  const [p2, setp2] = useState("");
  const socket = useRef<Socket | null>(null);
  const [board, setBoard] = useState(chess.board());
  const [playerRole, setPlayerRole] = useState<string | null>(null);
  const [sourceSquare, setSourceSquare] = useState<{
    row: number;
    col: number;
  } | null>(null);
  const [ChessHistory, setChessHistory] = useState([]);
  const [timeCounter, settimeCounter] = useState(false);
  // let socket : Socket;
  useEffect(() => {
    // Connect to backend ONLY when this page is mounted
    socket.current = io("http://localhost:3000/");

    socket.current.on("connect", () => {
      // console.log("Connected to socket:", socket?.id);
    });

    // Clean up when leaving the page
    return () => {
      socket.current?.disconnect();
      console.log("Socket disconnected");
    };
  }, []);

  useEffect(() => {
    const handlePlayersRole = (role: string) => {
      console.log("role", role);
      setPlayerRole(role);
      setBoard([...chess.board()]);
    };
    // alert("alert")

    socket.current?.on("playersRole", (role: string) => {
      setPlayerRole(role);

      setBoard([...chess.board()]);
    });

    socket.current?.on("boardState", (fen: string, arr: []) => {
      settimeCounter(playerRole == chess.turn() ? true : false);
      // console.log("boardState->", arr);
      setChessHistory(arr);
      chess.load(fen);
      setBoard([...chess.board()]);
    });
    socket.current?.on("move", (move: { from: Square; to: Square }) => {
      chess.move(move);
      setBoard([...chess.board()]);
    });

    socket.current?.on("startGame", () => {
      // toast.success("Start Game")
      setshowConnecting(!showConnecting);
      // console.log(showConnecting);
      setShowModal(true);
      seth1Tag("WELCOME TO OUR GAME");
      setp1(`You are :${playerRole == "w" ? "WHITE" : "BLACK"}`);
      setp2("Let's Play");
      settimeCounter(playerRole == "w" ? true : false);
      // console.log("in startGame ", showConnecting);
      // console.log("isGameStart : ", showConnecting);
    });

    socket.current?.on("Checkmate", () => {
      if (playerRole == "w") {
        // toast.success("THE WHITE IS WINNER")
        setShowModal(true);
        seth1Tag("YOU WIN THE MATCH");
        setp1(
          `your opponent ${playerRole == "w" ? "BLACK" : "WHITE"} is Checkmate`
        );
        setp2("Reconnecting");
      } else {
        setShowModal(true);
        seth1Tag("YOU WIN THE MATCH");
        setp1(
          `your opponent ${playerRole == "w" ? "BLACK" : "WHITE"} is Checkmate`
        );
        setp2("Reconnecting");
        // toast.success("THE BLACK IS WINNER")
      }
      setBoard([...chess.board()]);
    });
    socket.current?.on("Stalemate", () => {
      // toast.info("Stalemate type of Draw")
      chess.reset();
      setBoard(chess.board());
    });
    socket.current?.on("GameIsDraw", () => {
      // toast.info("Game is Draw By any Rule")
      chess.reset();
      setBoard(chess.board());
    });
    return () => {
      socket.current?.off("playersRole", handlePlayersRole);
      socket.current?.off("spectatorRole");
      socket.current?.off("boardState");
      socket.current?.off("move");
    };
  });

  socket.current?.on("opponetGone", () => {
    setShowModal(true);
    seth1Tag("YOU WIN THE MATCH");
    setp1(`your opponent ${playerRole == "w" ? "BLACK" : "WHITE"} gone`);
    setp2("Reconnecting");
    console.log("show modal ", showModal);
    // if(showModal){
    //     setshowConnecting(!showConnecting)
    // }
    // if(showModal){setshowConnecting(!showConnecting)};
  });

  socket.current?.on("TimeUp", (role: string) => {
    console.log("TimeUp", role);
    setShowModal(true);
    seth1Tag("YOU WIN THE MATCH");
    setp1(`your opponent ${role} is Time Up`);
    setp2("Reconnecting");
    settimeCounter(false);
    // setShowModal(false);
  });
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
    settimeCounter(false);
  };

  const undoHandler = () => {
    console.log("undoHandler");
    socket.current?.emit("undoMove");
  };
  console.log(playerRole, "playerRole");

  const handleTimeUp = () => {
    // setMessage("⏰ You lost! Time's up!");
    socket.current?.emit("timeUp", playerRole);
    setShowModal(true);
    seth1Tag("YOU LOSS THE MATCH");
    setp1(`Reason : Time Up`);
    setp2("Reconnecting");
    settimeCounter(false); // Optionally stop the timer or prevent restart
  };

  if (showConnecting) return <div> Connectiong....</div>;

  return (
    <div className="flex gap-10 ph:mt-20 ph:flex-col ">
      <div className="flex flex-col ">
        {/* main board */}
        <div
          className={`text-black rounded-md ph:px-1  ${
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
                            w-9 h-9  md:w-16 md:h-16  flex justify-center  cursor-pointer items-center ${
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
                              ? `py-3 px-4 ph:py-[3px] ph:px-[6px]`
                              : `${
                                  square?.type === "k"
                                    ? `py-2 px-1 ph:px-[4px] ph:py-[4px]`
                                    : `py-2 px-3 ph:px-[5px] ph:py-[4px]`
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
              </div>
            );
          })}
        </div>
        <div className="flex justify-between ph:flex-col ph:gap-5 items-center mt-4">
          <div className="flex items-center gap-6">
            <p className="text-white text-2xl">
              Your are : {playerRole == "w" ? "White" : "Black"}
            </p>
            <img
              src={`profile-picture-${
                playerRole == "w" ? "white" : "black"
              }.png`}
              alt=""
              className={`h-14 ${
                playerRole == "w"
                  ? "bg-[#4d4948] border-red-100"
                  : "bg-[] border-[#4d4948]"
              } p-1 border  w-auto`}
            />
          </div>
          <div className="flex items-center gap-6 ">
            <CountdownTimer start={timeCounter} onTimeUp={handleTimeUp} />
            <p
              onClick={undoHandler}
              className=" bg-blue-500 text-white px-4 py-2 rounded-lg transition-all duration-300 ease-in-out hover:bg-blue-600  cursor-pointer"
            >
              undo
            </p>
          </div>
        </div>
        {/* <AutoRefreshComponent/> */}
        {showModal && (
          <Modal
            h1Tag={h1Tag}
            p1={p1}
            p2={p2}
            onClose={() => {
              setShowModal(false);
              if (p2 == "Reconnecting") {
                setshowConnecting(true);
              }
            }}
          />
        )}
      </div>

      {/* history part */}
      <div>
        <h1 className="text-white mb-5 text-2xl text-center font-bold  mt-4">
          History
        </h1>
        <div className="flex flex-col items-center justify-center">
          {/* heading part */}
          <div className="flex gap-5 text-white text-xl">
            <p>From</p>
            <p>To</p>
            <p>Piece</p>
          </div>
          {ChessHistory.map((move: any, index: number) => {
            return (
              <div
                className={`flex p-1 my-1 px-5 gap-8 ${
                  index % 2 == 0 ? "bg-[#739254]" : "bg-[#EEEED2]"
                }`}
              >
                <p
                  className={`${
                    index % 2 == 0
                      ? "bg-[#739254] text-[#EEEED2]"
                      : "bg-[#EEEED2] text-[#739254]"
                  }`}
                >
                  {move.from}
                </p>
                <p
                  className={`${
                    index % 2 == 0
                      ? "bg-[#739254] text-[#EEEED2]"
                      : "bg-[#EEEED2] text-[#739254]"
                  }`}
                >
                  {move.to}
                </p>
                <img
                  src={`${
                    index % 2 == 0
                      ? move.piece.toUpperCase() + " copy"
                      : move.piece + ""
                  }.png`}
                  alt=""
                  className={`h-[20px] w-auto ${
                    index % 2 == 0 ? "bg-[#739254]" : "bg-[#EEEED2]"
                  }`}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ChessBoard;
