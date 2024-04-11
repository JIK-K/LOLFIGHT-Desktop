import React from "react";
import "./Battle.scss";

const Battle: React.FC = () => {
  return (
    <div className="battle-page">
      <div className="one">
        <div className="two">
          <img
            src={`${process.env.SERVER_URL}/public/다리우스.png`}
            alt="close"
          />
        </div>
        <div className="three">공식리그</div>
        <div className="four">
          <span>공식 클랜전</span>
          <span>계속한다</span>
          <span>1.7k</span>
          <button>참여하기</button>
        </div>
      </div>
    </div>
  );
};

export default Battle;
