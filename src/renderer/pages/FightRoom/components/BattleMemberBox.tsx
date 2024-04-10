import React from "react";
import "./BattleMemberBox.scss";
import { MemberDTO } from "../../../../common/DTOs/member/member.dto";

interface Props {
  member: MemberDTO;
}
const BattleMemberBox = (props: Props) => {
  return (
    <div className="battle-member-container">
      <div className="member-guild-icon">
        <img
          src={`${process.env.SERVER_URL}/${props.member.memberGuild.guildIcon}`}
          width={50}
          height={50}
        />
      </div>
      <div className="member-name">{props.member.memberName}</div>
      <div className="member-lol-info">
        <img
          src={`${process.env.SERVER_URL}/public/rank/${
            props.member.memberGame.gameTier.split(" ")[0]
          }.png`}
          width={40}
          height={40}
        />
        {props.member.memberGame.gameName}
      </div>
      <div></div>
    </div>
  );
};

export default BattleMemberBox;
