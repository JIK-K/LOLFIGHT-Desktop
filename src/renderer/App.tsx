import React, { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { NavBar, LcuContext } from "./components";
import {
  Backgrounds,
  Challenges,
  Connect,
  Home,
  Icons,
  Status,
  Rank,
  Settings,
  Room,
} from "./pages";
import { Toaster } from "react-hot-toast";
import LoginPage from "./pages/login/Login";
const App: React.FC = () => {
  return (
    <HashRouter>
      <LcuContext>
        <NavBar />
        <div id="content">
          <Routes>
            {/* <Route path="/" element={<Navigate to="/connect" />} /> */}
            <Route path="/" element={<LoginPage />} />
            <Route path="/connect" element={<Connect />} />
            <Route path="/home" element={<Home />} />
            {/* <Route path="/icons" element={<Icons />} /> */}
            {/* <Route path="/backgrounds" element={<Backgrounds />} /> */}
            <Route path="/status" element={<Status />} />
            {/* <Route path="/challenges" element={<Challenges />} /> */}
            {/* <Route path="/rank" element={<Rank />} /> */}
            <Route path="/settings" element={<Settings />} />
            <Route path="/room" element={<Room />} />
          </Routes>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                backgroundColor: "#222222",
                color: "#f2f2f2",
              },
              iconTheme: {
                primary: "#d86ada",
                secondary: "#f2f2f2",
              },
            }}
          />
        </div>
      </LcuContext>
    </HashRouter>
  );
};

const container = document.getElementById("main");
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
