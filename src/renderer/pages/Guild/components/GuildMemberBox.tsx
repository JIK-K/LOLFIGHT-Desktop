import React from "react";
import { MemberDTO } from "../../../../common/DTOs/member/member.dto";

interface Props {
  member: MemberDTO;
}

const GuildMemberBox = (props: Props) => {
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
      {props.member.memberName}
    </div>
  );
};

export default GuildMemberBox;
