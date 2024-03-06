import { Badge, NavBar, SummonerIcon } from "../../components";
import React, { useEffect, useState } from "react";
import { useLcuData } from "../../components/LcuContext";
import "./Home.scss";
import { findMember, update } from "../../../api/member.api";
import { MemberDTO } from "../../../common/DTOs/member/member.dto";
import { MemberGameDTO } from "../../../common/DTOs/member/member_game.dto";
import useMemberStore from "../../../common/zustand/member.zustand";
import { toast } from "react-hot-toast";
import { request } from "../../../renderer/utils/ipcBridge";

const RANK_CREST_URL =
  "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/images/ranked-mini-crests/";
const COLORS = new Map<string, string>([
  ["UNRANKED", "#404241"],
  ["IRON", "#6b6b64"],
  ["BRONZE", "#a46628"],
  ["SILVER", "#b5b5b5"],
  ["GOLD", "#d6a738"],
  ["PLATINUM", "#80aba4"],
  ["DIAMOND", "#71b0d1"],
  ["MASTER", "#7840a3"],
  ["GRANDMASTER", "#9e3342"],
  ["CHALLENGER", "#288fc7"],
]);

const Home: React.FC = () => {
  const lcuData = useLcuData();
  const { member, setMember } = useMemberStore();
  const getRankText = () => {
    const rank = lcuData.me.lol.rankedLeagueTier;
    const division = lcuData.me.lol.rankedLeagueDivision;

    return `${rank.charAt(0) + rank.substring(1).toLowerCase()} ${
      division === "NA" ? "" : division
    }`;
  };

  useEffect(() => {
    findMember(sessionStorage.getItem("memberId")).then((response) => {
      setMember(response.data.data);
    });
  }, []);

  const syncMemberData = () => {
    const memberGame: MemberGameDTO = {
      gameName: lcuData.me.name,
      gameTier:
        lcuData.me.lol.rankedLeagueTier +
        " " +
        lcuData.me.lol.rankedLeagueDivision,
    };
    update(
      member.id,
      member.memberId,
      null,
      member.memberName,
      member.memberGuild,
      memberGame
    ).then((response) => {
      console.log(response);
      toast.success("롤 정보 동기화 완료");
    });
  };

  const createRoom = () => {
    const requestBody = {
      customGameLobby: {
        configuration: {
          gameMode: "PRACTICETOOL",
          gameMutator: "",
          gameServerRegion: "",
          mapId: 11,
          mutators: { id: 1 },
          spectatorPolicy: "AllAllowed",
          teamSize: 5,
        },
        lobbyName: "yaya",
        lobbyPassword: "",
      },
      isCustom: true,
    };
    request("POST", "/lol-lobby/v2/lobby", requestBody)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="home-page">
      <div className="profile-game">
        {member?.memberGuild === undefined || null ? null : (
          <img
            src={`http://localhost:3000/public/guild/${member?.memberGuild?.guildName}.png`}
            alt="Guild"
            height={60}
            width={60}
          />
        )}
        <div className="info-game">
          <div className="guild">
            <div>회원명: {member?.memberName}</div>
            <div>소속길드: {member?.memberGuild?.guildName}</div>
          </div>
        </div>
        <button className="sync-btn" onClick={syncMemberData}>
          동기화하기
        </button>
      </div>
      <button onClick={createRoom}>방만들기</button>
    </div>
  );
};

export default Home;
