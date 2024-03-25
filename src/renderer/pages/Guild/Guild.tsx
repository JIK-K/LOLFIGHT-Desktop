import React, { useEffect, useState } from "react";
import "./Guild.scss";
import useMemberStore from "../../../common/zustand/member.zustand";
const Guild = () => {
  const [message, setMessage] = useState<string>("");
  const { member } = useMemberStore();
  const sendMessage = () => {
    console.log("message", message);
    setMessage("");
  };

  const handleInputMessage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      console.log("Enter Message", message);
      setMessage("");
    }
  };

  return (
    <div className="guild-page">
      <div className="guild-talk">
        <div className="component-title">길드톡방</div>
        <div className="message-area">여백의미</div>
        <div className="input-area">
          <img
            src="http://localhost:3000/public/emoticon.png"
            alt="emoticon"
            height={20}
            color="white"
          />
          <input
            className="message-input"
            type="text"
            placeholder="메세지보내기"
            value={message}
            onChange={handleInputMessage}
            onKeyDown={handleKeyPress}
          />
          <button type="button" className="send-button" onClick={sendMessage}>
            <img
              src="http://localhost:3000/public/send.png"
              alt="emoticon"
              height={20}
              color="white"
            />
          </button>
        </div>
      </div>

      <div className="guild-info">
        <div className="guild-banner">
          <div style={{ fontSize: "18px" }}>길드 랭크</div>
          <div className="guild-data">
            <img
              src={`http://localhost:3000/public/rank/CHALLENGER.png`}
              width={70}
              height={70}
            />
            <div className="guild-score">
              <div className="guild-tier">
                <p>더미 V</p>
                <p>더미LP</p>
              </div>
              <progress id="progress" value={10} max="100"></progress>
            </div>
          </div>
        </div>
        <div className="guild-member">
          <div className="component-title">길드원</div>
          <div className="member-list">ya</div>
        </div>
      </div>
      <div className="guild-desc">
        <img
          src={`http://localhost:3000/${member.memberGuild.guildIcon}`}
          width={200}
          height={200}
          style={{ border: "1px solid #616366", marginBottom: "20px" }}
        />
        <div>{member.memberGuild.guildName}</div>
        <div>길드마스터 : {member.memberGuild.guildMaster}</div>
        <div>길드원 수 : {member.memberGuild.guildMembers}</div>
        <div>
          길드 설립일 : {member.memberGuild.createdAt.toString().split("T")[0]}
        </div>
      </div>
    </div>
  );
};

export default Guild;
