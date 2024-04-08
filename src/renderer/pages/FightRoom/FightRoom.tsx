import React, { useEffect } from "react";
import "./FightRoom.scss";
import { useNavigate } from "react-router-dom";
const FightRoom = () => {
  const navigate = useNavigate();
  const leaveFightRoom = () => {
    navigate("/guild");
  };
  return (
    <div className="fight-room">
      방이다방 여기 네모나게하나하고 옆에 방 5vs5 소환사의협곡 밑에 사진넣고
      왼쪽밑에 준비버튼 그 아래 다음상대찾기버튼 바닥 중앙에는 채팅 tab형식으로
      길드채팅할수있고 그 방끼리 채팅할수있는걸로
      <button onClick={leaveFightRoom}>탈주닌자카카시</button>
    </div>
  );
};

export default FightRoom;
