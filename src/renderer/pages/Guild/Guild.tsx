import React, { useEffect, useRef, useState } from "react";
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
import GuildFightRoomBox from "./components/GuildFightRoomBox";
import toast from "react-hot-toast";
import { MatchMembersDTO } from "../../../common/DTOs/room/matchMembers.dto";
import { WaitingRoomDTO } from "../../../common/DTOs/room/waitingRoom.dto";

const Guild: React.FC = () => {
  const navigate = useNavigate();
  const { member, setMember } = useMemberStore();
  const { guild, setGuild } = useGuildStore();
  const { socket } = useSocketStore();
  const [message, setMessage] = useState<string>("");
  const [guildMembers, setGuildMembers] = useState<MemberDTO[]>([]);
  const [receivedMessages, setReceivedMessages] = useState<string[]>([]);
  const [onlineMembers, setOnlineMembers] = useState<string[]>([]);
  const [guildRooms, setGuildRooms] = useState<WaitingRoomDTO[]>([]);
  const messageAreaRef = useRef(null);

  useEffect(() => {
    if (!member.memberGuild) {
      toast.error("속한 길드가 없습니다.");
      navigate("/home");
      return;
    }

    getGuildMemberList(member.memberGuild.guildName).then((response) => {
      setGuildMembers(response.data.data);
    });

    socket.on("message", (receivedMessage: string) => {
      setReceivedMessages((prevMessages) => [...prevMessages, receivedMessage]);
    });

    socket.on("online", (onlineMembers: string[]) => {
      console.log("Online members:", onlineMembers);
      setOnlineMembers(onlineMembers);
    });

    socket.on("roomList", (guildRoomList: WaitingRoomDTO[]) => {
      console.log("RoomList", guildRoomList);
      setGuildRooms(guildRoomList);
    });

    socket.emit("online", { guildName: member.memberGuild.guildName });
    socket.emit("roomList", { guildName: member.memberGuild.guildName });

    // 컴포넌트가 언마운트될 때 이벤트 리스너 제거
    return () => {
      socket.off("createRoom");
      socket.off("message");
      socket.off("online");
      socket.off("roomList");
    };
  }, []);

  useEffect(() => {
    if (messageAreaRef.current) {
      messageAreaRef.current.scrollTop = messageAreaRef.current.scrollHeight;
    }
  }, [receivedMessages]);

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

  const createBattleRoom = () => {
    const matchMember: MatchMembersDTO = {
      member: member,
      isLeader: false,
    };
    if (matchMember.member.memberGame !== null || undefined) {
      socket.emit("createRoom", {
        members: matchMember,
        roomName: member.memberName,
        memberCount: 1,
        isReady: false,
        status: "대기중",
      });
      navigate("/fightroom");
    } else {
      toast.error("롤 계정이 등록되어있는 유저만 입장 가능합니다.");
    }
  };

  return (
    <div>
      {member.memberGuild !== null ? (
        <div className="guild-page">
          <div className="guild-top">
            <div className="guild-talk">
              <div className="component-title">길드톡방</div>
              <div className="message-area" ref={messageAreaRef}>
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
                <button
                  type="button"
                  className="send-button"
                  onClick={sendMessage}
                >
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
                    {/* <progress id="progress" value={10} max="100">
                  승률
                </progress> */}
                  </div>
                </div>
              </div>
              <div className="guild-member">
                <div className="component-title">길드원</div>
                <div className="member-list">
                  {guildMembers.map((member) => (
                    <GuildMemberBox
                      key={member.id}
                      member={member}
                      online={onlineMembers}
                    />
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
                길드 설립일 :{" "}
                {member.memberGuild.createdAt.toString().split("T")[0]}
              </div>
              <button
                className="create-battle-button"
                onClick={createBattleRoom}
              >
                길드전 내전방 생성하기
              </button>
            </div>
          </div>

          <div className="guild-bottom">
            <div className="guild-fight-room">
              <div className="component-title">길드전 방 목록</div>
              <div className="fight-room-list">
                {guildRooms.map((room, index) => (
                  <GuildFightRoomBox key={index} roomData={room} />
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div> </div>
      )}
    </div>
  );
};

export default Guild;
