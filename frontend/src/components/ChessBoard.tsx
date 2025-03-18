import { Color,  PieceSymbol, Square } from 'chess.js'
import { useState } from 'react';
import { MOVE } from '../screen/Game';
// import React from 'react'

export const ChessBoard = ({ board,socket }: {
    board: ({
        square: Square;
        type: PieceSymbol;
        color: Color;
    } | null)[][],
    socket: WebSocket
}) => {
    const [from, setFrom] = useState<Square | null>(null);
   // const [to, setTo] = useState<Square | null>(null);
    return (
        <div className='text-black '>
            {board.map((row, i) => {
                //    console.log(i)
                return <div key={i} className='flex'>
                    {row.map((squre, j) => {

                        return <div
                            onClick={() => {
                                const squareRepresentation = String.fromCharCode((65 + j)) + "" + (8 - i) as Square;
                                // console.log(squareRepresentation)
                                if (from == null) {
                                    setFrom(squareRepresentation);
                                } else {
                                  //  setTo(squareRepresentation)
                                    // console.log(squareRepresentation)
                                   // 
                                    console.log(
                                        {
                                            from: from,
                                            'to':squareRepresentation
                                        }
                                    )
                                    // to convert the simple javascript into json file
                                    socket.send(JSON.stringify({
                                        type:MOVE,
                                        payload: {
                                            from:from,
                                            to:squareRepresentation
                                        }
                                    }))
                                    setFrom(null); 
                                   // setTo(null);
                                }
                            }}
                            key={j}
                            className={`w-8 md:w-16 md:h-16 h-8 flex justify-center cursor-pointer items-center ${(i + j) % 2 == 0 ? 'bg-green-500' : 'bg-white'}`}>
                            {squre ? squre.type : ""}
                        </div>
                    })}
                </div>
            })}
        </div>
    )
}