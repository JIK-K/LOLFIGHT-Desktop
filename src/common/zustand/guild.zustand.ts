import { create } from "zustand";
import { persist } from "zustand/middleware";
import { GuildDTO } from "../DTOs/guild/guild.dto";

interface GuildStore {
  guild: GuildDTO | undefined;
  setGuild: (guild: GuildDTO) => void;
}

// Zustand를 사용하여 상태와 setter 함수를 생성합니다.
const useGuildStore = create(
  persist<GuildStore>(
    (set) => ({
      guild: undefined,
      setGuild: (guild) => set({ guild }),
    }),
    { name: "guild-store" }
  )
);

export default useGuildStore;
