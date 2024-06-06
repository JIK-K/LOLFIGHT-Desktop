import React from "react";
import { useLcuData } from "../../../components/LcuContext";
import "./SummonerRank.scss";

interface Props {
  rankText: string;
  LeagueTier: string;
  LeagueDivision: string;
  LeaguePoint: number;
}

const SummonerRank = (props: Props) => {
  const lcuData = useLcuData();
  return (
    // <div className="rounded-lg border text-card-foreground shadow-sm bg-gray-800 border-gray-700">
    // <div className="flex flex-col space-y-1.5 p-6 border-b border-gray-700 px-6 py-4">
    <div>
      <div className="">{props.rankText}</div>
      <div className="flex">
        <img
          src={`${process.env.SERVER_URL}/public/rank/${props.LeagueTier}.png`}
          width={80}
          height={80}
        />
        <div className="items-center m-auto">
          <span>{props.LeagueTier}</span>
          {props.LeagueTier !== "UNRANKED" && (
            <span>
              &nbsp;{props.LeagueDivision} {props.LeaguePoint}LP
            </span>
          )}
        </div>
      </div>
    </div>
    // </div>
  );
};

export default SummonerRank;
