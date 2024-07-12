import React, { useEffect, useRef, useState } from "react";
import useMemberStore from "../../../common/zustand/member.zustand";
import useSocketStore from "../../../common/zustand/socket.zustand";
import useGuildStore from "../../../common/zustand/guild.zustand";
import { findMember, leaveMember } from "../../../api/member.api";
import { MemberDTO } from "../../../common/DTOs/member/member.dto";
import { GuildDTO } from "../../../common/DTOs/guild/guild.dto";
import {
  getGuildList,
  getGuildMemberList,
  getInviteGuildList,
} from "../../../api/guild.api";
import GuildMemberBox from "./components/GuildMemberBox";
import { useNavigate } from "react-router-dom";
import GuildFightRoomBox from "./components/GuildFightRoomBox";
import toast from "react-hot-toast";
import { MatchMembersDTO } from "../../../common/DTOs/room/matchMembers.dto";
import { WaitingRoomDTO } from "../../../common/DTOs/room/waitingRoom.dto";
import { GuildInviteDTO } from "../../../common/DTOs/guild/guild_invite.dto";
import GuildListBox from "./components/GuildListBox";
import GuildApplicant from "./components/GuildApplicant";
import ButtonAlert from "../../../common/components/alert/ButtonAlert";

const Guild: React.FC = () => {
  const navigate = useNavigate();
  const { member, setMember } = useMemberStore();
  const { guild, setGuild } = useGuildStore();
  const [guildList, setGuildList] = useState<GuildDTO[]>();
  const { socket } = useSocketStore();
  const [message, setMessage] = useState<string>("");
  const [isComposing, setIsComposing] = useState(false);
  const [guildMembers, setGuildMembers] = useState<MemberDTO[]>([]);
  const [receivedMessages, setReceivedMessages] = useState<string[]>([]);
  const [onlineMembers, setOnlineMembers] = useState<string[]>([]);
  const [guildRooms, setGuildRooms] = useState<WaitingRoomDTO[]>([]);
  const messageAreaRef = useRef(null);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteMembers, setInviteMembers] = useState<GuildInviteDTO[]>([]);

  useEffect(() => {
    if (!member.memberGuild) {
      getGuildList()
        .then((response) => {
          console.log(response);
          setGuildList(response.data.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }

    if (member.memberGuild) {
      getGuildMemberList(member.memberGuild.guildName).then((response) => {
        setGuildMembers(response.data.data);
      });

      if (member.memberName === member.memberGuild.guildMaster) {
        getInviteGuildList(member.memberGuild.guildName)
          .then((response) => {
            console.log(response);
            setInviteMembers(response.data.data);
          })
          .catch((error) => {
            console.log(error);
          });
      }

      socket.on("message", (receivedMessage: string) => {
        setReceivedMessages((prevMessages) => [
          ...prevMessages,
          receivedMessage,
        ]);
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
    }
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
    if (e.key === "Enter" && !isComposing && message.length > 0) {
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

  const viewInviteGuild = () => {
    setInviteOpen(!inviteOpen);
  };

  const leaveGuild = () => {
    const onConfirmLeave = () => {
      leaveMember(member.memberId).then((response) => {
        console.log(response);
        toast.success("길드 탈퇴를 완료 하였습니다.");
        navigate("/home");
        window.location.reload();
      });
    };
    ButtonAlert(
      "길드 탈퇴",
      "길드를 탈퇴 하시겠습니까?",
      "탈퇴",
      onConfirmLeave
    );
  };

  return (
    <>
      {member.memberGuild ? (
        <div className="max-w-3xl mx-auto grid gap-8 px-4 md:px-6 py-8 md:py-12">
          <div className="grid md:grid-cols-[150px_1fr] gap-6">
            <img
              src={`${process.env.SERVER_URL}/${member.memberGuild.guildIcon}`}
              width={128}
              height={128}
              style={{ border: "1px solid #616366", marginBottom: "20px" }}
            />
            <div className="grid">
              <div className="text-2xl font-bold text-gray-200">
                {member.memberGuild.guildName}
              </div>
              <div className="flex gap-2 justify-between">
                <div className="w-1/2 flex flex-col gap-2 text-sm text-gray-400">
                  <div>길드마스터 : {member.memberGuild.guildMaster}</div>
                  <div>길드원 수 : {member.memberGuild.guildMembers}</div>
                  <div>
                    길드 설립일 :
                    {member.memberGuild.createdAt.toString().split("T")[0]}
                  </div>
                  {member.memberGuild.guildMaster === member.memberName && (
                    <div className="relative w-[65px]">
                      <button onClick={viewInviteGuild}>가입신청자</button>
                      {inviteMembers.length > 0 && (
                        <div className="w-[8px] h-[8px] bg-red-500 absolute top-0 right-0 rounded-full transform translate-x-1/2 -translate-y-1/2" />
                      )}
                      {inviteOpen && (
                        <GuildApplicant inviteMembers={inviteMembers} />
                      )}
                    </div>
                  )}
                  {member.memberGuild.guildMaster !== member.memberName && (
                    <div className="flex w-[65px] justify-center rounded shadow-lg shadow-gray-800 shadow-inner">
                      <button className="w-full py-1 px-2" onClick={leaveGuild}>
                        길드탈퇴
                      </button>
                    </div>
                  )}
                </div>
                {/* guild rank */}
                <div className="w-1/2 flex items-center gap-2 text-sm text-gray-400">
                  <div className="">
                    <div>길드 랭크</div>
                    <div className="flex">
                      <img
                        src={`${process.env.SERVER_URL}/public/rank/${guild.guildTier}.png`}
                        width={80}
                        height={80}
                      />
                      <div className="items-center m-auto">
                        <span>{guild.guildTier}</span>
                        <span>&nbsp;{guild.guildRecord.recordLadder}LP</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400"></div>
            </div>
          </div>

          {/* 길드 채팅방 */}
          <div className="guild-top grid md:grid-cols-[200px_1fr]">
            <div className="bg-gray-800 border border-gray-700 rounded-l-lg flex-1">
              {/* <div className="flex items-center justify-between mb-4 border-b border-gray-700">
                <h2 className="text-lg font-bold text-gray-200 p-6">
                  길드원
                </h2>
              </div> */}
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
            <div className="bg-gray-800 border border-gray-700 rounded-r-lg flex-1">
              <div className="flex items-center justify-between mb-4 border-b border-gray-700">
                <h2 className="text-gray-200 p-2">길드 채팅방</h2>
              </div>

              <div className="h-[300px] overflow-y-auto">
                <div className="" ref={messageAreaRef}>
                  {receivedMessages.map((receivedMessage, index) => (
                    <div className="ml-2 font-light" key={index}>
                      {receivedMessage}
                    </div>
                  ))}
                </div>
              </div>
              <div className="w-full mt-4">
                {/* <img
                    src={`${process.env.SERVER_URL}/public/emoticon.png`}
                    alt="emoticon"
                    color="white"
                  /> */}
                <input
                  className="rounded-br-lg bg-gray-900 p-2 w-full"
                  type="text"
                  placeholder="메세지보내기"
                  value={message}
                  onChange={handleInputMessage}
                  onKeyDown={handleKeyPress}
                  onCompositionStart={handleComposition}
                  onCompositionUpdate={handleComposition}
                  onCompositionEnd={handleComposition}
                />
                {/* <button
                  type="button"
                  className="send-button"
                  onClick={sendMessage}
                >
                  <img
                      src={`${process.env.SERVER_URL}/public/send.png`}
                      alt="emoticon"
                      color="white"
                    />
                </button> */}
              </div>
            </div>
          </div>
          <div className="guild-bottom bg-gray-800 border-gray-700 border rounded">
            <div className="guild-fight-room">
              <div className="flex border-b border-gray-700 justify-between text-center items-center">
                <span className="ml-4">길드전 방 목록</span>
                <button
                  className="border bg-blue-950 border-gray-700 rounded-lg m-2 p-2 hover:bg-blue-900"
                  onClick={createBattleRoom}
                >
                  <span className="text-sm">길드전 내전방 생성</span>
                </button>
              </div>

              <div className="fight-room-list bg-gray-900 hover:bg-gray-800">
                {guildRooms.map((room, index) => (
                  <GuildFightRoomBox key={index} roomData={room} />
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-3xl mx-auto gap-8 px-4 py-8 md:py-12">
          <div className="flex flex-col rounded-lg bg-gradient-to-l from-gray-950 via-gray-800 to-gray-950">
            <div className="flex w-full space-y-1.5 p-6 px-6 py-4">
              길드 리스트
            </div>
            <div className="flex w-full h-full items-center px-4 py-1 gap-1 border-y border-gray-800">
              <div className="w-[200px] text-center">길드명</div>
              <div className="w-[130px] text-center">래더</div>
              <div className="w-[70px] text-center">길드원</div>
              <div className="w-[100px] text-center">길드장</div>
            </div>
            <GuildListBox guild={guildList} />
          </div>
        </div>
      )}
    </>
  );
};

export default Guild;
