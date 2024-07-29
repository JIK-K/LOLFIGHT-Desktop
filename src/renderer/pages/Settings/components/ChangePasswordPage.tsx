import React, { useState } from "react";
import toast from "react-hot-toast";
import { MemberDTO } from "../../../../common/DTOs/member/member.dto";
import { login, update } from "../../../../api/member.api";
import { useNavigate } from "react-router-dom";

interface Props {
  member: MemberDTO;
}

const ChangePasswordPage = (props: Props) => {
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");

  const handleCurrentPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentPassword(e.target.value);
  };
  const handleNewPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPassword(e.target.value);
  };

  const handleChangeButton = () => {
    if (currentPassword && newPassword) {
      login(props.member.memberId, currentPassword)
        .then((response) => {
          if (response.data.isSuccess === "F") {
            toast.error("현재 비밀번호를 확인해주세요.");
            return;
          } else {
            if (newPassword.length < 8) {
              toast.error("비밀번호는 8글자 이상 작성해주세요.");
              return;
            } else {
              const member: MemberDTO = props.member;
              member.memberPw = newPassword;
              update(
                member.id,
                member.memberId,
                member.memberPw,
                member.memberName,
                member.memberGuild,
                member.memberGame
              )
                .then((response) => {
                  toast.success("성공적으로 비밀번호를 변경했습니다.");
                  sessionStorage.clear();
                  navigate("/");
                })
                .catch((error) => {
                  toast.error("비밀번호변경에러");
                });
            }
          }
        })
        .catch((error) => {
          toast.error("비밀번호변경에러");
        });
    } else {
      toast.error("정보를 모두 작성해주세요.");
    }
  };

  return (
    <div className="w-full">
      <div>
        <p className="py-3 text-2xl font-bold border-b border-gray-700 items-center">
          비밀번호 변경
        </p>
      </div>

      <div className="flex flex-col py-3">
        <div className="font-medium self-start pb-2">▷ 비밀번호 변경</div>

        <div className="flex border-y border-gray-700 mb-1">
          <div className="flex py-2 w-[200px] bg-gray-800 p-2 justify-center">
            현재 비밀번호
          </div>
          <input
            className="p-2 w-full bg-gray-950"
            placeholder="현재 비밀번호를 입력하세요."
            type="password"
            onChange={handleCurrentPassword}
          ></input>
        </div>

        <div className="flex  border-y border-gray-700">
          <div className="flex py-2 w-[200px] bg-gray-800 p-2 justify-center">
            새 비밀번호
          </div>
          <input
            className="p-2 w-full bg-gray-950"
            placeholder="새 비밀번호를 입력하세요."
            type="password"
            onChange={handleNewPassword}
          ></input>
        </div>

        <button
          className="w-40 bg-blue-500 rounded p-2 self-center mt-3"
          onClick={handleChangeButton}
        >
          <p className="text-white font-bold">비밀번호 변경</p>
        </button>
      </div>
    </div>
  );
};

export default ChangePasswordPage;
