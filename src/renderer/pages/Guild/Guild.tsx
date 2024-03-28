import React, { useEffect, useState } from "react";
import "./Guild.scss";
import useMemberStore from "../../../common/zustand/member.zustand";
import useSocketStore from "../../../common/zustand/socket.zustand";
import useGuildStore from "../../../common/zustand/guild.zustand";
import { findMember } from "../../../api/member.api";
import { MemberDTO } from "../../../common/DTOs/member/member.dto";
import { GuildDTO } from "../../../common/DTOs/guild/guild.dto";
import { getGuildMemberList } from "../../../api/guild.api";
import GuildMemberBox from "./components/GuildMemberBox";
import { useNavigate } from "react-router-dom";

const Guild: React.FC = () => {
  const navigate = useNavigate();
  const { member, setMember } = useMemberStore();
  const { guild, setGuild } = useGuildStore();
  const { socket } = useSocketStore();
  const [message, setMessage] = useState<string>("");
  const [guildMembers, setGuildMembers] = useState<MemberDTO[]>([]);
  const [receivedMessages, setReceivedMessages] = useState<string[]>([]);

  useEffect(() => {
    if (!member.memberGuild) {
      navigate("/home");
      return; // return을 사용하여 이후의 코드 실행을 막음
    }

    getGuildMemberList(member.memberGuild.guildName).then((response) => {
      setGuildMembers(response.data.data);
    });

    socket.on("message", (receivedMessage: string) => {
      setReceivedMessages((prevMessages) => [...prevMessages, receivedMessage]);
    });

    // 컴포넌트가 언마운트될 때 이벤트 리스너 제거
    return () => {
      socket.off("message");
    };
  }, []);

  const calNextGuildRank = () => {
    // 1200브
    // 1600실
    // 1800골
    // 2000플
    // 2200다
    // 2450마
    // 2750그마
    // 3000++ 챌
    console.log("히이잉 나중에해야지~");
  };
  const sendMessage = () => {
    socket.emit("message", {
      memberName: member.memberName,
      guildName: member.memberGuild.guildName,
      message: message,
    });
    setMessage("");
  };

  const handleInputMessage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      socket.emit("message", {
        memberName: member.memberName,
        guildName: member.memberGuild.guildName,
        message: message,
      });
      setMessage("");
    }
  };

  return (
    <div className="guild-page">
      <div className="guild-talk">
        <div className="component-title">길드톡방</div>
        <div className="message-area">
          {receivedMessages.map((receivedMessage, index) => (
            <div key={index}>{receivedMessage}</div>
          ))}
        </div>
        <div className="input-area">
          <img
            src={`${process.env.SERVER_URL}/public/emoticon.png`}
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
              src={`${process.env.SERVER_URL}/public/send.png`}
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
              src={`${process.env.SERVER_URL}/public/rank/${guild.guildTier}.png`}
              width={70}
              height={70}
            />
            <div className="guild-score">
              <div className="guild-tier">
                <p>{guild.guildTier}</p>
                <p>{guild.guildRecord.recordLadder}LP</p>
              </div>
              <progress id="progress" value={10} max="100">
                승률
              </progress>
            </div>
          </div>
        </div>
        <div className="guild-member">
          <div className="component-title">길드원</div>
          <div className="member-list">
            {guildMembers.map((member) => (
              <GuildMemberBox key={member.id} member={member} />
            ))}
          </div>
        </div>
      </div>
      <div className="guild-desc">
        <img
          src={`${process.env.SERVER_URL}/${member.memberGuild.guildIcon}`}
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
