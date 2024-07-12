import React from "react";
import { GuildInviteDTO } from "../../../../common/DTOs/guild/guild_invite.dto";
import { inviteAccept, inviteReject } from "../../../../api/guild.api";
import toast from "react-hot-toast";

interface Props {
  inviteMembers: GuildInviteDTO[];
}

const GuildApplicant = (props: Props) => {
  const acceptMember = (member: GuildInviteDTO) => {
    inviteAccept(member.memberId!.id, member.guildId!.id)
      .then((response) => {
        toast.success(`${member.memberId.memberName} 가입 수락 완료`);
      })
      .catch((error) => {
        toast.error("이미 길드에 가입되었거나, 길드에 속한 멤버입니다.");
      });
  };
  const rejectMember = (member: GuildInviteDTO) => {
    inviteReject(member.memberId!.id, member.guildId!.id)
      .then((response) => {
        toast.success(`${member.memberId.memberName} 가입 거절 완료`);
      })
      .catch((error) => {
        toast.error("이미 거절한 멤버입니다.");
      });
  };
  return (
    <div className="absolute mt-2 p-2 w-[500px] min-h-full bg-gray-950 rounded-lg border border-gray-700">
      {props.inviteMembers.length > 0 ? (
        <div className="flex flex-col">
          {props.inviteMembers.map((member, index) => (
            <div
              className="flex font-light text-[16px] hover:bg-gray-800 p-1 rounded gap-1"
              key={index}
            >
              <div className="w-[180px] items-center">
                {member.memberId.memberName}
              </div>
              <div className="w-[180px] items-center">
                {member.memberId.memberGame?.gameName}
              </div>
              <div className="w-[40px] items-center">
                <button
                  className="flex items-center text-16px font-semibold hover:text-blue-700"
                  onClick={() => acceptMember(member)}
                >
                  수락
                </button>
              </div>
              <div className="w-[40px] items-center">
                <button
                  className="flex items-center text-16px font-semibold hover:text-red-500"
                  onClick={() => rejectMember(member)}
                >
                  거절
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>가입신청자가 없습니다.</div>
      )}
    </div>
  );
};

export default GuildApplicant;
