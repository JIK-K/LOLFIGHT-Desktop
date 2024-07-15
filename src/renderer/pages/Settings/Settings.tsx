import React, { useEffect, useState } from "react";
import "./Settings.scss";
import ProfilePage from "./components/ProfilePage";
import ChangePasswordPage from "./components/ChangePasswordPage";
import SummonerChangePage from "./components/SummonerChangePage";
import SecessionPage from "./components/SecessionPage";
import useMemberStore from "../../../common/zustand/member.zustand";
import { useLcuData } from "../../../renderer/components/LcuContext";

const Settings: React.FC = () => {
  const [currentPage, setCurrentPage] = useState("profile");
  const lcuData = useLcuData();
  const { member } = useMemberStore();

  const changePage = (page: string) => {
    setCurrentPage(page);
  };
  return (
    <div className="max-w-3xl mx-auto py-4">
      <div className="flex flex-col h-full w-full bg-gray-900 p-3">
        <div className="fixed w-[200px] h-[220px] left-[80px] top-[81px] bg-gray-900">
          <div className="flex flex-col p-4 gap-2">
            <div className="py-3 text-xl font-bold border-b border-blue-800">
              설정
            </div>
            <div
              className="pt-2 cursor-pointer"
              onClick={() => changePage("profile")}
            >
              회원 정보
            </div>
            <div
              className="cursor-pointer"
              onClick={() => changePage("password")}
            >
              비밀번호 변경
            </div>
            <div
              className="cursor-pointer"
              onClick={() => changePage("gameaccount")}
            >
              롤 계정 등록
            </div>
            <div
              className="cursor-pointer"
              onClick={() => changePage("secession")}
            >
              회원 탈퇴
            </div>
          </div>
        </div>
        {currentPage === "profile" && <ProfilePage member={member} />}
        {currentPage === "password" && <ChangePasswordPage member={member} />}
        {currentPage === "gameaccount" && (
          <SummonerChangePage member={member} lcuData={lcuData} />
        )}
        {currentPage === "secession" && <SecessionPage member={member} />}
      </div>
    </div>
  );
};

export default Settings;
