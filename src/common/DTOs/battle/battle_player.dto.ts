import { BaseDTO } from "../base.dto";
import { BattleStatsDTO } from "./battle_stats.dto";

export interface BattlePlayerDTO extends BaseDTO {
  id: string;
  championId: number;
  detectedTeamPosition: string;
  items: number[];
  puuid: string;
  spell1Id: number;
  spell2id: number;
  summonerName: string;
  stats: BattleStatsDTO;
}
