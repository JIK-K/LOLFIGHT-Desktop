import React from "react";
import { GuildDTO } from "../../../../common/DTOs/guild/guild.dto";

interface Props {
  guild: GuildDTO;
  onClose: () => void;
}

const GuildInfoBox = (props: Props) => {
  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[300px] h-[400px] bg-gray-950 rounded-lg border border-gray-700">
      <div className="flex flex-col p-4 relative">
        <button
          className="absolute top-2 right-2 text-white"
          onClick={props.onClose}
        >
          닫기
        </button>
        <div className="flex text-2xl mb-2 gap-2 items-center justify-center font-bold">
          <img
            src={`${process.env.SERVER_URL}/${props.guild.guildIcon}`}
            width={50}
            height={50}
          />
          {props.guild.guildName}
        </div>
        <div className="flex flex-col mb-2">
          <div className="border-b-2 border-white p-1 text-xl">상세정보</div>
          <div className="flex border-b-2 border-white p-1 text-32px justify-between">
            래더 : <p>{props.guild.guildRecord.recordLadder}점</p>
          </div>
          <div className="flex border-b-2 border-white p-1 text-32px justify-between">
            승률 :
            <p className="text-green-500">
              <span className="text-sm text-white">
                {props.guild.guildRecord.recordVictory}승{" "}
                {props.guild.guildRecord.recordDefeat}패
              </span>{" "}
              {isNaN(
                (props.guild.guildRecord.recordVictory! /
                  (props.guild.guildRecord.recordDefeat! +
                    props.guild.guildRecord.recordVictory!)) *
                  100
              )
                ? "기록없음"
                : `(${(
                    (props.guild.guildRecord.recordVictory! /
                      (props.guild.guildRecord.recordDefeat! +
                        props.guild.guildRecord.recordVictory!)) *
                    100
                  ).toFixed(2)}%)`}
            </p>
          </div>
          <div className="flex border-b-2 border-white p-1 text-32px justify-between">
            랭킹 :
            <p>
              <span className="text-sm">1부리그</span>{" "}
              {props.guild.guildRecord.recordRanking}등
            </p>
          </div>
        </div>

        <div className="flex flex-col">
          <div className="border-b-2 border-white p-1 text-xl">길드소개</div>
          <div className="p-1">{props.guild.guildDescription}</div>
        </div>
      </div>
    </div>
  );
};

export default GuildInfoBox;
