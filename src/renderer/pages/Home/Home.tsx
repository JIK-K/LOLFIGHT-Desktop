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
import { SummonerIcon } from "../../components";
import SummonerRank from "./components/SummonerRank";
import SummonerStatsBox from "./components/SummonerStatsBox";
import SocketIOClient, { Socket } from "socket.io-client";

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

function HexagonIcon(
  props: React.JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>
) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    </svg>
  );
}

const Home: React.FC = () => {
  const navigate = useNavigate();
  const lcuData = useLcuData();
  const { member, setMember } = useMemberStore();
  const { socket, setSocket } = useSocketStore();
  const data = {
    kill: 0,
    deaths: 0,
    assists: 0,
    damage: 0,
    gold: 0,
    visionScore: 0,
    victory: 0,
  };

  const getRankText = () => {
    const rank = lcuData.me.lol.rankedLeagueTier;
    const division = lcuData.me.lol.rankedLeagueDivision;

    return `${rank.charAt(0) + rank.substring(1).toLowerCase()} ${
      division === "NA" ? "" : division
    }`;
  };

  useEffect(() => {
    if (socket) {
      socket.on("connect", () => {
        console.log("connet");
      });
    }
  }, [socket]);

  const syncMemberData = () => {
    const memberGame: MemberGameDTO = {
      gameName: lcuData.me.name + "#" + lcuData.me.gameTag,
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

  return (
    <div className="max-w-3xl mx-auto grid gap-8">
      <div className="grid md:grid-cols-[150px_1fr] gap-6">
        <SummonerIcon
          size={128}
          iconId={lcuData.me.icon}
          availability={lcuData.me.availability}
        />
        <div className="grid">
          <div className="text-2xl font-bold text-gray-200">
            <span
              className=" hover:text-blue-400 hover:cursor-pointer"
              onClick={syncMemberData}
            >
              {lcuData.me.name}
            </span>

            <span className="text-gray-400 font-medium text-xl">
              #{lcuData.me.gameTag}
            </span>
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
              승률 <span style={{ fontSize: "12px" }}>(최근 30판)</span>
            </div>
            <div className="flex-1 bg-gray-800 rounded-full h-2.5 dark:bg-gray-700">
              <div
                className="bg-green-500 h-2.5 rounded-full"
                style={{ width: lcuData.gameData.victory * 100 }}
              ></div>
            </div>
            <div className="text-gray-400">
              {(lcuData.gameData.victory * 100).toFixed(2)}%
            </div>
          </div>
        </div>
      </div>
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
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-3 md:col-span-2 lg:col-span-1">
          <div className="rounded-lg border text-card-goreground shadow-sm bg-gray-800 border-gray-700 h-full">
            <div className="flex flex-col space-y-1.5 p-6 border-b border-gray-700 px-6 py-4">
              <h3 className="text-lg font-bold text-gray-200">Most</h3>
            </div>
            {/* 
            모스트챔피언 
            */}
            <div className="p-6 px-6 py-4">
              <div className="grid gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="rounded-full bg-gray-700 w-8 h-8 flex items-center justify-center text-sm font-bold text-gray-200">
                      1
                    </div>
                    <div>
                      <div className="font-medium text-gray-200">볼리베어</div>
                      <div className="text-sm text-gray-400">Rank: #C</div>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-gray-200">10</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="rounded-full bg-gray-700 w-8 h-8 flex items-center justify-center text-sm font-bold text-gray-200">
                      2
                    </div>
                    <div>
                      <div className="font-medium text-gray-200">제이스</div>
                      <div className="text-sm text-gray-400">Rank: #B</div>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-gray-200">9</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="rounded-full bg-gray-700 w-8 h-8 flex items-center justify-center text-sm font-bold text-gray-200">
                      3
                    </div>
                    <div>
                      <div className="font-medium text-gray-200">스카너</div>
                      <div className="text-sm text-gray-400">Rank: #A</div>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-gray-200">8</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="rounded-full bg-gray-700 w-8 h-8 flex items-center justify-center text-sm font-bold text-gray-200">
                      4
                    </div>
                    <div>
                      <div className="font-medium text-gray-200">리븐</div>
                      <div className="text-sm text-gray-400">Rank: #B</div>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-gray-200">7</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="rounded-full bg-gray-700 w-8 h-8 flex items-center justify-center text-sm font-bold text-gray-200">
                      5
                    </div>
                    <div>
                      <div className="font-medium text-gray-200">잭스</div>
                      <div className="text-sm text-gray-400">Rank: #S</div>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-gray-200">5</div>
                </div>
                {/*  */}
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-3 md:col-span-1 lg:col-span-2">
          <div className="rounded-lg border text-card-foreground shadow-sm bg-gray-800 border-gray-700 h-full">
            <div className="flex flex-col space-y-1.5 p-6 border-b border-gray-700 px-6 py-4">
              <h3 className="text-lg font-bold text-gray-200">
                Hexagonal Graph
              </h3>
            </div>
            <div className="p-6 px-6 py-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-3 md:col-span-1 flex flex-col items-center justify-center">
                  <div className="relative w-full aspect-square">
                    <div className="absolute inset-0 bg-gray-700 rounded-full flex items-center justify-center text-2xl font-bold text-gray-200">
                      72%
                    </div>
                    <div className="absolute inset-0 bg-gray-800 rounded-full flex items-center justify-center">
                      <div className="w-[80%] h-[80%] bg-gray-950 rounded-full flex items-center justify-center">
                        <HexagonIcon className="w-10 h-10 text-gray-400" />
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-400 mt-2">전투</div>
                </div>
                <div className="col-span-3 md:col-span-1 flex flex-col items-center justify-center">
                  <div className="relative w-full aspect-square">
                    <div className="absolute inset-0 bg-gray-700 rounded-full flex items-center justify-center text-2xl font-bold text-gray-200">
                      84%
                    </div>
                    <div className="absolute inset-0 bg-gray-800 rounded-full flex items-center justify-center">
                      <div className="w-[80%] h-[80%] bg-gray-950 rounded-full flex items-center justify-center">
                        <HexagonIcon className="w-10 h-10 text-gray-400" />
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-400 mt-2">전략</div>
                </div>
                <div className="col-span-3 md:col-span-1 flex flex-col items-center justify-center">
                  <div className="relative w-full aspect-square">
                    <div className="absolute inset-0 bg-gray-700 rounded-full flex items-center justify-center text-2xl font-bold text-gray-200">
                      92%
                    </div>
                    <div className="absolute inset-0 bg-gray-800 rounded-full flex items-center justify-center">
                      <div className="w-[80%] h-[80%] bg-gray-950 rounded-full flex items-center justify-center">
                        <HexagonIcon className="w-10 h-10 text-gray-400" />
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-400 mt-2">성장</div>
                </div>
                <div className="col-span-3 md:col-span-1 flex flex-col items-center justify-center">
                  <div className="relative w-full aspect-square">
                    <div className="absolute inset-0 bg-gray-700 rounded-full flex items-center justify-center text-2xl font-bold text-gray-200">
                      88%
                    </div>
                    <div className="absolute inset-0 bg-gray-800 rounded-full flex items-center justify-center">
                      <div className="w-[80%] h-[80%] bg-gray-950 rounded-full flex items-center justify-center">
                        <HexagonIcon className="w-10 h-10 text-gray-400" />
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-400 mt-2">맵 장악</div>
                </div>
                <div className="col-span-3 md:col-span-1 flex flex-col items-center justify-center">
                  <div className="relative w-full aspect-square">
                    <div className="absolute inset-0 bg-gray-700 rounded-full flex items-center justify-center text-2xl font-bold text-gray-200">
                      95%
                    </div>
                    <div className="absolute inset-0 bg-gray-800 rounded-full flex items-center justify-center">
                      <div className="w-[80%] h-[80%] bg-gray-950 rounded-full flex items-center justify-center">
                        <HexagonIcon className="w-10 h-10 text-gray-400" />
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-400 mt-2">지원</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
