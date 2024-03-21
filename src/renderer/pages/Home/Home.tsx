import React, { useEffect, useState } from "react";
import { useLcuData } from "../../components/LcuContext";
import "./Home.scss";
import { findMember, update } from "../../../api/member.api";
import { MemberGameDTO } from "../../../common/DTOs/member/member_game.dto";
import useMemberStore from "../../../common/zustand/member.zustand";
import { toast } from "react-hot-toast";
import { request } from "../../../renderer/utils/ipcBridge";
import { useNavigate } from "react-router-dom";
import { SummonerIcon } from "../../components";
import SummonerRank from "./components/SummonerRank";

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
  const navigate = useNavigate();
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
    if (lcuData.me.lol.rankedLeagueTier === undefined) {
      memberGame.gameTier = "UNRANKED";
    }
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
    navigate("/room");

    // const requestBody = {
    //   customGameLobby: {
    //     configuration: {
    //       gameMode: "CLASSIC",
    //       // gameServerRegion: "",
    //       mapId: 11,
    //       // maxPlayerCount: 0,
    //       mutators: { id: 6 },
    //       spectatorPolicy: "AllAllowed",
    //       teamSize: 5,
    //     },
    //     lobbyName: "king",
    //     lobbyPassword: "123123",
    //   },
    //   isCustom: true,
    // };
    // request("POST", "/lol-lobby/v2/lobby", requestBody)
    //   .then((response) => {
    //     console.log(response);
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
  };

  const testGetGameData = () => {
    // /lol-lobby/v2/lobby
    // /lol-lobby/v1/custom-games/11
    // const gameID = 6978951773;
    // const yaya = {
    //   password: null,
    //   asSpectator: true,
    // };
    // request("POST", `/lol-lobby/v1/custom-games/${gameID}/join`, yaya)
    // /lol-match-history/v1/products/lol/{summoner["puuid"]}/matches
    // "1e9dd0ac-3dd4-57ef-98ca-864fe40ecd2b"
    request(
      "GET",
      `/lol-match-history/v1/products/lol/1e9dd0ac-3dd4-57ef-98ca-864fe40ecd2b/matches`
    )
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
        <SummonerIcon
          size={100}
          iconId={lcuData.me.icon}
          availability={lcuData.me.availability}
        />
        <div className="summoner-name">
          {lcuData.me.name} <span className="id">#{lcuData.me.gameTag}</span>
        </div>
      </div>
      <div className="rank-info">
        <div className="rank-game">
          {/* Solo Rank */}
          <SummonerRank
            LeagueTier={lcuData.me.lol.rankedLeagueTier}
            LeagueDivision={lcuData.me.lol.rankedLeagueDivision}
            LeaguePoint={lcuData.leaguePoint.leaguePoint}
          />
          {/* Team Rank */}
          <SummonerRank
            LeagueTier={lcuData.me.lol.rankedLeagueTier}
            LeagueDivision={lcuData.me.lol.rankedLeagueDivision}
            LeaguePoint={lcuData.leaguePoint.leaguePoint}
          />
        </div>
        <div className="rank-indicators">
          <div>yaya</div>
        </div>
      </div>
    </div>
  );
};

export default Home;
