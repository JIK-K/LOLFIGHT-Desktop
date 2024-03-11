import React from "react";
import { useLocation, NavLink } from "react-router-dom";
import { useLcuData } from "./LcuContext";
import { Badge, SummonerIcon } from "../components";

interface NavItemProps {
  title: string;
  href: string;
}

const NavItem: React.FC<NavItemProps> = ({ title, href }) => {
  return (
    <NavLink
      to={href}
      className={({ isActive }) =>
        isActive ? "nav-item selected" : "nav-item"
      }
    >
      <span>{title}</span>
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

  // Hide navbar on connect page
  if (location.pathname === "/" || location.pathname === "/connect")
    return <></>;

  const getRankText = () => {
    const rank = lcuData.me.lol.rankedLeagueTier;
    const division = lcuData.me.lol.rankedLeagueDivision;

    return `${rank.charAt(0) + rank.substring(1).toLowerCase()} ${
      division === "NA" ? "" : division
    }`;
  };

  return (
    <div id="navbar">
      <div className="nav">
        <NavItem title="홈" href="/home" />
        {/* <NavItem title="Icon" href="/icons" />
        <NavItem title="Background" href="/backgrounds" /> */}
        <NavItem title="상태" href="/status" />
        {/* <NavItem title="Challenges" href="/challenges" /> */}
        {/* <NavItem title='Chat Rank' href='/rank' /> */}
        <NavItem title="설정" href="/settings" />
      </div>
      <div className="profile">
        <SummonerIcon
          size={35}
          iconId={lcuData.me.icon}
          availability={lcuData.me.availability}
        />
        {lcuData.me.name} <span className="id">#{lcuData.me.gameTag}</span>
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
      </div>
    </div>
  );
};

export default NavBar;