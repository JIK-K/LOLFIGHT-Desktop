import { BaseDTO } from "../base.dto";

export interface GuildInviteDTO extends BaseDTO {
  id: string;
  memberId: string;
  guildId: string;
}
