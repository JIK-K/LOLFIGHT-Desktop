// "use client";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../../api/member.api";
import CustomAlert from "../../../common/components/alert/CustomAlert";
import "./Login.scss";
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
          CustomAlert("success", "로그인", "로그인 성공.");
          sessionStorage.setItem("id", response.data.data.id);
          sessionStorage.setItem("memberId", response.data.data.memberId);
          sessionStorage.setItem("memberName", response.data.data.memberName);
          navigate("/connect");
        } else {
          CustomAlert("warning", "로그인", "아이디 비밀번호를 확인해주세요.");
        }
      })
      .catch((error: any) => {
        CustomAlert("warning", "로그인", "아이디 비밀번호를 확인해주세요.");
      });
  };

  return (
    <div className="login-container">
      <div className="logo-container">
        <p className="logo-text">LOL.FIGHT</p>
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
            <a href="http://localhost:4000/register" target="_blank">
              회원가입
            </a>
          </span>
          <span className="link-item">
            <a href="http://localhost:4000/register/find" target="_blank">
              비밀번호 찾기
            </a>
          </span>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
