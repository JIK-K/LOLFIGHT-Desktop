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
    <div className="rank-banner">
      <div className="rank-type">{props.rankText}</div>
      <div className="rank-data">
        <img
          src={`${process.env.SERVER_URL}/public/rank/${props.LeagueTier}.png`}
          width={80}
          height={80}
        />
        <div className="rank-score">
          <div className="rank-tier">
            <p>
              {props.LeagueTier}
              {props.LeagueDivision}
            </p>
            <p>{props.LeaguePoint}LP</p>
          </div>
          <progress
            id="progress"
            value={props.LeaguePoint}
            max="100"
          ></progress>
        </div>
      </div>
    </div>
  );
};

export default SummonerRank;
