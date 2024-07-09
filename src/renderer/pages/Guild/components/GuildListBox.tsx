import React from "react";
import { GuildDTO } from "../../../../common/DTOs/guild/guild.dto";

interface Props {
  guild: GuildDTO[];
}
const GuildListBox = (props: Props) => {
  return (
    <div>
      {props.guild &&
        props.guild.map((guild, index) => (
          <div key={index} className="flex px-4 py-2 gap-1 items-center">
            <div className="flex w-[200px] text-center items-center justify-center gap-2">
              <img
                src={`${process.env.SERVER_URL}/${guild.guildIcon}`}
                width={30}
                height={30}
              />
              {guild.guildName}
            </div>
            <div className="flex w-[130px] text-center items-center justify-center font-light gap-1">
              <img
                src={`${process.env.SERVER_URL}/public/rank/${guild.guildTier}.png`}
                width={30}
                height={30}
              />
              {guild.guildRecord.recordLadder}점
            </div>
            <div className="w-[70px] text-center text-gray-300 text-sm">
              {guild.guildMembers} / 50
            </div>
            <div className="w-[100px] text-center">{guild.guildMaster}</div>
            <div className="flex w-[100px] items-center justify-center">
              <button className="border border-blue-950 hover:border-white bg-blue-950 rounded-lg px-4 py-2 text-white font-light">
                정보보기
              </button>
            </div>
            <div className="border border-blue-950 hover:border-white bg-blue-950 rounded-lg px-4 py-2 text-white font-light">
              <button>가입신청</button>
            </div>
          </div>
        ))}
    </div>
  );
};

export default GuildListBox;
