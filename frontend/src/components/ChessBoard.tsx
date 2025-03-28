import { Chess, Color, PieceSymbol, Square } from "chess.js";
import { useState } from "react";
import { MOVE } from "../screen/Game";
// import React from 'react'

export const ChessBoard = ({
  chess,
  setBoard,
  board,
  socket,
}: {
  chess: Chess;
  setBoard: any;
  board: ({
    square: Square;
    type: PieceSymbol;
    color: Color;
  } | null)[][];
  socket: WebSocket;
}) => {
  // console.log(board,socket)
  const [from, setFrom] = useState<Square | null>(null);
  // const [to, setTo] = useState<Square | null>(null);
  return (
    <div className="text-black  rounded-md">
      {board.map((row, i) => {
        // console.log(board)
        //    console.log(i)
        return (
          <div key={i} className="flex">
            {row.map((square, j) => {
           //   console.log("i=", i, " j=", j);
              return (
                <div
                  onClick={() => {
                    const squareRepresentation = (String.fromCharCode(97 + j) +
                      "" +
                      (8 - i)) as Square;
                    // console.log(squareRepresentation)
                    if (from == null) {
                      setFrom(squareRepresentation);
                    } else {
                      socket.send(
                        JSON.stringify({
                          type: MOVE,
                          payload: {
                            from: from,
                            to: squareRepresentation,
                          },
                        })
                      );

                      chess.move({
                        from: from,
                        to: squareRepresentation,
                      });

                      setBoard(chess.board());
                      //  console.log(from, squareRepresentation);
                      setFrom(null);
                      // setTo(null);
                    }
                  }}
                  key={j}
                  className={`w-8  md:w-16 md:h-16 h-8 flex justify-center  cursor-pointer items-center ${
                    (i + j) % 2 == 0 ? "bg-[#769656]" : "bg-[#EEEED2]"
                  } relative`}
                >
                  {/* this part is for number and alphabat */}
                  {j == 0 ? (
                    <>
                    <p
                      className={`absolute ${
                        (i + j) % 2 == 0 ? "text-[#EEEED2]" : "text-[#769656]"
                      } top-0 left-1 bg-transparent font-bold`}
                    >
                      {i + 1}
                    </p>
                    {i == 7 && (
                      <p
                        className={`absolute ${
                          (i + j) % 2 == 0 ? "text-[#EEEED2]" : "text-[#769656]"
                        } bottom-0 right-0 bg-transparent font-bold`}
                      >
                        a
                      </p>
                    )}
                  </>
                    // how to add here a character 'a' when i == 7 and 'a' is bottom-0 and right-0 
                  ) : 
                   
                  i == 7 ? (
                    <p
                      className={`absolute ${
                        (i + j) % 2 == 0 ? "text-[#EEEED2]" : "text-[#769656]"
                      } ${
                        j == 0
                          ? "top-0 left-1"
                          : `${i == 7 ? "bottom-0 right-0" : null}`
                      }  bg-transparent font-bold`}
                    >
                      {String.fromCharCode(97 + j)}
                    </p>
                  ) : null}

                  {/* this part is for chess pik */}
                  {square ? (
                    <img
                      className={`w-full ${
                        square?.type === "p"
                          ? `py-3 px-4`
                          : `${
                              square?.type === "k" ? `py-2 px-1 ` : `py-2 px-3`
                            }`
                      } h-full bg-transparent `}
                      src={`/${
                        square?.color === "b"
                          ? square?.type
                          : `${square?.type?.toUpperCase()} copy`
                      }.png`}
                      alt=""
                    />
                  ) : null}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};
