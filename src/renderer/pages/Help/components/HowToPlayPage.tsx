import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { deleteMember } from "../../../../api/member.api";

const HowToPlayPage = () => {
  const navigate = useNavigate();
  const [checked, setChecked] = useState(false);

  const handleCheckboxChange = () => {
    setChecked(!checked);
  };

  return (
    <div className="w-full">
      <div>
        <p className="py-3 text-2xl font-bold border-b border-gray-700">
          스크림 / 내전 / 길드전 방법
        </p>
      </div>

      <div className="flex flex-col items-center py-3">
        <div className="font-medium self-start">▷ 길드전 방법</div>
        <div className="flex flex-col p-2 gap-5">
          <div>
            <span className="text-sky-400 dark:text-sky-700 font-bold">
              길드 생성
            </span>
            <p className="text-sm">
              LOLFIGHT 홈페이지로 이동하신 후 회원가입/로그인을 진행하신후에
              프로필로 이동하여 길드를 생성할 수 있습니다. 길드명은 중복이 되지
              않으며, 길드 이미지는 필수로 넣어주어야 합니다.
            </p>
          </div>
          <div>
            <span className="text-sky-400 dark:text-sky-700 font-bold">
              길드 내전방 생성 / 참여
            </span>
            <p className="text-sm">
              LOLFIGHT-Desktop의 '길드' 탭으로 이동하신후 길드전 방 목록에서
              생성되어있는 다른 길드원의 내전방에 참여하거나 직접 길드내전방
              생성 버튼을 눌러 내전방을 생성할 수 있습니다.
            </p>
          </div>
          <img
            src={`${process.env.SERVER_URL}/public/image/howtoplay1.png`}
            className="rounded-lg border-2 border-gray-700"
            alt="GuildIcon"
          />
          <div>
            <span className="text-sky-400 dark:text-sky-700 font-bold">
              길드전 준비완료 / 시작
            </span>
            <p className="text-sm">
              LOLFIGHT-Desktop의 내전방 생성후 매칭을 시작하면 무작위의 상대
              길드와 매칭이 됩니다. 방장 이외는 준비 / 상대 팀 찾기 /시작 버튼은
              보이지 않으며 오직 각팀의 방장만이 내전 준비완료 / 시작이
              가능합니다. <br />
              각팀의 방장이 준비완료를 누르면 상대팀 찾기 버튼은 게임 시작
              버튼으로 바뀌게 되며 각팀의 방장중 왕관이 씌여진 매치리더만이
              내전을 시작할 수 있습니다.
            </p>
          </div>
          <div>
            <span className="text-sky-400 dark:text-sky-700 font-bold">
              길드전 진영 변경
            </span>
            <p className="text-sm">
              LOLFIGHT-Desktop의 내전방의 중심에 보면 각 길드의 블루팀 / 레드팀
              진영을 변경할 수 있습니다. 매치리더의 팀이 블루팀이며 사설
              커스텀방의 왼쪽편에 위치하여야 합니다. 진영 변경또한 매치리더만이
              변경할 수 있습니다.
              <br />
              <p className="font-extrabold">
                <span className="text-blue-300">
                  [매치리더길드-왼쪽편-블루팀]
                </span>
                -
                <span className="text-red-400">[반대길드-오른쪽편-레드팀]</span>
              </p>
            </p>
          </div>
          <img
            src={`${process.env.SERVER_URL}/public/image/howtoplay2.png`}
            className="rounded-lg border-2 border-gray-700"
            alt="GuildIcon"
          />
        </div>
      </div>
    </div>
  );
};

export default HowToPlayPage;
