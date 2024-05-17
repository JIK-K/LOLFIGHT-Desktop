import React from "react";
import "./BattleMemberBox.scss";
import { MemberDTO } from "../../../../common/DTOs/member/member.dto";
import { MatchMembersDTO } from "../../../../common/DTOs/room/matchMembers.dto";

interface Props {
  matchMember: MatchMembersDTO;
}
const BattleMemberBox = (props: Props) => {
  return (
    <div className="battle-member-container">
      <div className="member-guild-icon">
        <img
          src={`${process.env.SERVER_URL}/${props.matchMember.member.memberGuild.guildIcon}`}
          width={50}
          height={50}
        />
      </div>
      <div className="member-name">{props.matchMember.member.memberName}</div>
      <div className="member-lol-info">
        <img
          src={`${process.env.SERVER_URL}/public/rank/${
            props.matchMember.member.memberGame.gameTier.split(" ")[0]
          }.png`}
          width={40}
          height={40}
        />
        {props.matchMember.member.memberGame.gameName}
      </div>
      <div style={{ position: "relative" }}>
        {props.matchMember.isReady ? (
          <img
            src={`${process.env.SERVER_URL}/public/ok_ready.png`}
            alt="ok_ready"
            width={25}
            style={{
              position: "absolute",
              right: "5px",
              top: "50%",
              transform: "translateY(-50%)",
            }}
          />
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default BattleMemberBox;
