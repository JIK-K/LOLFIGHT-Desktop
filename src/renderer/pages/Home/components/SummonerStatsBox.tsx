import React from "react";
import "./SummonerStatsBox.scss";

interface Props {
  stats: string;
  value: string;
  text: string;
}

const getTextColor = (stats: string, value: string) => {
  if (stats === "KDA") {
    const numericValue = parseFloat(value);
    if (numericValue >= 4) {
      return "#ec1d1d";
    } else if (numericValue >= 3) {
      return "#006eff";
    } else if (numericValue >= 2) {
      return "#00ad00";
    } else {
      return "gray";
    }
  }
};

const SummonerStatsBox = (props: Props) => {
  const textColor = getTextColor(props.stats, props.value);

  return (
    <div className="rounded-lg border text-card-foreground shadow-sm bg-gray-800 border-gray-700">
      <div className="p-6 flex items-center justify-between">
        <span className="text-sm text-gray-400">{props.stats}</span>
        <span className="text-2xl font-bold text-gray-200">{props.value}</span>
      </div>
    </div>
  );
};

export default SummonerStatsBox;
