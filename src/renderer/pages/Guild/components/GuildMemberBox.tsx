import React from "react";
import { MemberDTO } from "../../../../common/DTOs/member/member.dto";

interface Props {
  member: MemberDTO;
  online: string[];
}

const GuildMemberBox = (props: Props) => {
  const isOnline = props.online.includes(props.member.memberName);

  const getGameTier = () => {
    if (props.member.memberGame === null) {
      return "UNRANKED";
    }
    return props.member.memberGame.gameTier.split(" ")[0];
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
      <img
        src={`${process.env.SERVER_URL}/public/rank/${getGameTier()}.png`}
        width={30}
        height={30}
      />
      <p style={{ margin: "0", color: isOnline ? "white" : "#3c3c3c" }}>
        {props.member.memberName}
      </p>
    </div>
  );
};

export default GuildMemberBox;
