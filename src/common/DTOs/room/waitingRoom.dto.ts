import { MatchMembersDTO } from "./matchMembers.dto";

export interface WaitingRoomDTO {
  members: MatchMembersDTO[];
  roomName: string;
  memberCount: number;
  isReady: boolean;
  status: string;
}
