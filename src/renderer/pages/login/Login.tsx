// "use client";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../../api/member.api";
import CustomAlert from "../../../common/components/alert/CustomAlert";
import { toast } from "react-hot-toast";
import "./Login.scss";
const { ipcRenderer } = window.require("electron");

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
      .then((response: any) => {
        if (response.data.isSuccess === "T") {
          // CustomAlert("success", "로그인", "로그인 성공.");
          toast.success("로그인 성공");
          sessionStorage.setItem("id", response.data.data.id);
          sessionStorage.setItem("memberId", response.data.data.memberId);
          sessionStorage.setItem("memberName", response.data.data.memberName);
          navigate("/connect");
        } else {
          toast.success("로그인 실패");
          // CustomAlert("warning", "로그인", "아이디 비밀번호를 확인해주세요.");
        }
      })
      .catch((error: any) => {
        // CustomAlert("warning", "로그인", "아이디 비밀번호를 확인해주세요.");
        toast.success("error");
      });
  };

  const closeWindow = () => {
    ipcRenderer.send("close-window");
  };

  return (
    <div className="login-container">
      <div className="left-container">
        <div className="logo-container">
          {/* <p className="logo-text">LOL.FIGHT</p> */}
          <p className="logo-text">
            무자비하게 <br />
            우리와 함께하세요
          </p>
        </div>
        <div className="form-wrapper">
          <div className="input-field">
            <input type="text" placeholder="이메일" onChange={handleIdChange} />
          </div>
          <div className="input-field">
            <input
              type="password"
              placeholder="비밀번호"
              onChange={handlePwChange}
            />
          </div>
          <button className="login-btn" onClick={handleLoginClick}>
            로그인
          </button>
          <div className="link-container">
            <span className="link-item">
              <a
                href={`${process.env.SERVER_URL}/public/register`}
                target="_blank"
              >
                회원가입
              </a>
            </span>
            <span className="link-item">
              <a
                href={`${process.env.SERVER_URL}/public/register/find`}
                target="_blank"
              >
                비밀번호 찾기
              </a>
            </span>
          </div>
        </div>
        <div className="personal-agreement">개인 약관 설명</div>
      </div>
      <button type="button" className="button-close" onClick={closeWindow}>
        <img
          src={`${process.env.SERVER_URL}/public/close.png`}
          alt="close"
          height={20}
        />
      </button>
    </div>
  );
};

export default LoginPage;
