import React, { createRef, useContext, useEffect, useState } from "react";
import BingoRow from "./BingoRow";
import "../App.css";
import { SocketContext } from "../contexts/SocketContext";

// const socket = io.connect("http://localhost:3001");

const BingoSquares = () => {
  const [elRefs, setElRefs] = React.useState(
    Array(5).fill(Array(5).fill(null))
  );
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

  const socket = useContext(SocketContext);
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
  useEffect(() => {
    console.log(numbersArr);
  }, [numbersArr, loading]);
  useEffect(() => {
    console.log(loading);
  }, [loading]);
  //   const createRefArray = () => {
  //     let tempArr = [];

  //     for (let i = 0; i < 5; i++) {
  //       tempArr = [];
  //       for (let j = 0; j < 5; j++) {
  //         tempArr.push(createRef());
  //       }
  //       setElRefs([...elRefs, tempArr]);
  //     }

  //     console.log("Reference array is  ");
  //     console.log(elRefs);
  //   };
  const makeArrayRandom = () => {
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
    if (diag1Count == 5) addLetterToBINGOStr();
    if (diag2Count == 5) addLetterToBINGOStr();
    console.log("----------------------------");
  }, [rowCountArr, colCountArr]);

  //   setRowCountArr([9, 9]);
  const findIndexesOfNum = (num) => {
    console.log("-----------findIndexOfNum function called---------------");
    console.log(num);
    console.log(numbersArr);
    let ind = numbersArr.findIndex((ele) => ele == num);
    console.log(ind);
    // let rowInd =
    //   (ind + 1) % 5 == 0
    //     ? Math.floor((ind + 1) / 5) - 1
    //     : Math.floor((ind + 1) / 5);
    // let colInd = (ind + 1) % 5 == 0 ? 4 : (ind + 1) % 5;
    let rowInd =
      (ind + 1) % 5 == 0
        ? Math.floor((ind + 1) / 5) - 1
        : Math.floor((ind + 1) / 5);
    let colInd = (ind + 1) % 5 == 0 ? 4 : ind % 5;
    console.log(rowInd, colInd);
    return { rowInd, colInd };
    console.log("--------------------------");
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
    else if (rowInd + colInd == 4);
    setDiag2Count((count) => count + 1);

    console.log("---------------");
  };
  const won = (name) => {
    console.log("-----------won function----------");
    console.log("you won");
    socket.emit("won", name);
    console.log("------------------");
  };
  useEffect(() => {
    setLoading(true);
    socket.emit("join", "user");

    console.log("numbersArr initially = " + numbersArr);
    makeArrayRandom();

    // createRefArray();
    console.log("numbersArr initially = " + numbersArr);
    // getAllPlayers();
    setLoading(false);

    socket.on("play", () => {
      setIsMyTurn(true);
    });
    socket.on("restart", () => {
      window.location.reload();
    });
    socket.on("started", () => {
      setIsStarted(true);
    });
    socket.on("lost", (winner) => {
      console.log(
        "----------------lost ------\n" + winner + " won\n----------------"
      );
      setShowModal(true);
    });
  }, []);

  useEffect(() => {
    if (bingoStr == "BINGO") {
      won("rin");
      setShowModal(true);
    }
  }, [bingoStr]);
  useEffect(() => {
    if (players.length >= 0) {
      getAllPlayers();
    }
  });
  useEffect(() => {
    if (numbersArr[0] != 0) {
      socket.on("playednum", (data) => {
        console.log("play play");

        checkBINGO(data);

        //   checkBINGO(rowCountArr, data);
      });
    }
  }, [numbersArr]);
  const startGame = () => {
    socket.emit("start_game");
    setIsStarted(true);
  };
  const restartGame = () => {
    socket.emit("restart");
  };

  const getAllPlayers = async () => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/allplayers`)
      .then((res) => res.json())
      .then(async (data) => {
        await setPlayers(data);
        console.log(data);
      });
  };
  return (
    // <ClickedRowCountContext.Provider value={{ rowCountArr, setRowCountArr }}>
    <div className=" w-screen flex justify-items-center flex-col">
      <div className="font-kanit text-4xl font-semibold text-center my-2 heading1">
        BINGO
      </div>

      {showModal && (
        <div className="w-dvw h-svh fixed bg-opacity-30  bg-black flex justify-center items-center">
          <div className="w-48 h-20 bg-white rounded-sm text-blue-950 font-kanit p-2">
            <div
              className="font-bold text-end"
              onClick={() => setShowModal(false)}
            >
              x
            </div>
            <div className="flex justify-center items-center">
              You {bingoStr == "BINGO" ? "Won!!!" : "Lost :("}
            </div>
          </div>
        </div>
      )}
      <div className="text-center my-4 text-red-500 font-thin font-kanit text-xl">
        {isMyTurn ? "Your Turn" : ""}
      </div>

      {!loading && (
        <div className="flex justify-around flex-wrap gap-2 my-4 justify-items-center">
          <div className="flex-col col-span-2">
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
                  />
                </div>
              );
            })}
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

      <div className="text-center text-green-600 flex justify-center w-full text-xl my-2">
        You are now <div className="text-red-700 mx-2">{bingoStr}</div>
      </div>
      <div>{/* {rowCountArr}-{colCountArr} */}</div>
    </div>
    // </ClickedRowCountContext.Provider>
  );
};
export default BingoSquares;
