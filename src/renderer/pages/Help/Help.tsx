import React, { useEffect, useState } from "react";
import HowToPlayPage from "./components/HowToPlayPage";
import HowToRefreshPage from "./components/CautionPage";
import CautionPage from "./components/CautionPage";
const Help: React.FC = () => {
  const [currentPage, setCurrentPage] = useState("caution");

  const changePage = (page: string) => {
    setCurrentPage(page);
  };
  return (
    <div className="max-w-3xl mx-auto px-4 md:px-6 py-8 md:py-12">
      <div className="flex gap-4">
        {/* 네비게이션 */}
        <div className="setting-nav w-[200px] h-fit left-[80px] top-[81px] bg-gray-900 rounded-lg border border-gray-700">
          <div className="flex flex-col p-4 gap-2">
            <div className="text-xl pb-2 font-bold border-b border-gray-700">
              도움말
            </div>
            <div
              className="pt-2 cursor-pointer"
              onClick={() => changePage("caution")}
            >
              주의사항
            </div>
            <div
              className="cursor-pointer"
              onClick={() => changePage("howtoplay")}
            >
              길드전 방법
            </div>
          </div>
        </div>

        {/* 탭 */}
        {currentPage === "caution" && <CautionPage />}
        {currentPage === "howtoplay" && <HowToPlayPage />}
      </div>
    </div>
  );
};

export default Help;
