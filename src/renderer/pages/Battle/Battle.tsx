import React, { useEffect } from "react";
import "./Battle.scss";
import { createWebSocketConnection } from "league-connect";
import { recordBattle } from "../../../api/battle.api";
import { request } from "../../../renderer/utils/ipcBridge";

const Battle: React.FC = () => {
  const testPlayMp3 = () => {
    const audio = new Audio(`${process.env.SERVER_URL}/public/sound/test.mp3`);
    audio.volume = 0.2; // 볼륨 조절 (0.0 ~ 1.0)
    audio.play();
  };

  const testMethod = () => {
    const requestBody = [
      {
        // invitationId: "moneyonmymind",
        invitationType: "lobby",
        state: "Requested",
        // timestamp: "yaya",
        toSummonerId: 3192459633403392,
        toSummonerName: "허리가빈약한남자#KR1",
      },
      {
        // invitationId: "moneyonmymind",
        invitationType: "lobby",
        state: "Requested",
        // timestamp: "yaya",
        toSummonerId: 18961665,
        toSummonerName: "태양같은사나이#KR1",
      },
    ];
    request("POST", "/lol-lobby/v2/lobby/invitations", requestBody)
      .then((response: any) => {
        console.log(response);
      })
      .catch((error: any) => {
        console.log(error);
      });
  };

  return (
    <div className="battle-page">
      <div className="one">
        <div className="two">
          <img
            src={`${process.env.SERVER_URL}/public/gameType/HowlingAbyss.png`}
            alt="close"
            width={100}
          />
        </div>
        <div className="three">공식리그</div>
        <div className="four">
          <span>공식 클랜전</span>
          <span>계속한다</span>
          <span>1.7k</span>
          <button onClick={testPlayMp3}>test.mp3 재생하기</button>
          <button onClick={testMethod}>초대test</button>
        </div>
      </div>
    </div>
  );
};

export default Battle;
