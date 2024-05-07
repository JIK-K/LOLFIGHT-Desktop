import { BaseDTO } from "../base.dto";
import { BattleTeamDTO } from "./battle_team.dto";

export interface BattleDTO extends BaseDTO {
  id: string;
  gameId: number;
  gameMode: string;
  teams: BattleTeamDTO[];
}
