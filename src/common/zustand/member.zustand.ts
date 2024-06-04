import { create } from "zustand";
import { MemberDTO } from "../DTOs/member/member.dto";

interface MemberStore {
  member: MemberDTO | undefined;
  setMember: (member: MemberDTO) => void;
}

const useMemberStore = create<MemberStore>((set) => ({
  member: undefined,
  setMember: (member) => set({ member }),
}));

export default useMemberStore;
