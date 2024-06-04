import { create } from "zustand";
import { FightingRoomDTO } from "../DTOs/room/FightingRoom.dto";

interface FightingRoomStore {
  fightingRoom: FightingRoomDTO | undefined;
  setFightingRoom: (fightingRoom: FightingRoomDTO) => void;
}

const useFightingRoomStore = create<FightingRoomStore>((set) => ({
  fightingRoom: undefined,
  setFightingRoom: (fightingRoom) => set({ fightingRoom }),
}));

export default useFightingRoomStore;
