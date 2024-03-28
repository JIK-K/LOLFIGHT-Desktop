import create from "zustand";
import { GuildDTO } from "../DTOs/guild/guild.dto";

// MemberDTO를 상태로 갖는 store를 생성합니다.
interface GuildStore {
  guild: GuildDTO | undefined;
  setGuild: (guild: GuildDTO) => void;
}

// Zustand를 사용하여 상태와 setter 함수를 생성합니다.
const useGuildStore = create<GuildStore>((set) => ({
  guild: undefined,
  setGuild: (guild) => set({ guild }),
}));

export default useGuildStore;
