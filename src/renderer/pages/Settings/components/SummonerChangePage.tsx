import React from "react";
import toast from "react-hot-toast";
import { MemberDTO } from "../../../../common/DTOs/member/member.dto";
import { deleteSummonerData, update } from "../../../../api/member.api";
import useMemberStore from "../../../../common/zustand/member.zustand";
import { MemberGameDTO } from "../../../../common/DTOs/member/member_game.dto";

interface Props {
  member: MemberDTO;
  lcuData: any;
}

const SummonerChangePage = (props: Props) => {
  const { member, setMember } = useMemberStore();
  const changeSummoner = () => {
    const memberGame: MemberGameDTO = {
      gameName: props.lcuData.me.gameName + "#" + props.lcuData.me.gameTag,
      gameTier:
        props.lcuData.me.lol.rankedLeagueTier +
        " " +
        props.lcuData.me.lol.rankedLeagueDivision,
      summonerId: props.lcuData.me.summonerId,
    };
    if (props.lcuData.me.lol.rankedLeagueTier === undefined) {
      memberGame.gameTier = "UNRANKED";
    }
    update(
      member.id,
      member.memberId,
      null,
      member.memberName,
      member.memberGuild,
      memberGame
    )
      .then((response) => {
        setMember(response.data.data);
        toast.success("LOLFIGHT의 롤 계정이 변경/등록 되었습니다");
      })
      .catch((error) => {
        console.log(error);
        toast.success("이미 등록되어있는 소환사 계정입니다");
      });
  };
  const deleteSummoner = () => {
    deleteSummonerData(props.member.memberId)
      .then((response) => {
        console.log(response);
        setMember(response.data.data);
        toast.success("LOLFIGHT의 롤 계정이 삭제 되었습니다");
      })
      .catch((error) => {
        toast.error("롤계정삭제에러");
      });
  };

  return (
    <div>
      <div>
        <p className="py-3 text-2xl font-bold border-b border-blue-800">
          롤 계정 정보
        </p>
      </div>
      <div className="flex flex-col py-3 font-light">
        <div className="font-medium pb-2">▷ 롤 연동 계정 변경</div>
        <div className="flex border-y border-gray-700">
          <div className="w-[250px] bg-gray-800 py-2 px-3">
            현재 등록된 계정
          </div>
          <div className="py-2 px-2">{props.member.memberGame?.gameName}</div>
        </div>
        <div className="flex border-y border-gray-700">
          <div className="w-[250px] bg-gray-800 py-2 px-3">
            현재 로그인한 계정
          </div>
          <div className="py-2 px-2">
            {props.lcuData.me.gameName + "#" + props.lcuData.me.gameTag}
          </div>
        </div>
        <div className="flex border-y border-gray-700">
          <div className="w-[250px] bg-gray-800 py-2 px-3">
            지금 로그인한 계정으로 변경
          </div>
          <button
            className="w-[100px] bg-lime-500 rounded m-1 self-center "
            onClick={changeSummoner}
          >
            변경 하기
          </button>
        </div>
        <div className="flex border-y border-gray-700">
          <div className="w-[250px] bg-gray-800 py-2 px-3">
            등록한 롤 계정 삭제
          </div>
          <button
            className="w-[100px] bg-red-500 rounded m-1 self-center "
            onClick={deleteSummoner}
          >
            삭제하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default SummonerChangePage;
