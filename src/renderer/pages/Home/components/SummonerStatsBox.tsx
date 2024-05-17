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
    <div className="stats-box">
      <span style={{ fontSize: "23px", color: textColor }}>{props.value}</span>
      <span>{props.stats}</span>
    </div>
  );
};

export default SummonerStatsBox;
