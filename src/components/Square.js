import { useContext, useEffect, useState } from "react";
import { SocketContext, socket } from "../contexts/SocketContext";

const Square = ({
  rowInd,
  colInd,
  numbersArr,
  isClicked,
  isMyTurn,
  setIsMyTurn,
  room,
  socketid,
}) => {
  const [isSquareClicked, setIsSquareClicked] = useState(isClicked);
  const [isJoined, setIsClicked] = useState(false);
  //   const [isMyTurn, setIsMyTurn] = useState(false);

  const socket = useContext(SocketContext);

  useEffect(() => {
    socket.on("playednum", (data) => {
      let num = data["num"];

      if (num == numbersArr[rowInd * 5 + colInd]) {
        setIsSquareClicked(true);
        setIsMyTurn(false);
        console.log("other player clicked " + num);
      }
    });
    socket.on("play", () => {
      console.log("play");
      setIsMyTurn(true);
    });
  }, []);

  const onClickSquare = (val, rowInd, colInd) => {
    // refArr[rowInd][colInd].current.style.backgroundColor = "red";
    if (!isSquareClicked && isMyTurn) {
      setIsClicked(true);
      // console.log(refArr);
      setIsSquareClicked(true);
      socket.emit("played", val, room, socketid);
    }
  };
  return (
    <div
      className="w-12 h-12 border-solid border border-black  text-center "
      //   ref={(ele) => (refArr[rowInd][colInd] = ele)}
      key={rowInd * 5 + colInd}
      aria-disabled={!isMyTurn}
      style={{ backgroundColor: isSquareClicked ? "#FF2400" : "white" }}
      onClick={() =>
        onClickSquare(numbersArr[rowInd * 5 + colInd], rowInd, colInd)
      }
    >
      {numbersArr[rowInd * 5 + colInd]}
    </div>
  );
};
export default Square;
