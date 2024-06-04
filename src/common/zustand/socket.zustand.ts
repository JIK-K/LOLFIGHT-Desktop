import { create } from "zustand";
import { MemberDTO } from "../DTOs/member/member.dto";
import { Socket } from "socket.io-client";

interface SocketStore {
  socket: Socket | undefined;
  setSocket: (socket: Socket) => void;
}

const useSocketStore = create<SocketStore>((set) => ({
  socket: undefined,
  setSocket: (socket) => set({ socket }),
}));

export default useSocketStore;
