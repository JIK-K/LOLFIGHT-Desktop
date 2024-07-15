import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { connect } from "../../utils/ipcBridge";
import { Button } from "../../components";
import { toast } from "react-hot-toast";

import "./Connect.scss";
import useMemberStore from "../../../common/zustand/member.zustand";
import { findMember } from "../../../api/member.api";

const Connect: React.FC = () => {
  const navigate = useNavigate();
  const { ipcRenderer } = window.require("electron");
  const { member, setMember } = useMemberStore();
  const [status, setStatus] = useState<string>("Connect");

  const handleConnect = () => {
    connect(navigate).then(
      () => {
        navigate("/home");
        toast.success("Connected");
        findMember(sessionStorage.getItem("memberId")).then((response) => {
          setMember(response.data.data);
        });
      },
      () => {
        toast.error("❌ 롤 클라이언트에 로그인후 시도해주세요.");
        navigate(-1);
        setStatus("Try again");
      }
    );
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      handleConnect();
    }, 3000);

    return () => clearInterval(intervalId);
  }, []);

  const closeWindow = () => {
    ipcRenderer.send("close-window");
  };

  return (
    <div className="connect-page">
      <div className="content">
        <img
          src={`${process.env.SERVER_URL}/public/image/icon.png`}
          className="h-[100px]"
        />
        <div className="loader"></div>
      </div>
      <button type="button" className="button-option" onClick={closeWindow}>
        {/* <img
          src={`${process.env.SERVER_URL}/public/close.png`}
          alt="close"
          height={20}
        /> */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18 18 6M6 6l12 12"
          />
        </svg>
      </button>
      <span className="version">v.1.1.0</span>
    </div>
  );
};

export default Connect;
