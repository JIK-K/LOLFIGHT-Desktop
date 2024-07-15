import React from "react";
import toast from "react-hot-toast";

const SummonerChangePage = () => {
  const changeSummoner = () => {
    toast.success("LOLFIGHT의 롤 계정이 변경 되었습니다");
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
          <div className="py-2 px-2">이차가 식기전에#KR1</div>
        </div>
        <div className="flex border-y border-gray-700">
          <div className="w-[250px] bg-gray-800 py-2 px-3">
            현재 로그인한 계정
          </div>
          <div className="py-2 px-2">TheFaker#KR1</div>
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
      </div>
    </div>
  );
};

export default SummonerChangePage;
