import React from "react";

const ProfilePage = () => {
  return (
    <div>
      <div>
        <p className="py-3 text-2xl font-bold border-b border-blue-800">
          회원 정보
        </p>
      </div>
      <div className="flex flex-col py-3 font-light">
        <div className="font-medium pb-2">▷ 개인정보</div>
        <div className="flex border-y border-gray-700">
          <div className="w-[200px] bg-gray-800 py-2 px-3">롤파이트ID</div>
          <div className="py-2 px-2">이메일@이메일.com</div>
        </div>
        <div className="flex border-b border-gray-700">
          <div className="w-[200px] bg-gray-800 py-2 px-3">닉네임</div>
          <div className="py-2 px-2">닉네임임</div>
        </div>
        <div className="flex border-b border-gray-700">
          <div className="w-[200px] bg-gray-800 py-2 px-3">길드</div>
          <div className="py-2 px-2">길드이름</div>
        </div>
        <div className="flex border-b border-gray-700">
          <div className="w-[200px] bg-gray-800 py-2 px-3">소환사명</div>
          <div className="py-2 px-2">이차가식기전에</div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
