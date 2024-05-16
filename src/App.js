import "./App.css";
import React, { useState } from "react";
import BingoSquares from "./components/BingoSquares";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import JoinRoom from "./components/JoinRoom";
function App() {
  const [isJoinedRoom, setIsJoinedRoom] = useState(false);

  return (
    <Router>
      <Routes>
        <Route
          path="/join-room"
          element={
            <JoinRoom
              isJoinedRoom={isJoinedRoom}
              setIsJoinedRoom={setIsJoinedRoom}
            />
          }
        ></Route>
        <Route
          path="/"
          element={
            isJoinedRoom ? <BingoSquares /> : <Navigate to="/join-room" />
          }
        ></Route>
      </Routes>
    </Router>
  );
}

export default App;
