import React, { useEffect, useState } from "react";
import { useLocation, NavLink } from "react-router-dom";
import { useLcuData } from "./LcuContext";
import { Badge, SummonerIcon } from "../components";
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
  const location = useLocation();
  const lcuData = useLcuData();
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

  return (
    <div
      className="sticky bg-gray-900 flex top-0 z-10 md:px-6 h-16 font-bold text-xl items-center border-b border-gray-800"
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
      <div className="profile">
        <SummonerIcon
          size={35}
          iconId={lcuData.me.icon}
          availability={lcuData.me.availability}
        />
        {/* {lcuData.me.name} <span className="id">#{lcuData.me.gameTag}</span> */}
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
      <div className="bg-red-500 flex h-4">
        <button type="button" className="w-6 h-6" onClick={minimizeWindow}>
          <img
            className="text-white bg-white"
            src={`${process.env.SERVER_URL}/public/minimize.png`}
          />
        </button>
        <button type="button" className="w-4 h-4" onClick={closeWindow}>
          <img
            className="bg-white"
            src={`${process.env.SERVER_URL}/public/close.png`}
            alt="close"
          />
        </button>
      </div>
    </div>
  );
};

export default NavBar;
