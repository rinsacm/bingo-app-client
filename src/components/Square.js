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
  currentClickedNum,
  setCurrentClickedNum,
}) => {
  const [isSquareClicked, setIsSquareClicked] = useState(isClicked);
  const [isJoined, setIsClicked] = useState(false);
  const [latestNumbers, setLatestNumbers] = useState(null);
  //   const [isMyTurn, setIsMyTurn] = useState(false);
  const socket = useContext(SocketContext);
  const [sqBgColor, setSqBgColor] = useState("white");
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
      setCurrentClickedNum(num);
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
      setCurrentClickedNum(val);
      setIsSquareClicked(true);
      setIsMyTurn(false);
      console.log(val);
      socket.emit("played", val, room, socketid);
    }
  };
  useEffect(() => {
    let tempColor = isSquareClicked
      ? currentClickedNum === numbersArr[rowInd * 5 + colInd]
        ? "#FF34"
        : "#FF2400"
      : "white";
    setSqBgColor(tempColor);
  }, [currentClickedNum, isSquareClicked]);
  return (
    <div
      className="w-12 h-12 border-solid border border-black  text-center "
      //   ref={(ele) => (refArr[rowInd][colInd] = ele)}
      key={rowInd * 5 + colInd}
      aria-disabled={!isMyTurn}
      style={{
        backgroundColor: sqBgColor,
      }}
      onClick={() =>
        onClickSquare(numbersArr[rowInd * 5 + colInd], rowInd, colInd)
      }
    >
      {numbersArr[rowInd * 5 + colInd]}
    </div>
  );
};
export default Square;
