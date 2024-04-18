import { WaitingRoomDTO } from "./waitingRoom.dto";

export interface FightingRoomDTO {
  fightRoomName: string;
  team_A: WaitingRoomDTO;
  team_B: WaitingRoomDTO;
  ReadyCount: number;
  status: string;
}
