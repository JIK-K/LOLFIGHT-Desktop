import React from "react";
import "./BattleMemberBox.scss";
import { MemberDTO } from "../../../../common/DTOs/member/member.dto";
import { MatchMembersDTO } from "../../../../common/DTOs/room/matchMembers.dto";

interface Props {
  matchMember: MatchMembersDTO;
}
const BattleMemberBox = (props: Props) => {
  return (
    <div className="flex w-full h-16 p-1 items-center justify-between bg-blue-500 gap-1">
      {props.matchMember.isLeader ? (
        <img
          src={`${process.env.SERVER_URL}/public/matchleader.png`}
          alt="matchLeader"
          width={25}
          style={{
            position: "absolute",
            transform: "translateY(-80%) translateX(-50%)",
          }}
        />
      ) : (
        ""
      )}
      {/* <img
          src={`${process.env.SERVER_URL}/${props.matchMember.member.memberGuild.guildIcon}`}
          width={50}
          height={50}
        /> */}
      <div className="">{props.matchMember.member.memberName}</div>
      <div className="flex items-center gap-1">
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
