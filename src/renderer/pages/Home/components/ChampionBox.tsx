import React, { useEffect, useState } from "react";
import ChampionsJson from "../../../../common/constant/champion_id_name_map.json";
interface Props {
  championId: number;
  count: number;
  victory: number;
}
const ChampionBox = (props: Props) => {
  const [champions] = useState<ChampionsMap>(ChampionsJson);
  const championId = props.championId.toString();
  const championName = champions[championId as keyof ChampionsMap];
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="rounded-full bg-gray-700 w-8 h-8 flex items-center justify-center text-sm font-bold text-gray-200">
          <img
            src={`${process.env.SERVER_URL}/public/champions/${props.championId}.png`}
            width={80}
            height={80}
            alt={championName}
          />
        </div>
        <div>
          <div className="font-medium text-gray-200">{championName}</div>
          <div className="text-sm text-gray-400">
            승률 : {((props.victory / props.count) * 100).toFixed(2)}%
          </div>
        </div>
      </div>
      <div className="text-2xl font-bold text-gray-200">
        {props.count}
        <span className="text-[10px]">판</span>
      </div>
    </div>
  );
};

export default ChampionBox;
