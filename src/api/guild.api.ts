import axios, { Axios, AxiosResponse } from "axios";
import { MemberDTO } from "../common/DTOs/member/member.dto";
import { ResponseDTO } from "../common/DTOs/response.dto";
import { GuildDTO } from "../common/DTOs/guild/guild.dto";
import { BattleDTO } from "../common/DTOs/battle/battle.dto";

const baseUrl = `${process.env.SERVER_URL}/guild`;

/**
 * Guild Member List 조회
 * @param guildName
 * @returns
 */
export const getGuildMemberList = async (
  guildName: string
): Promise<AxiosResponse<ResponseDTO<MemberDTO[]>>> => {
  let url = `${baseUrl}/guildMember`;

  const queryParams = `?name=${guildName}`;
  url += queryParams;

  return await axios.get(url);
};

/**
 * Guild 정보 조회
 * @param guildName
 * @returns
 */
export const getGuildInfo = async (
  guildName: string
): Promise<AxiosResponse<ResponseDTO<GuildDTO>>> => {
  let url = `${baseUrl}/info`;

  const queryParams = `?name=${guildName}`;
  url += queryParams;

  return await axios.get(url);
};

export const testyaya = async (data: any) => {
  // console.log(data);
  console.log("data-teams", data.teams);
  console.log("team-stats", data.teams[0].stats);
  console.log("team-players", data.teams[0].players);
  const testData: BattleDTO = {
    id: "",
    gameId: data.gameId,
    gameMode: data.gameMode,
    teams: data.teams.map((team: any) => ({
      id: "",
      isPlayerTeam: team.isPlayerTeam,
      isWinningTeam: team.isWinningTeam,
      players: team.players.map((player: any) => ({
        id: "",
        ...player,
        stats: {
          ...player.stats,
        },
      })),
      stats: {
        ...team.stats,
      },
      ...team,
    })),
  };

  console.log("plz come to me", testData);

  // // 모든 속성의 값을 출력하는 함수
  // function printAllValues(obj: any) {
  //   // 객체의 모든 속성에 대해 반복
  //   Object.keys(obj).forEach((key) => {
  //     const value = obj[key];
  //     // 값이 객체이면 재귀적으로 처리
  //     console.log("value-ref", value);
  //     if (typeof value === "object" && value !== null) {
  //       printAllValues(value);
  //     } else {
  //       // 값이 객체가 아니면 출력
  //       console.log(`${key}: ${value}`);
  //     }
  //   });
  // }

  // printAllValues(testData);

  // return await axios.get(url);
};
