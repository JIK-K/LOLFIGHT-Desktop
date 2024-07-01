import React from "react";
import "./BattleMemberBox.scss";
import { MatchMembersDTO } from "../../../../common/DTOs/room/matchMembers.dto";

interface Props {
  matchMember: MatchMembersDTO;
}
const BattleMemberBox = (props: Props) => {
  return (
    <div className="relative flex w-full h-16 p-1 flex items-center justify-between gap-1 rounded-3xl p-px bg-gradient-to-b from-gray-950 to-transparent">
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
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url(${process.env.SERVER_URL}/public/rank/${
            props.matchMember.member.memberGame.gameTier.split(" ")[0]
          }.png)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      ></div>

      <div className="z-10 flex items-center justify-between w-full text-white">
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
      </div>
    </div>
  );
};

export default BattleMemberBox;
