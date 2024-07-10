import React, { useEffect } from "react";
import "./Battle.scss";
import { createWebSocketConnection } from "league-connect";
import { recordBattle } from "../../../api/battle.api";
import { Blur } from "../../../renderer/components";

const Battle: React.FC = () => {
  const testPlayMp3 = () => {
    const audio = new Audio(`${process.env.SERVER_URL}/public/sound/test.mp3`);
    audio.volume = 0.2; // 볼륨 조절 (0.0 ~ 1.0)
    audio.play();
  };

  return (
    <div className="relative">
      <Blur />
      <div className="max-w-3xl mx-auto grid gap-8 px-4 md:px-6 py-8 md:py-12">
        <div className="grid gap-2">
          <div className="flex flex-col rounded-lg border text-card-foreground shadow-sm bg-gray-800 border-gray-700">
            <div className="w-full h-32">
              <img
                src={`${process.env.SERVER_URL}/public/다리우스.png`}
                alt="close"
                className="rounded-t-lg h-32 object-none w-full object-top"
              />
            </div>
            <div className="border-b border-gray-700 space-y-1.5 px-6 py-4 bg-gray-900">
              <h3 className="text-lg font-bold text-gray-20">공식리그</h3>
            </div>
            <div className="flex justify-between items-center gap-4 px-6 py-4">
              <div>
                <div className="font-medium text-gray-200">
                  롤파이트배 공식 리그
                </div>
                <div className="text-sm text-gray-400">Rank: #SSS</div>
              </div>
              <div>LOLFIGHT</div>
              <div className="">1.7k</div>
              <button
                className="border border-gray-800 bg-blue-950 rounded-lg px-4 py-2 text-white font-bold"
                onClick={testPlayMp3}
              >
                참여하기
              </button>
            </div>
          </div>
        </div>
        <div className="flex flex-col rounded-lg border text-card-foreground shadow-sm bg-gray-800 border-gray-700">
          <div className="border-b border-gray-700 space-y-1.5 px-6 py-4 bg-gray-900 rounded-t-lg">
            <h3 className="text-lg font-bold text-gray-20">사설리그</h3>
          </div>
          <div className="flex justify-between items-center gap-4 px-6 py-4">
            <div className="font-medium text-gray-200 w-1/4">
              사나이배 2024 썸머 리그
              <div className="text-sm text-gray-400">Rank: #A</div>
            </div>
            <div className="w-1/4 justify-center items-center flex">
              LOLFIGHT
            </div>
            <div className="w-1/4 justify-center items-center flex">0k</div>
            <button
              className="mx-auto border border-gray-800 bg-blue-950 rounded-lg px-4 py-2 text-white font-bold"
              onClick={testPlayMp3}
            >
              참여하기
            </button>
          </div>
          <div className="flex justify-between items-center gap-4 px-6 py-4">
            <div className="font-medium text-gray-200 w-1/4">
              <div className="font-medium text-gray-200">똥배 리그</div>
              <div className="text-sm text-gray-400">Rank: #A</div>
            </div>
            <div className="w-1/4 justify-center items-center flex">
              LOLFIGHT
            </div>
            <div className="w-1/4 justify-center items-center flex">0k</div>
            <button
              className="mx-auto border border-gray-800 bg-blue-950 rounded-lg px-4 py-2 text-white font-bold"
              onClick={testPlayMp3}
            >
              참여하기
            </button>
          </div>
          <div className="flex justify-between items-center gap-4 px-6 py-4">
            <div className="font-medium text-gray-200 w-1/4">
              <div className="font-medium text-gray-200">
                프리티 2024 봉사 리그
              </div>
              <div className="text-sm text-gray-400">Rank: #A</div>
            </div>
            <div className="w-1/4 justify-center items-center flex">
              LOLFIGHT
            </div>
            <div className="w-1/4 justify-center items-center flex">0k</div>
            <button
              className="mx-auto border border-gray-800 bg-blue-950 rounded-lg px-4 py-2 text-white font-bold"
              onClick={testPlayMp3}
            >
              참여하기
            </button>
          </div>
          <div className="flex justify-between items-center gap-4 px-6 py-4">
            <div className="font-medium text-gray-200 w-1/4">
              <div className="font-medium text-gray-200">
                갈아먹는배 2024 해장 리그
              </div>
              <div className="text-sm text-gray-400">Rank: #A</div>
            </div>
            <div className="w-1/4 justify-center items-center flex">
              LOLFIGHT
            </div>
            <div className="w-1/4 justify-center items-center flex">0k</div>
            <button
              className="mx-auto border border-gray-800 bg-blue-950 rounded-lg px-4 py-2 text-white font-bold"
              onClick={testPlayMp3}
            >
              참여하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Battle;
