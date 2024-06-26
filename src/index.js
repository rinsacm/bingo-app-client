import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import BingoSquares from "./components/BingoSquares";
import { SocketContext, socket } from "./contexts/SocketContext";
import ClickedRowCountContext from "./contexts/ClickedCRowountContext";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <React.StrictMode>
  <SocketContext.Provider value={socket}>
    <App />
  </SocketContext.Provider>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
