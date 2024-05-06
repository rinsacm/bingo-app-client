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
  isStarted,
}) => {
  const [isSquareClicked, setIsSquareClicked] = useState(isClicked);
  const [isJoined, setIsClicked] = useState(false);
  const [latestNumbers, setLatestNumbers] = useState(null);
  //   const [isMyTurn, setIsMyTurn] = useState(false);

  const socket = useContext(SocketContext);
  // useEffect(() => {
  //   console.log(numbersArr);
  // }, [numbersArr]);
  useEffect(() => {
    if (isStarted == true) {
      socket.on("playednum", onPlayed);
      socket.on("play", () => {
        console.log("play");
        setIsMyTurn(true);
      });
      socket.on("restartclicked", () => {
        setIsSquareClicked(false);
        setIsMyTurn(false);
      });
      socket.on("datareset", () => {
        setIsSquareClicked(false);
        setIsMyTurn(false);
      });
    }
    return () => {
      socket.off("playednum", onPlayed);
    };
  }, [isStarted, numbersArr]);
  // useEffect(() => {
  //   if (isStarted == true) {
  //     socket.on("playednum", (data) => {
  //       onPlayed(data);
  //     });
  //   }
  // }, [numbersArr]);

  const onPlayed = (data) => {
    console.log(numbersArr);
    let num = data["num"];

    if (
      num == numbersArr[rowInd * 5 + colInd] &&
      data["socketid"] != socketid
    ) {
      setIsSquareClicked(true);
      console.log("other player clicked " + num);
    }
    if (data["socketid"] == socketid) setIsMyTurn(false);
  };

  const onClickSquare = (val, rowInd, colInd) => {
    // refArr[rowInd][colInd].current.style.backgroundColor = "red";
    if (!isSquareClicked && isMyTurn) {
      setIsClicked(true);
      // console.log(refArr);
      setIsSquareClicked(true);
      setIsMyTurn(false);
      console.log(val);
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
