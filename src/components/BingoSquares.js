import React, { useContext, useEffect, useState } from "react";
import BingoRow from "./BingoRow";
import "../App.css";
import { SocketContext } from "../contexts/SocketContext";
import { useLocation, useNavigate } from "react-router-dom";

const BingoSquares = ({
  isJoinedRoom = false,
  roomName = "",
  username = "",
}) => {
  const [bingoStr, setBingoStr] = useState("");

  const [numbersArr, setNumbersArr] = useState(Array(25).fill(0));
  let arr = [1, 2, 3, 4, 5];
  const [rowCountArr, setRowCountArr] = useState(Array(5).fill(0));
  const [colCountArr, setColCountArr] = useState(Array(5).fill(0));

  const [loading, setLoading] = useState(true);
  const [isMyTurn, setIsMyTurn] = useState(false);
  const [players, setPlayers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [diag1Count, setDiag1Count] = useState(0);
  const [diag2Count, setDiag2Count] = useState(0);
  const [isBINGOEnabled, setIsBINGOEnabled] = useState(false);
  const [isStartEnabled, setIsStartEnabled] = useState(false);
  const [socketid, setSocketid] = useState(null);
  const [winner, setWinner] = useState(null);
  const [isBINGOClicked, setIsBINGOClicked] = useState(false);
  const [haveNewPlayer, setHaveNewPlayer] = useState(0);
  const [leftOnePlayer, setLeftOnePlayer] = useState(0);
  const [customOrderIndex, setCustomOrderIndex] = useState(0);
  const [orderedNumbers, setOrderedNumbers] = useState(null);
  const [numbersOrder, setNumbersOrder] = useState("random");
  const [restart, setRestart] = useState(false);
  const [currentClickedNum, setCurrentClickedNum] = useState(null);
  let navigate = useNavigate();
  const location = useLocation();

  const [name, setName] = useState(location.state.username);
  const [room, setRoom] = useState(location.state.roomName);

  //creating array of numbers from 1 to 25
  let orderedArr = Array(25)
    .fill(0)
    .map((_, i) => i + 1);

  const socket = useContext(SocketContext);
  //addsLetter to bingo string based on the count on row ,column,diagonal count array
  const addLetterToBINGOStr = () => {
    setBingoStr((prev) => {
      let tempStr = prev;
      if (tempStr == "") {
        tempStr += "B";
      } else if (tempStr === "B") {
        tempStr += "I";
      } else if (tempStr == "BI") {
        tempStr += "N";
      } else if (tempStr == "BIN") {
        tempStr += "G";
      } else if (tempStr == "BING") {
        tempStr += "O";
      }
      return tempStr;
    });
  };
  useEffect(() => {}, [numbersArr]);

  useEffect(() => {
    console.log(numbersArr);
    setRowCountArr(Array(5).fill(0));
    setColCountArr(Array(5).fill(0));
    setDiag1Count(0);
    setDiag2Count(0);
    if (isStarted) startGame();
  }, [numbersArr, loading]);
  useEffect(() => {
    console.log(loading);
  }, [loading]);

  /*  
    1.sets the numbersOrder to random
    2.creating array of numbers from 1 to 25
  
  */
  const makeArrayRandom = () => {
    setNumbersOrder("random");
    let orderedArr = Array(25)
      .fill(0)
      .map((_, i) => i + 1);
    let tempArr = [];
    for (let i = 0; i < 25; i++) {
      let rnum = Math.floor(Math.random() * orderedArr.length);

      tempArr = [...tempArr, orderedArr[rnum]];
      if (rnum == orderedArr.length - 1) {
        orderedArr = orderedArr.slice(0, rnum);
      } else {
        if (rnum == 0) {
          if (orderedArr.length == 1) {
            orderedArr = [];
          } else orderedArr = orderedArr.slice(rnum + 1, orderedArr.length);
        } else {
          orderedArr = orderedArr
            .slice(0, rnum)
            .concat(orderedArr.slice(rnum + 1, orderedArr.length));
        }
      }
    }
    setNumbersArr(tempArr);
  };

  const joinRoom = (name, room) => {
    setIsStartEnabled(true);

    console.log("joining room", room, name);
    socket.emit("join", name, room);
  };

  useEffect(() => {
    console.log("----------rowCountArr useEffect executing----------");
    console.log(rowCountArr);
    console.log(colCountArr);
    let tempStr = "";
    setBingoStr((prev) => "");
    for (let i = 0; i < 5; i++) {
      if (rowCountArr[i] == 5) addLetterToBINGOStr();
    }
    for (let i = 0; i < 5; i++) {
      if (colCountArr[i] == 5) addLetterToBINGOStr();
    }
    console.log("diag1COunt:  " + diag1Count);
    console.log("diag2COunt:  " + diag2Count);
    if (diag1Count == 5) addLetterToBINGOStr();
    if (diag2Count == 5) addLetterToBINGOStr();
    console.log("----------------------------");
  }, [rowCountArr, colCountArr, diag1Count, diag2Count]);

  const findIndexesOfNum = (num) => {
    console.log("-----------findIndexOfNum function called---------------");
    console.log("Number to find index : " + num);
    console.log("numbersArr : " + numbersArr);
    let ind = numbersArr.findIndex((ele) => ele == num);
    console.log("index is : " + ind);

    let rowInd =
      (ind + 1) % 5 == 0
        ? Math.floor((ind + 1) / 5) - 1
        : Math.floor((ind + 1) / 5);
    let colInd = (ind + 1) % 5 == 0 ? 4 : ind % 5;
    console.log("rowind,colind : ", rowInd, colInd);

    console.log("--------------------------");
    return { rowInd, colInd };
  };

  const checkBINGO = (data) => {
    console.log("--------checkBINGO function called-------------");
    console.log("clicked number is " + data["num"]);
    let { rowInd, colInd } = findIndexesOfNum(data["num"]);

    let tempRowCount = [...rowCountArr];
    tempRowCount[rowInd] += 1;
    setRowCountArr((prev) => {
      console.log(prev);
      const temp = [...prev];
      temp[rowInd] = temp[rowInd] + 1;
      return temp;
    });
    console.log(tempRowCount);

    let tempColCount = [...colCountArr];
    tempColCount[colInd] += 1;

    console.log(tempColCount);
    setColCountArr((prev) => {
      console.log(prev);
      const temp = [...prev];
      temp[colInd] = temp[colInd] + 1;
      return temp;
    });
    if (rowInd == colInd) setDiag1Count((count) => count + 1);
    if (rowInd + colInd == 4) setDiag2Count((count) => count + 1);

    console.log("---------------");
  };
  const won = (name) => {
    console.log("-----------won function----------");
    console.log("you won");
    socket.emit("won", { name: name, socketid: socketid }, room);
    console.log("------------------");
    setIsBINGOClicked(true);
  };
  useEffect(() => {
    console.log(location.state);
    setLoading(true);

    console.log("numbersArr initially = " + numbersArr);
    makeArrayRandom();

    console.log("numbersArr initially = " + numbersArr);

    setLoading(false);
    socket.on("getmysocketDetail", (socketid) => {
      setSocketid(socketid);
    });

    socket.on("play", () => {
      console.log("It is your turn");
      setIsMyTurn(true);
    });

    socket.on("restartclicked", () => {
      // window.location.reload();
      setBingoStr("");
      setRowCountArr(Array(5).fill(0));
      setColCountArr(Array(5).fill(0));
      setDiag1Count(0);
      setDiag2Count(0);
      makeArrayRandom();
      setIsBINGOClicked(false);
      setIsBINGOEnabled(false);
      setWinner(null);
      setCurrentClickedNum(null);

      setIsStarted(false);
    });
    socket.on("started", () => {
      setIsStarted(true);
      // getAllPlayers();
      setLoading(false);
    });
    socket.on("new_player", () => {
      setHaveNewPlayer((val) => val + 1);
      // getAllPlayers();
    });
    socket.on("leave", () => {
      setLeftOnePlayer((val) => val + 1);
      // getAllPlayers();
    });
    socket.on("lost", (winnerData) => {
      console.log(
        "----------------lost ------\n" + winnerData + " won\n----------------"
      );
      if (winner == null) setWinner(winnerData);
    });
    socket.on("datareset", () => {
      setIsStarted(true);
      makeArrayRandom();
    });
  }, []);
  useEffect(() => {
    if (winner != null) {
      setShowModal(true);
    }
  }, [winner]);

  useEffect(() => {
    if (bingoStr == "BINGO") {
      setIsBINGOEnabled(true);
      console.log(isBINGOClicked);
      console.log(isBINGOEnabled);
      console.log(winner);
      // won("rin");
      // setShowModal(true);
    }
  }, [bingoStr]);
  useEffect(() => {});
  useEffect(() => {
    if (players.length >= 0) {
      getAllPlayers();
    }
  }, [haveNewPlayer, isStartEnabled, leftOnePlayer]);
  useEffect(() => {
    function handleFunc(data) {
      if (numbersArr[0] != 0) {
        console.log("play play");
        setCurrentClickedNum(data["num"]);
        checkBINGO(data);
      }
    }

    socket.on("playednum", handleFunc);
    return () => socket.off("playednum", handleFunc);
  }, [isStarted, numbersArr]);
  const startGame = () => {
    setLoading(false);
    console.log("room is ", room);
    socket.emit("start_game", room);

    setIsStarted(true);
  };
  const restartGame = () => {
    socket.emit("restart", room);
  };

  const getAllPlayers = async () => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/allplayers?roomName=${room}`)
      .then((res) => res.json())
      .then(async (data) => {
        console.log(room);
        await setPlayers(data);
        console.log(data);
      });
  };
  const onClickCustom = () => {
    setCustomOrderIndex(0);
    setNumbersArr(Array(25).fill(0));
    setOrderedNumbers(orderedArr);
    setNumbersOrder("custom");
  };
  const onClickNumberTile = (num) => {
    let tempArr = [...numbersArr];
    tempArr[customOrderIndex] = num;
    setCustomOrderIndex(customOrderIndex + 1);
    setNumbersArr(tempArr);
    let tempArr2 = [...orderedNumbers];
    tempArr2 = tempArr2.filter((ele) => ele != num);
    setOrderedNumbers(tempArr2);
    console.log(numbersArr);
  };
  return (
    // <ClickedRowCountContext.Provider value={{ rowCountArr, setRowCountArr }}>
    <div className=" w-screen flex justify-items-center flex-col">
      <div className="font-kanit text-4xl font-semibold text-center my-2 heading1">
        BINGO
      </div>

      {showModal && (
        <div className="w-dvw h-svh fixed bg-opacity-30  bg-black flex justify-center items-center">
          <div className="w-48 h-40 bg-white rounded-sm text-blue-950 font-kanit p-2">
            <div
              className="font-bold text-end"
              onClick={() => setShowModal(false)}
            >
              x
            </div>
            <div className="flex justify-center items-center">
              You{" "}
              {isBINGOClicked && winner != null && winner.socketid == socketid
                ? "Won!!!"
                : "Lost :("}
            </div>
            {winner != null && winner.socketid != socketid && (
              <div className="flex justify-center items-center">
                {winner.name + " Won"}
              </div>
            )}
          </div>
        </div>
      )}
      <div className="text-center my-2 text-red-500 font-thin font-kanit text-xl">
        {isMyTurn ? "Your Turn" : ""}
      </div>

      {!loading && (
        <div className="flex justify-around flex-wrap gap-2 my-4 justify-items-center">
          <div className="flex-col col-span-2">
            <div>
              {arr.map((_, i) => {
                return (
                  <div
                    className="  border-solid border border-black flex flex-row max-w-min"
                    style={{ backgroundColor: "white" }}
                  >
                    <BingoRow
                      rowInd={i}
                      numbersArr={numbersArr}
                      isClicked={false}
                      isMyTurn={isMyTurn}
                      setIsMyTurn={setIsMyTurn}
                      room={room}
                      socketid={socketid}
                      isStarted={isStarted}
                      currentClickedNum={currentClickedNum}
                      setCurrentClickedNum={setCurrentClickedNum}
                    />
                  </div>
                );
              })}
            </div>
            {!isStarted && (
              <button
                className="
              bg-orange-500
              text-white
            my-2
              h-min
              p-2
              rounded-sm
              font-kanit
              font-normal
              self-center
              hover:bg-orange-300
              col-span-1"
                onClick={
                  numbersOrder == "random" ? onClickCustom : makeArrayRandom
                }
              >
                {numbersOrder == "random"
                  ? "Use Custom Numbers"
                  : "Use random Numbers"}
              </button>
            )}
            <div className="flex flex-row flex-wrap flex-shrink col-span-2 max-w-60">
              {orderedNumbers != null &&
                numbersOrder == "custom" &&
                orderedNumbers.map((ele, ind) => {
                  return (
                    <div
                      className="p-2 border-orange-300 border-solid border w-10  mx-1"
                      onClick={() => onClickNumberTile(ele)}
                    >
                      {ele}
                    </div>
                  );
                })}
            </div>
          </div>
          {!isStarted ? (
            <button
              className="bg-orange-500 text-white w-min h-min p-2 rounded-sm font-kanit font-normal self-center hover:bg-orange-300 col-span-1"
              onClick={startGame}
            >
              START
            </button>
          ) : (
            <button
              className="bg-orange-500 text-white w-min h-min p-2 rounded-sm font-kanit font-normal self-center hover:bg-orange-300 col-span-1"
              onClick={restartGame}
            >
              RESTART
            </button>
          )}
          <div className="col-span-2 font-kanit ">
            <div className="text-blue-950 text-xl">Players</div>
            <ol className="text-base list-decimal ml-4">
              {players.map((ele) => {
                return <li>{ele.name}</li>;
              })}
            </ol>
          </div>
        </div>
      )}

      {/* <div
        className="text-center text-black-600 flex justify-center w-screen text-lg my-2"
        mx-2
      >
        <div>
          <div className="grid grid-cols-3 grid-rows-2 gap-2">
            <label className="col-span-1">Name: </label>
            {!isStartEnabled ? (
              <input
                type="text"
                name="name"
                value={name}
                onChange={(e) => {
                  e.preventDefault();
                  setName(e.target.value);
                }}
                className=" col-span-2 g-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
            ) : (
              <div className="col-span-2 text-base">{name}</div>
            )}
            <label className="col-span-1 text-base">Room:</label>
            {!isStartEnabled ? (
              <input
                type="text"
                name="room"
                value={room}
                onChange={(e) => {
                  e.preventDefault();
                  setRoom(e.target.value);
                }}
                className=" col-span-2 g-gray-50 text-base border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
            ) : (
              <div className="col-span-2 text-base">{room}</div>
            )}
          </div>
          {!isStartEnabled && (
            <button
              className=" text-base bg-orange-500 my-2 text-white w-auto h-min p-2 rounded-sm font-kanit font-normal self-center hover:bg-orange-300 col-span-1"
              onClick={() => joinRoom(name, room)}
            >
              Join room
            </button>
          )}
        </div>
      </div> */}
      <div
        className="text-center text-black-600 flex justify-center w-screen text-lg my-2"
        mx-2
      >
        <div>
          <div className="grid grid-cols-3 grid-rows-2 gap-2">
            <label className="col-span-1">Name: </label>

            <div className="col-span-2 text-base">
              {location.state.username}
            </div>

            <label className="col-span-1 text-base">Room:</label>

            <div className="col-span-2 text-base">
              {location.state.roomName}
            </div>
          </div>
        </div>
      </div>

      {bingoStr != "" && (
        <div className="text-center text-green-600 flex justify-center w-full text-xl my-2">
          You are now <div className="text-red-700 mx-2">{bingoStr}</div>
        </div>
      )}
      <div className="text-center text-green-600 flex justify-center w-full text-xl my-2">
        {isBINGOEnabled && !isBINGOClicked && winner == null && (
          <button
            className="bg-orange-500 text-white w-auto h-min p-2 rounded-sm font-kanit font-normal self-center hover:bg-orange-300 col-span-1"
            onClick={() => won(name)}
          >
            I got BINGO
          </button>
        )}
      </div>
      <div>{/* {rowCountArr}-{colCountArr} */}</div>
    </div>
    // </ClickedRowCountContext.Provider>
  );
};
export default BingoSquares;
