import React from "react";
import { Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

interface HexagonChartProps {
  kda: number;
  damage: number;
  kill: number;
  gold: number;
  visionScore: number;
  text: string;
}

const normalize = (value: number, min: number, max: number): number => {
  return Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));
};

const HexagonChart = (props: HexagonChartProps) => {
  // 정규화 범위 설정
  const kdaMin = 0;
  const kdaMax = 7;

  const damageMin = 0;
  const damageMax = 30000;

  const killMin = 0;
  const killMax = 8;

  const visionScoreMin = 0;
  const visionScoreMax = 75;

  const goldMin = 0;
  const goldMax = 20000;

  // 데이터 정규화
  const normalizedData = {
    kda: normalize(props.kda, kdaMin, kdaMax),
    damage: normalize(props.damage, damageMin, damageMax),
    kill: normalize(props.kill, killMin, killMax),
    gold: normalize(props.gold, goldMin, goldMax),
    visionScore: normalize(props.visionScore, visionScoreMin, visionScoreMax),
  };

  const chartData = {
    labels: ["KDA", "피해량", "전투", "성장", "시야"],
    datasets: [
      {
        label: props.text,
        data: [
          normalizedData.kda,
          normalizedData.damage,
          normalizedData.kill,
          normalizedData.gold,
          normalizedData.visionScore,
        ],
        backgroundColor: "rgba(0, 255, 0, 0.2)",
        borderColor: "#00ff00",
        borderWidth: 1,
        pointBackgroundColor: "#00ff00",
        pointBorderColor: "#00ff00",
        pointRadius: 3,
      },
    ],
  };
  const options = {
    elements: {
      line: {
        borderWidth: 3,
        borderColor: "#000000",
      },
    },
    scales: {
      r: {
        ticks: {
          stepSize: 20,
          display: false,
        },
        grid: {
          color: "#4B5563",
        },
        pointLabels: {
          font: {
            size: 13,
            family: "Pretendard",
          },
          color: "#FFFFFF",
        },
        angleLines: {
          color: "#4B5563",
        },
        suggestedMin: 0,
        suggestedMax: 100,
      },
    },
    plugins: {
      legend: { display: false },
      datalabels: {
        display: false,
      },
    },
  };

  return <Radar data={chartData} options={options} />;
};

export default HexagonChart;
