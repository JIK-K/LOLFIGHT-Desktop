"use client";
import React, { useState } from "react";
import logo from "../image/icon.png";
import { login } from "../api/member.api";
import CustomAlert from "../common/components/alert/CustomAlert";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();
  const [memberId, setMemberId] = useState("");
  const [memberPw, setMemberPw] = useState("");
  const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMemberId(e.target.value);
  };

  const handlePwChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMemberPw(e.target.value);
  };

  const handleLoginClick = () => {
    login(memberId, memberPw)
      .then((response) => {
        if (response.data.isSuccess === "T") {
          CustomAlert("success", "로그인", "로그인 성공.");
          sessionStorage.setItem("id", response.data.data.id);
          sessionStorage.setItem("memberId", response.data.data.memberId);
          sessionStorage.setItem("memberName", response.data.data.memberName);
          navigate("/main");
        } else {
          CustomAlert("warning", "로그인", "아이디 비밀번호를 확인해주세요.");
        }
      })
      .catch((error) => {
        CustomAlert("warning", "로그인", "아이디 비밀번호를 확인해주세요.");
      });
  };

  return (
    <div className="flex flex-col w-screen h-screen bg-brandcolor items-center justify-center">
      <div className="flex items-center gap-5">
        <img src={logo} alt="logo" />
        <p className="font-extrabold text-white text-3xl">LOL.FIGHT</p>
      </div>
      <div className="w-350px">
        <div className="border border-gray-200 rounded-md my-4">
          <input
            className="w-full h-10 rounded-md px-2 bg-gray-100"
            type="text"
            placeholder="이메일"
            onChange={handleIdChange}
          />
        </div>
        <div className="border border-gray-200 rounded-md my-4">
          <input
            className="w-full h-10 rounded-md px-2 bg-gray-100"
            type="password"
            placeholder="비밀번호"
            onChange={handlePwChange}
          />
        </div>
        <button
          className="flex font-extrabold bg-brandbgcolor text-brandcolor text-lg h-10 items-center justify-center rounded-md cursor-pointer my-4 w-full my-1"
          onClick={handleLoginClick}
        >
          로그인
        </button>
        <div className="flex justify-center mt-4">
          <span className="text-xs text-white font-bold mx-2">
            <a
              key={"회원가입"}
              href="http://localhost:4000/register"
              target="_blank"
            >
              회원가입
            </a>
          </span>
          <span className="h-4 w-1px mx-1 bg-gray-700"></span>
          <span className="text-xs text-white font-bold mx-2">
            <a
              key={"비밀번호 찾기"}
              href="http://localhost:4000/register/find"
              target="_blank"
            >
              비밀번호 찾기
            </a>
          </span>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
