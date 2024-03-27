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
        toast.error("Connection failed!");
        setStatus("Try again");
      }
    );
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      handleConnect();
    }, 20000);

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
          height={200}
        />
        <div className="loader"></div>
      </div>
      <button type="button" className="button-option" onClick={closeWindow}>
        <img
          src={`${process.env.SERVER_URL}/public/close.png`}
          alt="close"
          height={20}
        />
      </button>
      <span className="version">v.1.0.0</span>
    </div>
  );
};

export default Connect;
