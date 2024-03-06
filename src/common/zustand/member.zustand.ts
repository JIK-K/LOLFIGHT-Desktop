import create from "zustand";
import { MemberDTO } from "../DTOs/member/member.dto";

// MemberDTO를 상태로 갖는 store를 생성합니다.
interface MemberStore {
  member: MemberDTO | undefined;
  setMember: (member: MemberDTO) => void;
}

// Zustand를 사용하여 상태와 setter 함수를 생성합니다.
const useMemberStore = create<MemberStore>((set) => ({
  member: undefined,
  setMember: (member) => set({ member }),
}));

export default useMemberStore;
