import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { Chess, Square } from "chess.js";
import Modal from "./Modal";
import CountdownTimer from "./CountdownTimer";
import { toast } from "react-toastify";
import { playSound } from "../utils/playSounds";
// import AutoRefreshComponent from "./AutoRefreshComponent";

const chess = new Chess();

const ChessBoard = () => {
  console.log("chessBoard");
  const [sourceSquares, setSourceSquares] = useState<null | {
    row: number;
    col: number;
  }>(null);
  const [validMoves, setValidMoves] = useState<{ row: number; col: number }[]>(
    []
  );
  const [showConnecting, setshowConnecting] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [h1Tag, seth1Tag] = useState("");
  const [p1, setp1] = useState("");
  const [p2, setp2] = useState("");
  const socket = useRef<Socket | null>(null);
  const [board, setBoard] = useState(chess.board());
  const [playerRole, setPlayerRole] = useState<string | null>(null);
  const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(
    null
  );
  const [ChessHistory, setChessHistory] = useState([]);
  const [timeCounter, settimeCounter] = useState(false);
  // let socket : Socket;
  useEffect(() => {
    // console.log("ChessBoard mounted", import.meta.env.VITE_SERVER_LOCAL_URL);
    //  http://localhost:9000/
    // Connect to backend ONLY when this page is mounted https://chess-with-surya.onrender.com/  ${import.meta.env.VITE_SERVER_LOCAL_URL}
    socket.current = io(`https://chess-with-surya.onrender.com/`);

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
    socket.current?.on("playersRole", handlePlayersRole);
    // socket.current?.on("playersRole", (role: string) => {
    //   setPlayerRole(role);

    //   setBoard([...chess.board()]);
    // });

    socket.current?.on("boardState", (fen: string, arr: []) => {
      //   console.log("boardState", fen, arr);
    //   console.log("ChessHistory", arr);
      const lastMove:any | string = arr[arr.length - 1];
      const isCapture = lastMove?.flags?.includes("c");
    //   console.log("isCapture", isCapture);
    //   console.log("lastMove", lastMove);
      if (isCapture) {
        playSound("../../public/sounds/capture.mp3");
      } else {
        playSound("../../public/sounds/move.mp3");
      }
     // playSound("../../public/sounds/move.mp3");
      settimeCounter(playerRole == chess.turn() ? true : false);
      // console.log("boardState->", arr);
      setChessHistory([]);
      setChessHistory(arr);
      //   console.log("ChessHistory", ChessHistory);
      chess.load(fen);
      setBoard([...chess.board()]);
    });
    socket.current?.on("move", (move: { from: Square; to: Square }) => {
      chess.move(move);
      setBoard([...chess.board()]);
    });
    // to print the whole game
    socket.current?.on("printGames", (game: []) => {
      console.log("Games array ", game);
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
    });

    socket.current?.on("Checkmate", (winner) => {
      setShowModal(true);
        playSound("../../public/sounds/checkmate.mp3");
      if (!playerRole) return;
      const isWinner = playerRole === winner;

      if (isWinner) {
        seth1Tag("YOU WIN 🎉");
        setp1(
          `Your opponent (${
            playerRole === "white" ? "BLACK" : "WHITE"
          }) is Checkmated`
        );
      } else {
        seth1Tag("YOU LOST 😢");
        setp1(`You (${playerRole.toUpperCase()}) are Checkmated`);
      }

      setp2("Play Again");
      settimeCounter(false);
    });
    socket.current?.on("Stalemate", () => {
      // toast.info("Stalemate type of Draw")
      chess.reset();
      setShowModal(true);
      seth1Tag(" THE MATCH IS TIE");
      setp1(" No legal moves available and no check – it's a tie!");
      setp2("Reconnecting");
      setBoard(chess.board());
    });

    socket.current?.on("GameIsDraw", () => {
      chess.reset();
      setShowModal(true);
      seth1Tag(" THE MATCH IS TIE");
      setp1(" No legal moves available and no check – it's a tie!");
      setp2("Reconnecting");
      setBoard(chess.board());
    });
    return () => {
      socket.current?.off("playersRole", handlePlayersRole);
      socket.current?.off("spectatorRole");
      socket.current?.off("boardState");
      socket.current?.off("move");
    };
  });

  // when a ChessHistry is changed
  useEffect(() => {
    //console.log("ChessHistory changed:", ChessHistory);
    //setChessHistory(ChessHistory);
  }, [ChessHistory]);

  socket.current?.on("opponetGone", () => {
    seth1Tag("YOU WIN THE MATCH");
    setp1(`your Opponent ${playerRole == "w" ? "BLACK" : "WHITE"} Left ⚠️  `);
    setp2("Reconnecting");
    setShowModal(true);
    console.log("show modal ", showModal);
    // settimeCounter(false);
  });
  // only for testing purpose
  socket.current?.on("checkGamesArray", (game: []) => {
    console.log("Games array ", game);
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
    setLastMove({ from: move.from, to: move.to }); // or whatever the move is
    socket.current?.emit("move", move);
    // playSound("../../public/sounds/move.mp3");
    settimeCounter(false);
  };

  // reconnecting
  const reConnect = () => {
    chess.reset();
    setBoard(chess.board());
    socket.current?.emit("reConnect");
  };
  const undoHandler = () => {
    console.log("undoHandler");
    socket.current?.emit("undoMove");
  };
  //   console.log(playerRole, "playerRole");
  useEffect(() => {
    const handleInvalidMove = (rote: any) => {
      console.log("Invalid move for role:", rote);
      toast.error(
        `Invalid move! from ${rote.from} to ${rote.to}!` // Display the error message
      );
    };

    socket.current?.on("Invalidmove", handleInvalidMove);

    return () => {
      socket.current?.off("Invalidmove", handleInvalidMove);
    };
  }, []);

  const handleTimeUp = () => {
    // setMessage("⏰ You lost! Time's up!");
    socket.current?.emit("timeUp", playerRole);
    setShowModal(true);
    seth1Tag("YOU LOSS THE MATCH");
    setp1(`Reason : Time Up`);
    setp2("Reconnecting");
    settimeCounter(false); // Optionally stop the timer or prevent restart
  };

  // this is for phone

  function handleSquareClick(row: number, col: number) {
    const file = "abcdefgh"[col];
    const rank = 8 - row;
    const square = `${file}${rank}` as Square;

    if (sourceSquares) {
      // Destination click
      const dest = { row, col };
      const isValid = validMoves.some(
        (move) => move.row === dest.row && move.col === dest.col
      );

      if (isValid) {
        handleMove(sourceSquares, dest);
      }

      setSourceSquares(null);
      setValidMoves([]);
    } else {
      // Source click
      const moves = chess.moves({ square, verbose: true });
      const destinations = moves.map((m) => {
        const toFile = m.to[0];
        const toRank = m.to[1];
        return {
          row: 8 - parseInt(toRank),
          col: "abcdefgh".indexOf(toFile),
        };
      });
      console.log(destinations);

      // add green live but not tested from chatGPT
      if (destinations.length > 0) {
        setSourceSquares({ row, col });
        setValidMoves(destinations);
      }
    }
  }
  function isLastMovedPiece(rowIndex: any, colIndex: any, lastMove: any) {
    if (!lastMove) return false;

    const coordsToAlgebraic = (row: any, col: any) => {
      const file = String.fromCharCode(97 + col); // 'a' to 'h'
      const rank = 8 - row; // row 0 = rank 8
      return file + rank;
    };

    const square = coordsToAlgebraic(rowIndex, colIndex);
    return square === lastMove.to;
  }

  if (showConnecting) return <div> Connectiong....</div>;

  return (
    <div className="flex gap-7 ph:overflow-auto  no-scrollbar ph:mt-4 ph:flex-col ">
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
                            w-10 h-10  md:w-16 md:h-16  flex justify-center  cursor-pointer items-center ${
                              (rowIndex + squareIndex) % 2 == 0
                                ? "bg-[#769656]"
                                : "bg-[#EEEED2]"
                            } relative
                            ${
                              validMoves.some(
                                (m) =>
                                  m.row === rowIndex && m.col === squareIndex
                              )
                                ? "bg-yellow-400 bg-opacity-50"
                                : ""
                            }
                            `}
                      onClick={() => handleSquareClick(rowIndex, squareIndex)}
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
                                className={`ph:text-[14px] ph:font-normal absolute ${
                                  (rowIndex + squareIndex) % 2 == 0
                                    ? "text-[#EEEED2]"
                                    : "text-[#769656]"
                                } top-0 left-1 bg-transparent font-bold rotate-180`}
                              >
                                h
                              </p>
                            )}
                          </>
                        ) : // how to add here a character 'a' when i == 7 and 'a' is bottom-0 and right-1
                        rowIndex == 0 ? (
                          <p
                            className={`ph:text-[14px] ph:-top-[2px] ph:left-[1px] ph:font-normal absolute ${
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
                            {String.fromCharCode(97 + squareIndex)}
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
                            } top-0 left-1 ph:text-[14px] ph:font-normal bg-transparent font-bold `}
                          >
                            {8 - rowIndex}
                          </p>
                          {rowIndex == 7 && (
                            <p
                              className={`ph:text-[14px] ph:font-normal absolute ${
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
                          className={`ph:text-[14px] ph:-bottom-[2px] ph:right-[1px] ph:font-normal absolute ${
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
                          className={`
                            w-full h-full bg-transparent 
                            ${playerRole === "w" ? "" : "rotate-180"} 
                            transition-transform duration-300 ease-in-out
                            ${
                              isLastMovedPiece(rowIndex, squareIndex, lastMove)
                                ? "animate-piece "
                                : ""
                            }
                            ${
                              square?.type === "p"
                                ? `py-3 px-4 ph:py-[3px] ph:px-[6px]`
                                : square?.type === "k"
                                ? `py-2 px-1 ph:px-[4px] ph:py-[4px]`
                                : `py-2 px-3 ph:px-[5px] ph:py-[4px]`
                            }
                            `}
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
            <p className="text-white ph:text-xl text-2xl">
              Your are : {playerRole == "w" ? "White" : "Black"}
            </p>
            <img
              src={`profile-picture-${
                playerRole == "w" ? "white" : "black"
              }.png`}
              alt=""
              className={`h-14 ph:h-8 ph:w-8 ${
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
              className=" bg-blue-500 text-white px-4 ph:text-sm py-2 rounded-lg transition-all duration-300 ease-in-out hover:bg-blue-600  cursor-pointer"
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
                if(p2 == "Let's Play" || p2 == "Play Again") {
              playSound("../../public/sounds/gameStart.mp3"); }
              setShowModal(false);
              if (p2 == "Reconnecting") {
                setshowConnecting(true);
                reConnect();
                setChessHistory([]);
              } else if (p2 == "Play Again") {
                chess.reset();
                setBoard(chess.board());
                setChessHistory([]);
                // socket.current?.emit("reStartGame");
              }
            }}
          />
        )}
      </div>

      {/* history part */}

      <div>
        <h1 className="text-white mb-5 text-2xl text-center font-bold ph:mt-0 mt-4">
          History
        </h1>
        <div className="flex flex-col items-center justify-center">
          {/* heading part */}
          <div className="flex  ph:gap-7 font-semibold gap-5 text-white text-xl">
            <p>From</p>
            <p>To</p>
            <p>Piece</p>
          </div>
          <div className="max-h-[400px] ph:h-[120px] overflow-y-auto  ">
            {ChessHistory.slice()
              .reverse()
              .map((move: any, index: number) => {
                return (
                  <div
                    key={`${move.from}-${move.to}-${index}`}
                    className="flex p-1 font-light justify-evenly text-neutral-200 my-1 px-5 gap-8"
                  >
                    <p>{move.from}</p>
                    <p>{move.to}</p>
                    <img
                      src={`${
                        move.color === "w"
                          ? move.piece.toUpperCase() + " copy"
                          : move.piece
                      }.png`}
                      alt=""
                      className="h-[20px] w-auto"
                    />
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChessBoard;
