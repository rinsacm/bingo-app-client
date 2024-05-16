import React, { useContext, useEffect, useState } from "react";
import { SocketContext } from "../contexts/SocketContext";
import { Navigate, useNavigate } from "react-router-dom";

const JoinRoom = ({ isJoinedRoom, setIsJoinedRoom }) => {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  //   const [isJoinedRoom, setIsJoinedRoom] = useState(false);
  const socket = useContext(SocketContext);
  let navigate = useNavigate();
  const joinRoom = (name, room) => {
    setIsJoinedRoom(true);

    console.log("joining room", room, name);
    socket.emit("join", name, room);
  };
  const navigateToGame = (isStartEnabled) => {
    console.log(isStartEnabled);

    navigate("/", {
      state: {
        isJoinedRoom: isJoinedRoom,
        roomName: room,
        username: name,
      },
      replace: false,
    });
  };
  useEffect(() => {
    if (isJoinedRoom) {
      navigateToGame(isJoinedRoom);
    }
  }, [isJoinedRoom]);
  return (
    <div className="text-center text-black-600 flex justify-center align-middle w-screen h-screen text-lg my-4">
      <div>
        <div className="grid grid-cols-3 grid-rows-2 gap-2">
          <label className="col-span-1">Name: </label>

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

          <label className="col-span-1 text-base">Room:</label>

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
        </div>

        <button
          className=" text-base bg-orange-500 my-2 text-white w-auto h-min p-2 rounded-sm font-kanit font-normal self-center hover:bg-orange-300 col-span-1"
          onClick={() => joinRoom(name, room)}
        >
          Join room
        </button>
      </div>
    </div>
  );
};
export default JoinRoom;
