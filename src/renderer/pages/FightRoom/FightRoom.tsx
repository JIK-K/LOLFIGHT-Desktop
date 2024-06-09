import React, { useEffect, useRef, useState } from "react";
import "./FightRoom.scss";
import { useLocation, useNavigate } from "react-router-dom";
import BattleMemberBox from "./components/BattleMemberBox";
import toast from "react-hot-toast";
import useSocketStore from "../../../common/zustand/socket.zustand";
import { WaitingRoomDTO } from "../../../common/DTOs/room/waitingRoom.dto";
import useGuildStore from "../../../common/zustand/guild.zustand";
import { MatchMembersDTO } from "../../../common/DTOs/room/matchMembers.dto";
import useMemberStore from "../../../common/zustand/member.zustand";
import { FightingRoomDTO } from "../../../common/DTOs/room/FightingRoom.dto";
import { request } from "../../../renderer/utils/ipcBridge";
import useFightingRoomStore from "../../../common/zustand/fightRoom.zustand";

const FightRoom = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const data = { ...location.state };
  const { socket } = useSocketStore();
  const { member } = useMemberStore();
  const { guild } = useGuildStore();

  const [currentTab, setCurrentTab] = useState(0);
  const [allMessage, setAllMessage] = useState<string[]>([]);
  const [guildMessage, setGuildMessage] = useState<string[]>([]);
  const [message, setMessage] = useState<string>("");

  const [waitingRoomData, setWaitingRoomData] = useState<WaitingRoomDTO>();
  const [enemyRoomData, setEnemyRoomData] = useState<WaitingRoomDTO>();
  const [prevEnemyRoomName, setPrevEnemyRoomName] = useState<string>();
  const { fightingRoom, setFightingRoom } = useFightingRoomStore();

  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [isReady, setIsReady] = useState<boolean>(false);

  const [allReady, setAllReady] = useState<boolean>(false);

  const [isGaming, setisGaming] = useState<boolean>(false);

  const guildMessageAreaRef = useRef(null);
  const allMessageAreaRef = useRef(null);

  const tabArr = [
    { name: "전체", content: allMessage },
    { name: "길드", content: guildMessage },
  ];

  const leaveFightRoom = () => {
    const matchMember: MatchMembersDTO = {
      member: member,
      isReady: false,
      isLeader: false,
    };

    if (!isSearching && waitingRoomData.status !== "매칭중") {
      if (fightingRoom) {
        socket.emit("searchCancel", {
          roomName: fightingRoom.fightRoomName,
        });
        setFightingRoom(null);
      }
      socket.emit("leaveRoom", {
        roomName: waitingRoomData.roomName,
        matchMember: matchMember,
      });
      navigate("/guild");
    } else {
      toast.error("매칭중일때는 나갈 수 없습니다.");
    }
  };

  useEffect(() => {
    // console.log(data);
    if (data !== null || undefined) {
      setWaitingRoomData(data);
    }
  }, []);

  useEffect(() => {
    if (allMessageAreaRef.current) {
      allMessageAreaRef.current.scrollTop =
        allMessageAreaRef.current.scrollHeight;
    }
  }, [allMessage]);

  useEffect(() => {
    if (guildMessageAreaRef.current) {
      guildMessageAreaRef.current.scrollTop =
        guildMessageAreaRef.current.scrollHeight;
    }
  }, [guildMessage]);

  useEffect(() => {
    socket.on("createRoom", (roomData: WaitingRoomDTO) => {
      // console.log("createRoom");
      setWaitingRoomData(roomData);
    });

    socket.on("joinRoom", (roomData: WaitingRoomDTO) => {
      // console.log(roomData);
      setWaitingRoomData(roomData);
    });

    socket.on("leaveRoom", (roomData: WaitingRoomDTO) => {
      if (roomData === null) {
        setFightingRoom(null);
        navigate("/guild");
        toast("매치리더가 방을 떠났습니다.", { icon: "💔" });
      } else {
        setWaitingRoomData(roomData);
      }
    });

    socket.on("searchFight", (roomData: FightingRoomDTO) => {
      // console.log("SearchFight", roomData);
      // const data = roomData;
      // data.team_A.members[0].isLeader = true;
      setFightingRoom(roomData);
    });

    socket.on("searchCancel", (data: WaitingRoomDTO) => {
      // console.log(data);
      setWaitingRoomData(data);
      setEnemyRoomData(null);
      setFightingRoom(null);
    });

    socket.on("readyFight", (roomData: FightingRoomDTO) => {
      setFightingRoom(roomData);
    });

    socket.on("cancelReady", (roomData: FightingRoomDTO) => {
      setFightingRoom(roomData);
    });

    socket.on("startFight", (fightData: FightingRoomDTO) => {
      setFightingRoom(fightData);
      createCustomGame(fightData);
    });

    socket.on("changeTeam", (fightdata: FightingRoomDTO) => {
      // console.log(fightdata);
      setFightingRoom(fightdata);
      toast.success("레드팀 - 블루팀 진영이 변경되었습니다.");
    });

    socket.on("message", (receivedMessage: string) => {
      setGuildMessage((prevMessages) => [...prevMessages, receivedMessage]);
    });

    socket.on("fightMessage", (receivedMessage: string) => {
      setAllMessage((prevMessages) => [...prevMessages, receivedMessage]);
    });

    socket.on("endOfGame", (roomData: FightingRoomDTO) => {
      console.log(roomData);
      setAllReady(false);
      setIsReady(false);
      setFightingRoom(roomData);
    });
    // 컴포넌트가 언마운트될 때 이벤트 리스너 제거
    return () => {
      socket.off("createRoom");
      socket.off("joinRoom");
      socket.off("leaveRoom");
      socket.off("searchFight");
      socket.off("searchCancel");
      socket.off("readyFight");
      socket.off("cancelReady");
      socket.off("startFight");
      socket.off("changeTeam");
      socket.off("message");
      socket.off("fightMessage");
    };
  }, []);

  useEffect(() => {
    if (fightingRoom) {
      console.log(fightingRoom);
      //@todo 주석해제
      // if (fightingRoom.readyCount === 5) {
      if (fightingRoom.readyCount === 2) {
        setAllReady(true);
      } else {
        setAllReady(false);
      }

      if (fightingRoom.status === "게임중") {
        setisGaming(true);
      }
      if (fightingRoom.status === "매칭중") {
        console.log("매칭중으로 바뀜", fightingRoom);
        console.log(
          "ready :",
          isReady,
          "allReady : ",
          allReady,
          "isGaming :",
          isGaming,
          "isSearching : ",
          isSearching
        );
        setisGaming(false);
      }

      if (fightingRoom.team_B != null) {
        const enemyTeam =
          fightingRoom.team_A.roomName === waitingRoomData.roomName
            ? fightingRoom.team_B
            : fightingRoom.team_A;
        const homeTeam =
          fightingRoom.team_A.roomName === waitingRoomData.roomName
            ? fightingRoom.team_A
            : fightingRoom.team_B;

        setWaitingRoomData(homeTeam);
        setEnemyRoomData(enemyTeam);
      } else {
        //상대방이 떠나버렸어 그면 그냥 그 방을 아예 없에버려
        setEnemyRoomData(null);
        setPrevEnemyRoomName(null);
        initRoomData("대기중");
      }
    }
  }, [fightingRoom]);

  useEffect(() => {
    if (enemyRoomData) {
      if (!prevEnemyRoomName || prevEnemyRoomName !== enemyRoomData.roomName) {
        setIsSearching(false);
        setIsReady(false);
        matchingSuccessSound();
        toast.success("매칭 완료");
      }
      setPrevEnemyRoomName(enemyRoomData.roomName);
    }
  }, [enemyRoomData]);

  useEffect(() => {
    console.log(waitingRoomData);
  }, [waitingRoomData]);

  //====================================================================//
  //Riot Custom Game Func
  //====================================================================//
  const inviteCustomGame = (fightData: FightingRoomDTO) => {
    const invitationData: any = [];

    const addInvitation = (team: WaitingRoomDTO) => {
      team.members.map((data) => {
        const { gameName, summonerId } = data.member.memberGame;
        invitationData.push({
          invitationType: "lobby",
          state: "Requested",
          toSummonerId: summonerId,
          toSummonerName: gameName,
        });
      });
    };

    addInvitation(fightData.team_A);
    addInvitation(fightData.team_B);

    console.log(invitationData);

    request("POST", "/lol-lobby/v2/lobby/invitations", invitationData)
      .then((response: any) => {
        console.log(response);
      })
      .catch((error: any) => {
        console.log(error);
      });
  };

  const createCustomGame = (fightData: FightingRoomDTO) => {
    if (fightData.team_A.roomName.includes(member.memberName)) {
      const requestBody = {
        customGameLobby: {
          configuration: {
            gameMode: "CLASSIC",
            // gameServerRegion: "",
            mapId: 11,
            /*
          11: Summoner's Rift
          12: HowlingAbyss
          */
            // maxPlayerCount: 0,
            mutators: { id: 6 },
            spectatorPolicy: "AllAllowed",
            teamSize: 5,
          },
          lobbyName:
            fightData.team_A.roomName + " VS " + fightData.team_B.roomName,
          lobbyPassword: fightData.fightRoomName,
        },
        isCustom: true,
      };
      request("POST", "/lol-lobby/v2/lobby", requestBody)
        .then((response) => {
          console.log(response);
          setTimeout(() => {
            inviteCustomGame(fightData);
          }, 5000);
        })
        .catch((error) => {
          // console.log(error);
        });
      // request("GET", "/lol-end-of-game/v1/eog-stats-block");
    }
  };

  //====================================================================//

  //====================================================================//
  //Waiting Room Func
  //====================================================================//
  const initRoomData = (status: string) => {
    if (waitingRoomData) {
      const updatedMembers = waitingRoomData.members.map((member) => ({
        ...member,
        isReady: false,
        isLeader: false,
      }));
      setWaitingRoomData((prevRoomData) => ({
        ...prevRoomData,
        members: updatedMembers,
        status: status,
      }));
    }
  };

  //====================================================================//
  //Button Func
  //====================================================================//
  const readyBattle = () => {
    if (!isReady) {
      socket.emit("readyFight", {
        fightRoom: fightingRoom.fightRoomName,
        memberName: member.memberName,
      });
      toast.success("준비 완료");
    } else {
      socket.emit("cancelReady", {
        fightRoom: fightingRoom.fightRoomName,
        memberName: member.memberName,
      });
      toast.success("준비 취소");
    }
    setIsReady(!isReady);
  };

  const searchBattleGuild = () => {
    if (isSearching) {
      toast.success("매칭 취소");
      socket.emit("searchCancel", { roomName: fightingRoom.fightRoomName });
      setIsSearching(!isSearching);
    } else {
      if (allReady) {
        if (fightingRoom.team_A.roomName.includes(member.memberName)) {
          //내가 team_A의 방장이다 = 이 매치의 리더이다
          socket.emit("startFight", {
            fightRoom: fightingRoom.fightRoomName,
          });
        } else {
          toast.error("매치리더만이 게임을 시작할수있다.");
        }
      } else {
        // @todo 주석해제
        // if (waitingRoomData.members.length === 5) {
        socket.emit("searchFight", {
          roomName: waitingRoomData.roomName,
        });
        setIsSearching(!isSearching);
        // } else {
        //   toast.error("매칭을 위해서는 최소 5명이 필요합니다.");
        // }
      }
    }
  };
  //====================================================================//

  const changeTeam = () => {
    const leaderName = fightingRoom.team_A.members[0].member.memberName;
    if (member.memberName === leaderName) {
      socket.emit("changeTeam", {
        fightRoomName: fightingRoom.fightRoomName,
      });
    }
  };

  //====================================================================//
  //Message Func
  //====================================================================//
  const selectTabHandler = (index: number) => {
    setCurrentTab(index);
  };
  const sendMessage = () => {
    switch (currentTab) {
      case 0:
        socket.emit("fightMessage", {
          fightRoom: fightingRoom.fightRoomName,
          memberName: member.memberName,
          message: message,
        });
        // setAllMessage((prevMessages) => [...prevMessages, message]);
        break;
      case 1:
        socket.emit("message", {
          memberName: member.memberName,
          guildName: member.memberGuild.guildName,
          message: message,
        });
      // setGuildMessage((prevMessages) => [...prevMessages, message]);
    }
    setMessage("");
  };
  const handleInputMessage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      switch (currentTab) {
        case 0:
          socket.emit("fightMessage", {
            fightRoom: fightingRoom.fightRoomName,
            memberName: member.memberName,
            message: message,
          });
          // setAllMessage((prevMessages) => [...prevMessages, message]);
          break;
        case 1:
          socket.emit("message", {
            memberName: member.memberName,
            guildName: member.memberGuild.guildName,
            message: message,
          });
        // setGuildMessage((prevMessages) => [...prevMessages, message]);
      }
      setMessage("");
    }
  };
  //====================================================================//

  //====================================================================//
  //Sound Func
  //====================================================================//
  const matchingSuccessSound = () => {
    const audio = new Audio(
      `${process.env.SERVER_URL}/public/sound/matchingSuccess.mp3`
    );
    audio.volume = 0.2; // 볼륨 조절 (0.0 ~ 1.0)
    audio.play();
  };

  //====================================================================//

  return (
    <div>
      {!isGaming ? (
        <div className="fight-room">
          <div className="room-topbar">
            <button
              type="button"
              className="leave-button"
              onClick={leaveFightRoom}
            >
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
                {waitingRoomData === undefined ||
                waitingRoomData.members === undefined
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
              {enemyRoomData ? (
                <button
                  type="button"
                  onClick={changeTeam}
                  style={{ cursor: "pointer", backgroundColor: "transparent" }}
                >
                  <img
                    src={`${process.env.SERVER_URL}/public/swap.png`}
                    alt="swap"
                    width={30}
                    color="white"
                  />
                </button>
              ) : (
                ""
              )}
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
                waitingRoomData.roomName &&
                waitingRoomData.roomName.includes(member.memberName) && (
                  <button
                    type="button"
                    className={
                      isSearching
                        ? "search-cancel-button"
                        : allReady
                        ? "start-button"
                        : "search-button"
                    }
                    onClick={searchBattleGuild}
                  >
                    <img
                      src={`${process.env.SERVER_URL}/public/search.png`}
                      alt="leave"
                      width={40}
                    />
                    <div>
                      {isSearching
                        ? "매칭 취소"
                        : allReady
                        ? "게임 시작"
                        : "상대 팀 찾기"}
                    </div>
                  </button>
                )}
            </div>

            <div className="info-chat">
              <div className="chat-tab">
                {tabArr.map((el, index) => (
                  <div
                    key={index}
                    className={
                      index === currentTab ? "subtab focused" : "subtab"
                    }
                    onClick={() => selectTabHandler(index)}
                  >
                    {el.name}
                  </div>
                ))}
              </div>

              <div
                className="tab-message-area"
                ref={currentTab === 0 ? allMessageAreaRef : guildMessageAreaRef}
              >
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
      ) : (
        <div className="fight-room-gaming">내전 진행중</div>
      )}
    </div>
  );
};

export default FightRoom;
