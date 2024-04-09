import React from "react";
import "./BattleMemberBox.scss";
const BattleMemberBox = () => {
  return (
    <div className="battle-member-container">
      <div className="member-guild-icon">
        <img
          src={`${process.env.SERVER_URL}/public/guild/test.png`}
          width={50}
          height={50}
        />
      </div>
      <div className="member-name">신태일</div>
      <div className="member-lol-info">
        <img
          src={`${process.env.SERVER_URL}/public/rank/emerald.png`}
          width={40}
          height={40}
        />
        태양같은사나이#KR1
      </div>
      <div></div>
    </div>
  );
};

export default BattleMemberBox;
