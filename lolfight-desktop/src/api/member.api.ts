import constant from "../common/constant/constant";
import { MemberDTO } from "../common/DTOs/member/member.dto";
import axios, { Axios, AxiosResponse } from "axios";
import { ResponseDTO } from "../common/DTOs/response.dto";

const baseUrl = `${process.env.REACT_APP_SERVER_URL}/member`;

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
  console.log(process.env.REACT_APP_SERVER_URL);
  let queryParams = `?id=${id}&pw=${pw}`;
  url += queryParams;

  return await axios.get(url);
};
