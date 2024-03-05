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

const NavBar: React.FC = () => {
  const location = useLocation();
  const lcuData = useLcuData();

  // Hide navbar on connect page
  if (location.pathname === "/" || location.pathname === "/connect")
    return <></>;

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
        <span>{lcuData.me.name}</span>
      </div>
    </div>
  );
};

export default NavBar;
