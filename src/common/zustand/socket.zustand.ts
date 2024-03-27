import create from "zustand";
import { MemberDTO } from "../DTOs/member/member.dto";
import { Socket } from "socket.io-client";

// MemberDTO를 상태로 갖는 store를 생성합니다.
interface SocketStore {
  socket: Socket | undefined;
  setSocket: (socket: Socket) => void;
}

// Zustand를 사용하여 상태와 setter 함수를 생성합니다.
const useSocketStore = create<SocketStore>((set) => ({
  socket: undefined,
  setSocket: (socket) => set({ socket }),
}));

export default useSocketStore;
