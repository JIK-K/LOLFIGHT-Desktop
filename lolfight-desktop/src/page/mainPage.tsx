"use client";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createWebSocketConnection } from "league-connect";

import axios from "axios";
import HasagiClient from "@hasagi/core";

const MainPage = () => {
  const navigate = useNavigate();
  const [memberName, setMemberName] = useState("");
  const backpage = async () => {
    // navigate("/");
    const storedMemberName = sessionStorage.getItem("memberName");
    setMemberName(storedMemberName!);
    // Client.request({ method: "patch", url: "/lol-champ-select/v1/session/my-selection", data: { spell1Id, spell2Id } }).catch(() => { });
    const client = new HasagiClient();
    await client.connect();
    const response = await client.request({
      method: "get",
      url: "/lol-summoner/v1/current-summoner",
    });

    console.log(response);
  };

  return (
    <div>
      {memberName}
      <button className="bg-yellow-500 p-5" onClick={backpage}>
        클라연결
      </button>
      <textarea className="border">{memberName}</textarea>
    </div>
  );
};

export default MainPage;
