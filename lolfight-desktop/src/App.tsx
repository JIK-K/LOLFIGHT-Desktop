import React from "react";
import logo from "./logo.svg";
import { Route, Routes } from "react-router-dom";
import "./App.css";

import loginPage from "./page/loginPage";
import mainPage from "./page/mainPage";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" Component={loginPage} />
        <Route path="/main" Component={mainPage} />
      </Routes>
    </div>
  );
}

export default App;
