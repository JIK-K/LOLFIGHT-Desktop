import React, { useState } from "react";
import { GuildDTO } from "../../../../common/DTOs/guild/guild.dto";
import toast from "react-hot-toast";
import GuildInfoBox from "./GuildInfoBox";
import useMemberStore from "../../../../common/zustand/member.zustand";
import { GuildInviteDTO } from "../../../../common/DTOs/guild/guild_invite.dto";
import { inviteGuild } from "../../../../api/guild.api";

interface Props {
  guild: GuildDTO[];
}

const GuildListBox = (props: Props) => {
  const [infoOpen, setInfoOpen] = useState<number | null>(null);
  const { member } = useMemberStore();

  const viewGuildInfo = (index: number) => {
    setInfoOpen(index);
  };

  const closeGuildInfo = () => {
    setInfoOpen(null);
  };

  const joinGuild = (guild: GuildDTO) => {
    inviteGuild(member.id, guild.id)
      .then((response) => {
        toast.success("길드 가입신청이 완료되었습니다.");
      })
      .catch((error) => {
        toast.error("가입된 길드가 있거나, 이미 가입신청한 길드입니다.");
      });
  };

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
            <div>
              <button
                className="border border-blue-950 hover:border-white bg-blue-950 rounded-lg px-4 py-2 text-white font-light"
                onClick={() => viewGuildInfo(index)}
              >
                정보보기
              </button>
            </div>
            {infoOpen === index && (
              <GuildInfoBox guild={guild} onClose={closeGuildInfo} />
            )}
            <div>
              <button
                className="border border-blue-950 hover:border-white bg-blue-950 rounded-lg px-4 py-2 text-white font-light"
                onClick={() => joinGuild(guild)}
              >
                가입신청
              </button>
            </div>
          </div>
        ))}
    </div>
  );
};

export default GuildListBox;
