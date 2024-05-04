import React from "react";
import Square from "./Square";
const BingoRow = ({
  rowInd,
  numbersArr,
  refArr,
  isClicked,
  isMyTurn,
  setIsMyTurn,
  room,
  socketid,
  isStarted,
}) => {
  let arr = [1, 2, 3, 4, 5];

  return arr.map((_, colInd) => {
    return (
      <Square
        rowInd={rowInd}
        colInd={colInd}
        isClicked={false}
        numbersArr={numbersArr}
        isMyTurn={isMyTurn}
        setIsMyTurn={setIsMyTurn}
        room={room}
        socketid={socketid}
        isStarted={isStarted}
      />
    );
  });
};
export default BingoRow;
