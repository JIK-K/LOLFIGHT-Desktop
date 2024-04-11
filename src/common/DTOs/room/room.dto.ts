import { MemberDTO } from "../member/member.dto";

export interface RoomDTO {
  members: MemberDTO[];
  roomName: string;
  memberCount: number;
  status: string;
}
