import { useState, useEffect } from "react";
import ChessBoard from "../components/ChessBoard";

const Game = () => {
 

//   useEffect(() => {
//     // If sessionStorage is empty, reset the board
//     if (!sessionStorage.getItem("chessboard")) {
//       setKey(prevKey => prevKey + 1); // Change key to force re-render
//     }
//   }, []);

  return (
    <div className="flex justify-center items-center h-screen">
    <ChessBoard  /> 
    </div>
  );
};

export default Game;
