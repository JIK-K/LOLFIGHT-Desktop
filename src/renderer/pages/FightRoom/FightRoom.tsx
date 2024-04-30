import React, { useEffect, useState } from "react";
import "./FightRoom.scss";
import { useLocation, useNavigate } from "react-router-dom";
import BattleMemberBox from "./components/BattleMemberBox";
import toast from "react-hot-toast";
import useSocketStore from "../../../common/zustand/socket.zustand";
import { MemberDTO } from "../../../common/DTOs/member/member.dto";
import { WaitingRoomDTO } from "../../../common/DTOs/room/waitingRoom.dto";
import useGuildStore from "../../../common/zustand/guild.zustand";
import { MatchMembersDTO } from "../../../common/DTOs/room/matchMembers.dto";
import useMemberStore from "../../../common/zustand/member.zustand";
import { FightingRoomDTO } from "../../../common/DTOs/room/FightingRoom.dto";

const FightRoom = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const data = { ...location.state };
  const { socket } = useSocketStore();
  const { member } = useMemberStore();
  const [currentTab, setCurrentTab] = useState(0);
  const [allMessage, setAllMessage] = useState<string[]>([]);
  const [guildMessage, setGuildMessage] = useState<string[]>([]);
  const [message, setMessage] = useState<string>("");
  const { guild } = useGuildStore();

  const [waitingRoomData, setWaitingRoomData] = useState<WaitingRoomDTO>();
  const [enemyRoomData, setEnemyRoomData] = useState<WaitingRoomDTO>();
  const [fightingRoomData, setFightingRoomData] = useState<FightingRoomDTO>();

  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [isReady, setIsReady] = useState<boolean>(false);

  const tabArr = [
    { name: "전체", content: allMessage },
    { name: "길드", content: guildMessage },
  ];
  const leaveFightRoom = () => {
    console.log(waitingRoomData);
    const matchMember: MatchMembersDTO = {
      member: member,
      isReady: false,
    };
    if (fightingRoomData) {
      console.log(fightingRoomData.fightRoomName);
      socket.emit("searchCancel", {
        roomName: fightingRoomData.fightRoomName,
      });
    }
    socket.emit("leaveRoom", {
      roomName: waitingRoomData.roomName,
      matchMember: matchMember,
    });
    navigate("/guild");
  };

  useEffect(() => {
    socket.on("createRoom", (roomData: WaitingRoomDTO) => {
      console.log("createRoom", roomData);
      setWaitingRoomData(roomData);
    });

    socket.on("joinRoom", (roomData: WaitingRoomDTO) => {
      console.log("joinRoom", roomData);
      setWaitingRoomData(roomData);
    });

    socket.on("leaveRoom", (roomData: WaitingRoomDTO) => {
      console.log("leaveRoom", roomData);
      if (roomData === null) {
        navigate("/guild");
        toast("매치리더가 방을 떠났습니다.", { icon: "💔" });
      } else {
        setWaitingRoomData(roomData);
      }
    });

    socket.on("searchFight", (roomData: FightingRoomDTO) => {
      console.log(roomData);
      setFightingRoomData(roomData);
    });

    socket.on("searchCancel", (data: any) => {
      setEnemyRoomData(null);
      setFightingRoomData(null);
    });

    socket.on("readyFight", (roomData: FightingRoomDTO) => {
      console.log(roomData);
    });

    socket.on("cancelReady", (roomData: FightingRoomDTO) => {
      console.log(roomData);
    });
    // 컴포넌트가 언마운트될 때 이벤트 리스너 제거
    return () => {
      socket.off("createRoom");
      socket.off("joinRoom");
      socket.off("leaveRoom");
      socket.off("searchFight");
      socket.off("searchCancel");
    };
  }, []);

  useEffect(() => {
    if (fightingRoomData) {
      console.log(fightingRoomData);
      if (fightingRoomData.team_B != null) {
        const enemyTeam =
          fightingRoomData.team_A.roomName === waitingRoomData.roomName
            ? fightingRoomData.team_B
            : fightingRoomData.team_A;
        setEnemyRoomData(enemyTeam);
      } else {
        //상대방이 떠나버렸어 그면 그냥 그 방을 아예 없에버려
        setEnemyRoomData(null);
        // setFightingRoomData(null);
      }
    }
  }, [fightingRoomData]);

  useEffect(() => {
    console.log(enemyRoomData);
    if (enemyRoomData) {
      setIsSearching(false);
      setIsReady(false);

      toast.success("매칭 완료");
    }
  }, [enemyRoomData]);

  //====================================================================//
  //Button Func
  //====================================================================//
  const readyBattle = () => {
    if (!isReady) {
      socket.emit("readyFight", { fightRoom: fightingRoomData.fightRoomName });
      toast.success("준비 완료");
    } else {
      socket.emit("cancelReady", { fightRoom: fightingRoomData.fightRoomName });
      toast.success("준비 취소");
    }
    setIsReady(!isReady);
  };

  const searchBattleGuild = () => {
    if (isSearching) {
      toast.success("매칭 취소");
      socket.emit("searchCancel", { roomName: fightingRoomData.fightRoomName });
    } else {
      socket.emit("searchFight", {
        roomName: waitingRoomData.roomName,
      });
    }
    setIsSearching(!isSearching);
  };
  //====================================================================//

  //====================================================================//
  //Message Func
  //====================================================================//
  const selectTabHandler = (index: number) => {
    setCurrentTab(index);
  };
  const sendMessage = () => {
    setMessage("");
    switch (currentTab) {
      case 0:
        setAllMessage((prevMessages) => [...prevMessages, message]);
        break;
      case 1:
        setGuildMessage((prevMessages) => [...prevMessages, message]);
    }
  };
  const handleInputMessage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setMessage("");
      switch (currentTab) {
        case 0:
          setAllMessage((prevMessages) => [...prevMessages, message]);
          break;
        case 1:
          setGuildMessage((prevMessages) => [...prevMessages, message]);
      }
    }
  };
  //====================================================================//

  return (
    <div className="fight-room">
      <div className="room-topbar">
        <button type="button" className="leave-button" onClick={leaveFightRoom}>
          <img
            src={`${process.env.SERVER_URL}/public/leave.png`}
            alt="leave"
            height={20}
          />
          <div>나가기</div>
        </button>
      </div>

      <div className="battle-guild-container">
        <div className="battle-guild">
          <div className="guild-info">
            <img
              src={`${process.env.SERVER_URL}/${guild.guildIcon}`}
              width={50}
              height={50}
            />
            {guild.guildName}
          </div>
          <div className="guild-members">
            {waitingRoomData === undefined
              ? ""
              : waitingRoomData.members.map((matchMember, index) => (
                  <BattleMemberBox key={index} matchMember={matchMember} />
                ))}
          </div>
        </div>

        <div style={{ alignSelf: "center" }}>
          <img
            src={`${process.env.SERVER_URL}/public/vs.png`}
            alt="emoticon"
            width={50}
            color="white"
          />
        </div>

        <div className="battle-guild">
          <div className="guild-info">
            {enemyRoomData &&
              enemyRoomData.members[0] &&
              enemyRoomData.members[0].member.memberGuild && (
                <img
                  src={`${process.env.SERVER_URL}/${enemyRoomData.members[0].member.memberGuild.guildIcon}`}
                  width={50}
                  height={50}
                />
              )}
            {enemyRoomData &&
              enemyRoomData.members[0] &&
              enemyRoomData.members[0].member.memberGuild &&
              enemyRoomData.members[0].member.memberGuild.guildName}
          </div>
          <div className="guild-members">
            {enemyRoomData
              ? enemyRoomData.members.map((matchMember, index) => (
                  <BattleMemberBox key={index} matchMember={matchMember} />
                ))
              : ""}
          </div>
        </div>
      </div>

      <div className="battle-info-container">
        <div className="info-action-buttons">
          {enemyRoomData && (
            <button
              type="button"
              className={isReady ? "ready-cancel-button" : "ready-button"}
              onClick={readyBattle}
              style={{ cursor: "pointer" }}
            >
              <img
                src={`${process.env.SERVER_URL}/public/ready.png`}
                alt="leave"
                width={40}
              />
              <div>{isReady ? "준비 취소" : "준비 완료"}</div>
            </button>
          )}

          {waitingRoomData &&
            waitingRoomData.roomName.includes(member.memberName) && (
              <button
                type="button"
                className={
                  isSearching ? "search-cancel-button" : "search-button"
                }
                onClick={searchBattleGuild}
              >
                <img
                  src={`${process.env.SERVER_URL}/public/search.png`}
                  alt="leave"
                  width={40}
                />
                <div>{isSearching ? "매칭 취소" : "상대 팀 찾기"}</div>
              </button>
            )}
        </div>

        <div className="info-chat">
          <div className="chat-tab">
            {tabArr.map((el, index) => (
              <div
                key={index}
                className={index === currentTab ? "subtab focused" : "subtab"}
                onClick={() => selectTabHandler(index)}
              >
                {el.name}
              </div>
            ))}
          </div>

          <div className="tab-message-area">
            {(() => {
              switch (currentTab) {
                case 0:
                  return allMessage.map((message, index) => (
                    <div key={index}>{message}</div>
                  ));
                case 1:
                  return guildMessage.map((message, index) => (
                    <div key={index}>{message}</div>
                  ));
                default:
                  return null;
              }
            })()}
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

        <div className="info-battle-type">
          <div className="game-type">소환사의 협곡 / 5 vs 5</div>
          <img
            src={`${process.env.SERVER_URL}/public/gameType/Summoner'sRift.png`}
            alt="leave"
            height={140}
          />
        </div>
      </div>
    </div>
  );
};

export default FightRoom;
