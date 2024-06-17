import { create } from "zustand";
import { GuildDTO } from "../DTOs/guild/guild.dto";

interface GuildStore {
  guild: GuildDTO | undefined;
  setGuild: (guild: GuildDTO) => void;
}

const useGuildStore = create<GuildStore>((set) => ({
  guild: undefined,
  setGuild: (guild) => set({ guild }),
}));

export default useGuildStore;
