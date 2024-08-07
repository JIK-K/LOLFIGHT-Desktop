import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { deleteMember } from "../../../../api/member.api";

const CautionPage = () => {
  const navigate = useNavigate();
  const [checked, setChecked] = useState(false);

  const handleCheckboxChange = () => {
    setChecked(!checked);
  };

  return (
    <div className="w-full">
      <div>
        <p className="py-3 text-2xl font-bold border-b border-gray-700">
          LOLFIGHT Desktop 이용간 주의사항
        </p>
      </div>

      <div className="flex flex-col items-center py-3">
        <div className="font-medium self-start">▷ 새고로침</div>
        <div className="flex flex-col p-2 gap-5">
          <div>
            <span className="text-sky-400 dark:text-sky-700 font-bold">
              LOL 데이터 및 길드 관련
            </span>
            <p className="text-sm">
              LOL 클라이언트의 정보 및 길드 가입신청/수락에 관련하여 새롭게
              갱신이 되지 않는 경우에 '홈' 탭으로 가셔서 본인의 소환사명 옆의
              새로고침 아이콘을 눌러주시면 해결됩니다.
            </p>
          </div>
          <img
            src={`${process.env.SERVER_URL}/public/image/refresh.png`}
            className="rounded-lg border-2 border-gray-700"
            alt="GuildIcon"
          />
        </div>
      </div>

      <div className="flex flex-col items-center py-3">
        <div className="font-medium self-start">▷ 스크림 / 내전</div>
        <div className="flex flex-col p-2 gap-5">
          <div>
            <span className="text-sky-400 dark:text-sky-700 font-bold">
              스크림 / 내전 결과 저장 관련
            </span>
            <p className="text-sm">
              LOLFIGHT-Desktop으로 스크림 / 내전 진행후 넥서스가 깨질때 Alt+F4를
              눌러서 결과창으로 이동할 시 전적이 LOLFIGHT에 저장되지 않을 수
              있습니다. 되도록이면 Alt+F4 사용을 자제해주시기 바랍니다.
            </p>
          </div>
          <div>
            <span className="text-sky-400 dark:text-sky-700 font-bold">
              LOL 커스텀방 관련
            </span>
            <p className="text-sm">
              LOLFIGHT 길드전 진행 과정중 LOL 클라이언트의 커스텀 방이 생성된
              후에 각팀이 알맞은 위치로 이동하여야 내전 결과가 저장됩니다.
              <br />
              커스텀방 제목의 '[길드명1] vs [길드명2]' 로 되어있는데 이 위치에
              맞게 블루-레드 진영을 따라야 합니다.
              <br />
              <span className="font-extrabold">
                ex) [길드명1]-블루팀-(왼쪽) [길드명2]-레드팀-(오른쪽)
              </span>
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center py-3">
        <div className="font-medium self-start">▷ LOL계정 관련</div>
        <div className="flex flex-col p-2 gap-5">
          <div>
            <span className="text-sky-400 dark:text-sky-700 font-bold">
              LOL 소환사 계정 관련
            </span>
            <p className="text-sm">
              LOL 클라이언트의 정보를 기반으로 하기 때문에, 롤 계정명을 등록하고
              이후 다른 계정으로 접속했을시 길드전에 참여할 수 없습니다. '설정'
              탭으로 가셔서 '롤 계정 등록' 탭으로 이동후 '현재 등록된 계정' 과
              '현재 로그인한 계정'이 동일하도록 설정해주세요.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CautionPage;
