import { BaseDTO } from "../base.dto";
import { BattlePlayerDTO } from "./battle_player.dto";

export interface BattleTeamDTO extends BaseDTO {
  id: string;
  isPlayerTeam: boolean;
  isWinningTeam: boolean;
  players: BattlePlayerDTO[];
  stats: any;
  teamId: number;
}
