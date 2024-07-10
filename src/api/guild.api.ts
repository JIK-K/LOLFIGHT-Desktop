import axios, { Axios, AxiosResponse } from "axios";
import { MemberDTO } from "../common/DTOs/member/member.dto";
import { ResponseDTO } from "../common/DTOs/response.dto";
import { GuildDTO } from "../common/DTOs/guild/guild.dto";
import { BattleDTO } from "../common/DTOs/battle/battle.dto";
import { GuildInviteDTO } from "../common/DTOs/guild/guild_invite.dto";

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

/**
 * Guild List
 * @returns
 */
export const getGuildList = async (): Promise<
  AxiosResponse<ResponseDTO<GuildDTO[]>>
> => {
  let url = `${baseUrl}/list`;

  return await axios.get(url);
};

/**
 * Guild-Invite 길드 가입신청
 * @param guildInviteDTO
 * @returns
 */
export const inviteGuild = async (
  memberId: string,
  guildId: string
): Promise<AxiosResponse<ResponseDTO<GuildInviteDTO>>> => {
  let url = `${baseUrl}/invite`;

  const body = {
    memberId: memberId,
    guildId: guildId,
  };

  return await axios.post(url, body);
};
