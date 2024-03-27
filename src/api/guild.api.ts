import axios, { Axios, AxiosResponse } from "axios";
import { MemberDTO } from "../common/DTOs/member/member.dto";
import { ResponseDTO } from "../common/DTOs/response.dto";

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
