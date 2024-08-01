import React, { useEffect, useState } from "react";
import { useLocation, NavLink, useNavigate } from "react-router-dom";
import { useLcuData } from "./LcuContext";
import { Badge, SummonerIcon } from "../components";
import useMemberStore from "../../common/zustand/member.zustand";
import toast from "react-hot-toast";
const { ipcRenderer } = window.require("electron");
interface NavItemProps {
  title: string;
  href: string;
}

const NavItem: React.FC<NavItemProps> = ({ title, href }) => {
  const location = useLocation();
  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (location.pathname === "/fightroom") {
      event.preventDefault();
    }
  };

  return (
    <NavLink
      to={href}
      className={({ isActive }) =>
        isActive ? "nav-item selected" : "nav-item"
      }
      onClick={handleClick}
    >
      <span className="font-light text-base text-gray-400 hover:underline underline-offset-4 hover:text-gray-200">
        {title}
      </span>
    </NavLink>
  );
};

const RANK_CREST_URL =
  "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/images/ranked-mini-crests/";
const COLORS = new Map<string, string>([
  ["UNRANKED", "#404241"],
  ["IRON", "#6b6b64"],
  ["BRONZE", "#a46628"],
  ["SILVER", "#b5b5b5"],
  ["GOLD", "#d6a738"],
  ["PLATINUM", "#80aba4"],
  ["DIAMOND", "#71b0d1"],
  ["MASTER", "#7840a3"],
  ["GRANDMASTER", "#9e3342"],
  ["CHALLENGER", "#288fc7"],
]);

const NavBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const lcuData = useLcuData();
  const { setMember } = useMemberStore();
  const [isDrag, setIsDrag] = useState(false);
  const minimizeWindow = () => {
    ipcRenderer.send("minimize-window");
  };

  const closeWindow = () => {
    ipcRenderer.send("close-window");
  };

  const onMouseMove = (event: { screenX: any; screenY: any }) => {
    if (isDrag) {
      ipcRenderer.send("windowMouseMoving", {
        mouseX: event.screenX,
        mouseY: event.screenY,
      });
    }
  };

  const onMouseUp = () => {
    setIsDrag(false);
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
  };

  const onMouseDown = (event: { screenX: any; screenY: any }) => {
    setIsDrag(true);
    ipcRenderer.send("windowMouseDown", {
      startMouseX: event.screenX,
      startMouseY: event.screenY,
    });
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  // Hide navbar on connect page
  if (location.pathname === "/" || location.pathname === "/connect")
    return <></>;

  const getRankText = () => {
    const rank = lcuData.me.lol.rankedLeagueTier;
    const division = lcuData.me.lol.rankedLeagueDivision;

    if (rank === undefined) {
      return `UNRANKED`;
    } else {
      return `${rank.charAt(0) + rank.substring(1).toLowerCase()} ${
        division === "NA" ? "" : division
      }`;
    }
  };

  const logoutMember = () => {
    setMember(undefined);
    sessionStorage.clear();
    navigate("/");
    toast.success("로그아웃 되었습니다.");
  };

  return (
    <div
      className="sticky bg-gray-900 flex top-0 z-10 md:px-6 h-16 font-bold text-xl items-center border-b border-gray-800 gap-1"
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseMove={onMouseMove}
    >
      <div className="flex items-center gap-2">
        <p className="text-white h-6">LOLFIGHT</p>
      </div>
      <div className="ml-32 mr-auto flex gap-4 sm:gap-6">
        <NavItem title="홈" href="/home" />
        {/* <NavItem title="Icon" href="/icons" /> */}
        {/* <NavItem title="Background" href="/backgrounds" /> */}
        <NavItem title="길드" href="/guild" />
        <NavItem title="배틀" href="/battle" />
        <NavItem title="상태" href="/status" />
        {/* <NavItem title="Challenges" href="/challenges" /> */}
        {/* <NavItem title="Chat Rank" href="/rank" /> */}
        <NavItem title="설정" href="/settings" />
      </div>
      <div className="profile flex items-center gap-2">
        <SummonerIcon
          size={35}
          iconId={lcuData.me.icon}
          availability={lcuData.me.availability}
        />
        <p className="text-sm font-light">
          {lcuData.me.gameName}{" "}
          <span className="id">#{lcuData.me.gameTag}</span>
        </p>
        <div
          className="text-base font-normal justify-center rounded bg-gray-800 px-2 py-1 shadow-inner cursor-pointer hover:bg-gray-950"
          onClick={logoutMember}
        >
          로그아웃
        </div>
        {lcuData.me.lol.rankedLeagueTier === undefined ? (
          <Badge
            text={"UNRANKED"}
            icon={<img src={`${RANK_CREST_URL}unranked.svg`} alt="Rank" />}
            backgroundColor={COLORS.get("UNRANKED")}
          />
        ) : (
          <Badge
            text={getRankText()}
            icon={
              <img
                src={`${RANK_CREST_URL}${lcuData.me.lol.rankedLeagueTier.toLowerCase()}.svg`}
                alt="Rank"
              />
            }
            backgroundColor={COLORS.get(lcuData.me.lol.rankedLeagueTier)}
          />
        )}
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          className="text-gray-400"
          onClick={minimizeWindow}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
          </svg>
        </button>
        <button type="button" className="text-gray-400">
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
              d="M16.5 8.25V6a2.25 2.25 0 0 0-2.25-2.25H6A2.25 2.25 0 0 0 3.75 6v8.25A2.25 2.25 0 0 0 6 16.5h2.25m8.25-8.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-7.5A2.25 2.25 0 0 1 8.25 18v-1.5m8.25-8.25h-6a2.25 2.25 0 0 0-2.25 2.25v6"
            />
          </svg>
        </button>
        <button type="button" className="text-gray-400" onClick={closeWindow}>
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
      </div>
    </div>
  );
};

export default NavBar;
