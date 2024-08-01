import React, { useEffect, useState } from "react";
import { useLcuData } from "../../components/LcuContext";
import "./Home.scss";
import { findMember, update } from "../../../api/member.api";
import { MemberGameDTO } from "../../../common/DTOs/member/member_game.dto";
import useMemberStore from "../../../common/zustand/member.zustand";
import useSocketStore from "../../..//common/zustand/socket.zustand";
import { toast } from "react-hot-toast";
import { request } from "../../../renderer/utils/ipcBridge";
import { useNavigate } from "react-router-dom";
import { Blur, SummonerIcon } from "../../components";
import SummonerRank from "./components/SummonerRank";
import SummonerStatsBox from "./components/SummonerStatsBox";
import SocketIOClient, { Socket } from "socket.io-client";
import ChampionBox from "./components/ChampionBox";
import HexagonChart from "./components/HexagonChart";

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
  const { socket, setSocket } = useSocketStore();

  useEffect(() => {
    if (socket) {
      socket.on("connect", () => {
        console.log("connet");
      });
    }
  }, [socket]);

  const syncMemberData = () => {
    const memberGame: MemberGameDTO = {
      gameName: lcuData.me.gameName + "#" + lcuData.me.gameTag,
      gameTier:
        lcuData.me.lol.rankedLeagueTier +
        " " +
        lcuData.me.lol.rankedLeagueDivision,
      summonerId: lcuData.me.summonerId,
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
    )
      .then((response) => {
        console.log(response);
        setMember(response.data.data);
        toast.success("롤 정보 동기화 완료");
      })
      .catch((error) => {
        console.log(error);
        toast.success("이미 등록되어있는 소환사 계정입니다");
      });
  };

  const refreshScreen = () => {
    window.location.reload();
  };

  return (
    <div className="max-w-3xl mx-auto grid px-4 md:px-6 py-8 md:py-12 gap-8">
      <div className="grid md:grid-cols-[150px_1fr] gap-6">
        <SummonerIcon
          size={128}
          iconId={lcuData.me.icon}
          availability={lcuData.me.availability}
        />
        <div className="grid">
          <div className="flex text-2xl font-bold text-gray-200">
            <span
              className=" hover:text-blue-400 hover:cursor-pointer"
              onClick={syncMemberData}
            >
              {lcuData.me.gameName}
            </span>

            <span className="text-gray-400 font-medium text-xl">
              #{lcuData.me.gameTag}
            </span>

            <div className="flex group ml-2 relative">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className="justify-self-center self-center size-6 cursor-pointer transition-colors duration-300 ease-in-out group-hover:text-blue-400"
                onClick={refreshScreen}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                />
              </svg>

              <div className="w-[50px] absolute bottom-8 bg-gray-800 text-white text-xs p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                새로고침
              </div>
            </div>
          </div>
          <div className="flex gap-2 justify-between">
            <div className="w-1/2 flex items-center gap-2 text-sm text-gray-400">
              {/* Solo Rank */}
              <SummonerRank
                rankText="개인 / 2인랭크"
                LeagueTier={lcuData.me.lol.rankedLeagueTier}
                LeagueDivision={lcuData.me.lol.rankedLeagueDivision}
                LeaguePoint={lcuData.leaguePoint.leaguePoint}
              />
            </div>
            <div className="w-1/2 flex items-center gap-2 text-sm text-gray-400">
              <div className="rank-game">
                {/* Team Rank */}
                <SummonerRank
                  rankText="자유 5대5 대전"
                  LeagueTier={lcuData.flexRank.rankedFlexTier}
                  LeagueDivision={lcuData.flexRank.rankedFlexDivision}
                  LeaguePoint={lcuData.flexRank.flexLeaguePoint}
                />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <div>
              {/* 승률 <span style={{ fontSize: "12px" }}>(최근 30판)</span> */}
              승률
            </div>
            <div className="flex-1 bg-gray-800 rounded-full h-2.5 dark:bg-gray-700">
              <div
                className="bg-green-500 h-2.5 rounded-full"
                style={{ width: `${lcuData.gameData.victory * 100}%` }}
              ></div>
            </div>
            <div className="text-gray-400">
              {(lcuData.gameData.victory * 100).toFixed(2)}%
            </div>
          </div>
        </div>
      </div>
      {/* player stat */}
      <div className="grid gap-6">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <SummonerStatsBox
            stats="KDA"
            value={`${(
              (lcuData.gameData.kills + lcuData.gameData.assists) /
              lcuData.gameData.deaths
            ).toFixed(2)}`}
            text="KDA"
          />
          <SummonerStatsBox
            stats="킬"
            value={`${lcuData.gameData.kills.toFixed(2)}`}
            text="Kill"
          />
          <SummonerStatsBox
            stats="데스"
            value={`${lcuData.gameData.deaths.toFixed(2)}`}
            text="Death"
          />
          <SummonerStatsBox
            stats="어시스트"
            value={`${lcuData.gameData.assists.toFixed(2)}`}
            text="Assists"
          />
          <SummonerStatsBox
            stats="골드"
            value={`${lcuData.gameData.gold.toFixed(0)}`}
            text="Gold"
          />
          <SummonerStatsBox
            stats="시야점수"
            value={`${lcuData.gameData.visionScore.toFixed(0)}`}
            text="Vision"
          />
          <SummonerStatsBox
            stats="데미지"
            value={`${lcuData.gameData.damage.toFixed(0)}`}
            text="Damage"
          />
        </div>
      </div>
      <div className="relative">
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-3 md:col-span-2 lg:col-span-1">
            <div className="rounded-lg border text-card-goreground shadow-sm bg-gray-800 border-gray-700 h-full">
              <div className="flex flex-col space-y-1.5 p-6 border-b border-gray-700 px-6 py-4">
                <h3 className="text-lg font-bold text-gray-200">Most</h3>
              </div>
              {/* 모스트챔피언  */}
              <div className="p-6 px-6 py-4">
                <div className="grid gap-5">
                  {lcuData.mostChampions.slice(0, 7).map((data, index) => (
                    <ChampionBox
                      key={index}
                      championId={data.championsId}
                      count={data.count}
                      victory={data.victory}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-3 md:col-span-1 lg:col-span-2">
            <div className="rounded-lg border text-card-foreground shadow-sm bg-gray-800 border-gray-700 h-full">
              <div className="flex flex-col space-y-1.5 p-6 border-b border-gray-700 px-6 py-4">
                <h3 className="text-lg font-bold text-gray-200">
                  Player Graph
                </h3>
              </div>
              <div className="px-6 py-2">
                <div className="flex w-full h-[300px] justify-center items-center gap-4">
                  <HexagonChart
                    kda={parseFloat(
                      (
                        (lcuData.gameData.kills + lcuData.gameData.assists) /
                        lcuData.gameData.deaths
                      ).toFixed(2)
                    )}
                    damage={Math.floor(lcuData.gameData.damage)}
                    gold={Math.floor(lcuData.gameData.gold)}
                    visionScore={Math.floor(lcuData.gameData.visionScore)}
                    kill={parseFloat(lcuData.gameData.kills.toFixed(2))}
                    text={"전투"}
                  />
                </div>
              </div>

              <div className="">
                <div className="flex flex-col space-y-1.5 border-y border-gray-700 px-6 py-2">
                  <h3 className="text-lg font-bold text-gray-200">
                    플레이한 시간
                  </h3>
                  <div className="bg-gradient-to-b from-yellow-300 to-amber-700 bg-clip-text text-transparent text-xl font-bold">
                    3<span className="text-[15px]">시간</span>
                  </div>
                </div>
                <div className="flex flex-col space-y-1.5border-y border-gray-700 px-6 py-2">
                  <h3 className="text-lg font-bold text-gray-200">
                    플레이한 게임
                  </h3>
                  <div className="bg-gradient-to-b from-yellow-300 to-amber-700 bg-clip-text text-transparent text-xl font-bold">
                    151<span className="text-[15px]">판</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
// KDA, 킬관여율, 기여한피해량,데스당피해량, 팀원보조점수
export default Home;
