import type { EventResponse } from "league-connect";
import React, { ReactNode, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { request } from "../utils/ipcBridge";
import { findMember } from "../../api/member.api";
import { getGuildInfo } from "../../api/guild.api";
import useMemberStore from "../../common/zustand/member.zustand";
import useSocketStore from "../../common/zustand/socket.zustand";
import useGuildStore from "../../common/zustand/guild.zustand";
import SocketIOClient, { Socket } from "socket.io-client";

const { ipcRenderer } = window.require("electron");

const AVAILABILITIES = ["chat", "away", "dnd", "mobile", "offline"] as const;

type Availability = (typeof AVAILABILITIES)[number];

const TOKEN_TIERS = [
  "IRON",
  "BRONZE",
  "SILVER",
  "GOLD",
  "PLATINUM",
  "DIAMOND",
  "MASTER",
  "GRANDMASTER",
  "CHALLENGER",
] as const;

type TokenTier = (typeof TOKEN_TIERS)[number];

type Token = {
  id: number;
  name: string;
  tier: TokenTier;
  legacy: boolean;
};

const QUEUES = [
  "RANKED_SOLO_5x5",
  "RANKED_FLEX_SR",
  "RANKED_FLEX_TT",
  "RANKED_TFT",
  "RANKED_TFT_TURBO",
  "RANKED_TFT_PAIRS",
  "RANKED_TFT_DOUBLE_UP",
] as const;

const TIERS = [
  "UNRANKED",
  "IRON",
  "BRONZE",
  "SILVER",
  "GOLD",
  "PLATINUM",
  "EMERALD",
  "DIAMOND",
  "MASTER",
  "GRANDMASTER",
  "CHALLENGER",
] as const;

const DIVISIONS = ["NA", "I", "II", "III", "IV"] as const;

type Queue = (typeof QUEUES)[number];
type Tier = (typeof TIERS)[number];
type Division = (typeof DIVISIONS)[number];

type FlexRankInfo = {
  rankedFlexTier: Tier;
  rankedFlexDivision: Division;
  flexLeaguePoint: number;
};

type RankInfo = {
  leaguePoint: number;
};

type GameStats = {
  kills: number;
  deaths: number;
  assists: number;
  damage: number;
  gold: number;
  visionScore: number;
  victory: number;
};

type MeState = {
  puuid: string;
  icon: number;
  availability: Availability;
  name: string;
  statusMessage: string;
  gameTag: string;
  lol: {
    level: number;
    rankedLeagueQueue: Queue;
    rankedLeagueTier: Tier;
    rankedLeagueDivision: Division;
    challengeCrystalLevel: Tier;
    challengePoints: number;
  };
};

type WalletState = {
  riotPoints: number;
  blueEssence: number;
};

type ProfileState = {
  backgroundSkinId: number;
};

type ChallengesState = {
  tokens: Token[];
  title: number;
};

type State = {
  me: MeState;
  wallet: WalletState;
  profile: ProfileState;
  challenges: ChallengesState;
  leaguePoint: RankInfo;
  flexRank: FlexRankInfo;
  gameData: GameStats;
};

const DEFAULT_STATE: State = {
  me: {
    puuid: "",
    availability: "offline",
    icon: 29,
    name: "Loading...",
    statusMessage: "Loading...",
    gameTag: "0000",
    lol: {
      level: 0,
      rankedLeagueQueue: "RANKED_SOLO_5x5",
      rankedLeagueTier: "UNRANKED",
      rankedLeagueDivision: "NA",
      challengeCrystalLevel: "UNRANKED",
      challengePoints: 0,
    },
  },
  profile: {
    backgroundSkinId: 0,
  },
  wallet: {
    riotPoints: 0,
    blueEssence: 0,
  },
  challenges: {
    tokens: [],
    title: -1,
  },
  leaguePoint: {
    leaguePoint: 0,
  },
  flexRank: {
    rankedFlexDivision: "NA",
    rankedFlexTier: "UNRANKED",
    flexLeaguePoint: 0,
  },
  gameData: {
    kills: 0,
    deaths: 0,
    assists: 0,
    damage: 0,
    gold: 0,
    visionScore: 0,
    victory: 0,
  },
};

const context = React.createContext<State>(DEFAULT_STATE);

export const LcuContext = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const [state, setState] = useState<State>(DEFAULT_STATE);
  const { member, setMember } = useMemberStore();
  const { guild, setGuild } = useGuildStore();
  const { socket, setSocket } = useSocketStore();

  useEffect(() => {
    // reset state on reconnects
    if (location.pathname === "/connect") setState(DEFAULT_STATE);

    // only fetch if connected and if not already fetched
    if (
      state !== DEFAULT_STATE ||
      location.pathname === "/connect" ||
      location.pathname === "/"
    )
      return;

    findMember(sessionStorage.getItem("memberId")).then((response) => {
      setMember(response.data.data);

      getGuildInfo(response.data.data.memberGuild.guildName).then(
        (response) => {
          console.log(response);
          setGuild(response.data.data);
        }
      );

      setSocket(
        SocketIOClient(`${process.env.SOCKET_URL}`, {
          query: {
            memberName: response.data.data.memberName,
            guildName: response.data.data.memberGuild.guildName,
          },
        })
      );
    });

    //==============================================================//

    request("GET", "/lol-chat/v1/me").then((response: any) => {
      setState((oldState) => ({
        ...oldState,
        me: {
          puuid: response.puuid,
          icon: response.icon,
          availability: response.availability,
          name: response.name,
          statusMessage: response.statusMessage,
          gameTag: response.gameTag,
          lol: {
            level: response.lol.level,
            rankedLeagueQueue:
              response.lol.rankedLeagueQueue ?? "RANKED_SOLO_5x5",
            rankedLeagueTier: response.lol.rankedLeagueTier
              ? response.lol.rankedLeagueTier === ""
                ? "UNRANKED"
                : response.lol.rankedLeagueTier
              : "UNRANKED",
            rankedLeagueDivision: response.lol.rankedLeagueDivision ?? "NA",
            challengeCrystalLevel: response.lol.challengeCrystalLevel,
            challengePoints: response.lol.challengePoints,
          },
        },
      }));
      // 8b3b97ef-a0c6-5e0c-86e8-c1e1a6f96484
      request(
        "GET",
        `/lol-career-stats/v1/summoner-games/${response.puuid}`
      ).then((response: any) => {
        const recentData: GameStats[] = response.slice(-30);

        const statsData: GameStats[] = recentData.map((game: any) => ({
          kills: game.stats?.["CareerStats.js"].kills,
          deaths: game.stats?.["CareerStats.js"].deaths,
          assists: game.stats?.["CareerStats.js"].assists,
          damage: game.stats?.["CareerStats.js"].damage,
          gold: game.stats?.["CareerStats.js"].goldEarned,
          visionScore: game.stats?.["CareerStats.js"].visionScore,
          victory: game.stats?.["CareerStats.js"].victory,
        }));

        let totalKills = 0;
        let totalDeaths = 0;
        let totalAssists = 0;
        let totalDamage = 0;
        let totalGold = 0;
        let totalVisionScore = 0;
        let totalVictory = 0;

        statsData.forEach((game) => {
          totalKills += game.kills || 0;
          totalDeaths += game.deaths || 0;
          totalAssists += game.assists || 0;
          totalDamage += game.damage || 0;
          totalGold += game.gold || 0;
          totalVisionScore += game.visionScore || 0;
          totalVictory += game.victory || 0;
        });
        3;

        const averageStats: GameStats = {
          kills: totalKills / statsData.length,
          deaths: totalDeaths / statsData.length,
          assists: totalAssists / statsData.length,
          damage: totalDamage / statsData.length,
          gold: totalGold / statsData.length,
          visionScore: totalVisionScore / statsData.length,
          victory: totalVictory / statsData.length,
        };

        setState((oldState) => ({
          ...oldState,
          gameData: averageStats,
        }));
      });
    });

    request("GET", "/lol-summoner/v1/current-summoner/summoner-profile").then(
      (response: any) => {
        setState((oldState) => ({
          ...oldState,
          profile: {
            backgroundSkinId: response.backgroundSkinId,
          },
        }));
      }
    );

    request(
      "GET",
      '/lol-inventory/v1/wallet?currencyTypes=["lol_blue_essence","RP"]'
    ).then((response: any) => {
      setState((oldState) => ({
        ...oldState,
        wallet: {
          riotPoints: response.RP ?? 0,
          blueEssence: response.lol_blue_essence ?? 0,
        },
      }));
    });

    request("GET", "/lol-ranked/v1/current-ranked-stats").then(
      (response: any) => {
        setState((oldState) => ({
          ...oldState,
          leaguePoint: {
            leaguePoint: response.highestRankedEntry.leaguePoints,
          },
          flexRank: {
            rankedFlexTier:
              response.queueMap.RANKED_FLEX_SR.highestTier === ""
                ? "UNRANKED"
                : response.queueMap.RANKED_FLEX_SR.highestTier,
            rankedFlexDivision:
              response.queueMap.RANKED_FLEX_SR.highestDivision,
            flexLeaguePoint: response.queueMap.RANKED_FLEX_SR.leaguePoints,
          },
        }));
      }
    );

    request("GET", "/lol-challenges/v1/summary-player-data/local-player").then(
      (response: any) => {
        setState((oldState) => ({
          ...oldState,
          challenges: {
            tokens: (response.topChallenges as any[]).map((token: any) => ({
              id: token.id,
              name: token.name,
              tier: token.currentLevel,
              legacy: token.retireTimestamp !== 0,
            })),
            title: response.title.itemId ?? -1,
          },
        }));
      }
    );
  }, [location]);

  useEffect(() => {
    const listener = (_event: never, message: EventResponse) => {
      switch (message.uri) {
        case "/lol-chat/v1/me": {
          setState((oldState) => ({
            ...oldState,
            me: {
              puuid: message.data.puuid,
              icon: message.data.icon,
              availability: message.data.availability,
              name: message.data.name,
              statusMessage: message.data.statusMessage,
              gameTag: message.data.gameTag,
              lol: {
                level: message.data.lol.level,
                rankedLeagueQueue: message.data.lol.rankedLeagueQueue,
                rankedLeagueTier:
                  message.data.lol.rankedLeagueTier === ""
                    ? "UNRANKED"
                    : message.data.lol.rankedLeagueTier,
                rankedLeagueDivision: message.data.lol.rankedLeagueDivision,
                challengeCrystalLevel: message.data.lol.challengeCrystalLevel,
                challengePoints: message.data.lol.challengePoints,
              },
            },
          }));
          break;
        }
        case "/lol-summoner/v1/current-summoner/summoner-profile": {
          setState((oldState) => ({
            ...oldState,
            profile: {
              backgroundSkinId: message.data.backgroundSkinId,
            },
          }));
          break;
        }
        case "/lol-inventory/v1/wallet": {
          setState((oldState) => ({
            ...oldState,
            wallet: {
              riotPoints: message.data.rp ?? 0,
              blueEssence: message.data.ip ?? 0,
            },
          }));
          break;
        }
        case `/lol-challenges/v1/summary-player-data/player/${state.me.puuid}`: {
          setState((oldState) => ({
            ...oldState,
            challenges: {
              tokens: (message.data.topChallenges as any[]).map(
                (token: any) => ({
                  id: token.id,
                  name: token.name,
                  tier: token.currentLevel,
                  legacy: token.retireTimestamp !== 0,
                })
              ),
              title: message.data.title.itemId ?? -1,
            },
          }));
          break;
        }
      }
    };

    ipcRenderer.on("lcu-event", listener);

    return () => {
      ipcRenderer.off("lcu-event", listener);
    };
  });

  return <context.Provider value={state}>{children}</context.Provider>;
};

export const useLcuData = () => React.useContext(context);
