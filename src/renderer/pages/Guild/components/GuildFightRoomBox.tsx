import React from "react";
import "./GuildFightRoomBox.scss";
const GuildFightRoomBox = () => {
  const status: string = "대기중";

  const getStatusColor = () => {
    if (status === "게임중") {
      return "red";
    } else if (status === "대기중") {
      return "green";
    } else {
      return "black";
    }
  };

  return (
    <div className="fight-box">
      <div className="match-leader">일이삼사오육칠팔구십일이삼사 의방</div>
      <div className="players-count">1/5</div>
      <div className="match-status" style={{ color: getStatusColor() }}>
        {status}
      </div>
    </div>
  );
};
export default GuildFightRoomBox;
