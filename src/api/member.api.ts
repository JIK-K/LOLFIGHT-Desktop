import constant from "../common/constant/constant";
import { MemberDTO } from "../common/DTOs/member/member.dto";
import axios, { Axios, AxiosResponse } from "axios";
import { ResponseDTO } from "../common/DTOs/response.dto";
import { GuildDTO } from "../common/DTOs/guild/guild.dto";
import { MemberGameDTO } from "../common/DTOs/member/member_game.dto";

const baseUrl = `${process.env.SERVER_URL}/member`;

/**
 * member 로그인
 * @param id
 * @param pw
 * @returns
 */
export const login = async (
  id: string,
  pw: string
): Promise<AxiosResponse<ResponseDTO<MemberDTO>>> => {
  let url = `${baseUrl}/login`;

  let queryParams = `?id=${id}&pw=${pw}`;
  url += queryParams;

  return await axios.get(url);
};

/**
 * member 찾기
 * @param id
 * @returns
 */
export const findMember = async (
  id: string
): Promise<AxiosResponse<ResponseDTO<MemberDTO>>> => {
  let url = `${baseUrl}/find`;

  let queryParams = `?id=${id}`;
  url += queryParams;
  return await axios.get(url);
};

/**
 * member 정보변경
 * @param memberDTO
 * @returns
 */
export const update = async (
  id?: string,
  memberId?: string,
  memberPw?: string,
  memberName?: string,
  memberGuild?: GuildDTO | null,
  memberGame?: MemberGameDTO | null
): Promise<AxiosResponse<ResponseDTO<MemberDTO>>> => {
  let url = `${baseUrl}`;

  const body = {
    id: id,
    memberId: memberId,
    memberPw: memberPw,
    memberName: memberName,
    memberGuild: memberGuild,
    memberGame: memberGame,
  };

  return await axios.patch(url, body);
};
