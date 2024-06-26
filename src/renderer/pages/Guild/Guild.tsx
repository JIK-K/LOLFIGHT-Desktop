import React, { useEffect, useRef, useState } from "react";
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
  const [isComposing, setIsComposing] = useState(false);
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

  const handleComposition = (e: React.CompositionEvent<HTMLInputElement>) => {
    if (e.type === "compositionstart") {
      setIsComposing(true);
    }
    if (e.type === "compositionend") {
      setIsComposing(false);
    }
  };
  const handleInputMessage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !isComposing) {
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
    <>
      {member.memberGuild ? (
        <div className="max-w-3xl mx-auto grid gap-8">
          <div className="flex gap-8">
            <div className="bg-gray-800 border border-gray-700 rounded-lg flex-1">
              <div className="flex items-center justify-between mb-4 border-b border-gray-700">
                <h2 className="text-lg font-bold text-gray-200 p-6">
                  길드톡방
                </h2>
              </div>

              <div className="h-[500px] overflow-y-auto">
                <div className="" ref={messageAreaRef}>
                  {receivedMessages.map((receivedMessage, index) => (
                    <div key={index}>{receivedMessage}</div>
                  ))}
                </div>
              </div>
              <div className="mt-4 p-6">
                {/* <img
                    src={`${process.env.SERVER_URL}/public/emoticon.png`}
                    alt="emoticon"
                    color="white"
                  /> */}
                <input
                  className="rounded-lg bg-gray-900 p-2"
                  type="text"
                  placeholder="메세지보내기"
                  value={message}
                  onChange={handleInputMessage}
                  onKeyDown={handleKeyPress}
                  onCompositionStart={handleComposition}
                  onCompositionUpdate={handleComposition}
                  onCompositionEnd={handleComposition}
                />
                <button
                  type="button"
                  className="send-button"
                  onClick={sendMessage}
                >
                  {/* <img
                      src={`${process.env.SERVER_URL}/public/send.png`}
                      alt="emoticon"
                      color="white"
                    /> */}
                </button>
              </div>
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-lg flex-1">
              <div className="flex items-center justify-between mb-4 border-b border-gray-700">
                <h2 className="text-lg font-bold text-gray-200 p-6">길드원</h2>
              </div>
              <div className="flex flex-col p-3 overflow-y-auto gap-5 text-normal">
                {guildMembers.map((member) => (
                  <GuildMemberBox
                    key={member.id}
                    member={member}
                    online={onlineMembers}
                  />
                ))}
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
              <div className="border border-gray-700 rounded-lg flex-1 m-4">
                {/* <div style={{ fontSize: "18px" }}>길드 랭크</div> */}
                <div className="flex flex-col items-center justify-between py-2 mb-4">
                  <img
                    src={`${process.env.SERVER_URL}/public/rank/${guild.guildTier}.png`}
                    width={70}
                    height={70}
                  />
                  <div className="">
                    <div className="">
                      <p>{guild.guildTier}</p>
                    </div>
                    {/* <progress id="progress" value={10} max="100">
                  승률
                </progress> */}
                  </div>
                  <div>
                    <p>{guild.guildRecord.recordLadder}LP</p>
                  </div>
                </div>
              </div>
              <button
                className="border bg-blue-950 border-gray-700 rounded-lg flex-1 p-6 m-4 hover:bg-blue-900"
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
        <div>길갑해라</div>
      )}
    </>
  );
};

export default Guild;
