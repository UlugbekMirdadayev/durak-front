import { NavLink, useLocation } from "react-router-dom";
import styled from "styled-components";
import sizeCalculator from "../hook/useSizeCalculator";
import {
  BoxIcon,
  GamePadIcon,
  PenIcon,
  ProfileIcon,
} from "../assets/images/svgs";
import { setExitVisible } from "../redux/exitSlice";
import { useDispatch } from "react-redux";
import { setProfileOpened } from "../redux/profileSlice";

const tablinks = [
  {
    name: "Профиль",
    link: "#profile",
    icon: <ProfileIcon />,
    activeRoutes: [],
  },
  {
    name: "Магазин",
    link: "/shop",
    icon: <BoxIcon />,
    activeRoutes: ["/shop"],
  },
  {
    name: "Игры",
    link: "/create-game",
    icon: <GamePadIcon />,
    activeRoutes: ["/create-game", "/games-list", "/new-game-params", "/game"],
  },
  {
    name: "Оформление",
    link: "/decoration",
    icon: <PenIcon />,
    activeRoutes: ["/decoration"],
  },
];

const FooterStyle = styled.footer`
  padding: ${sizeCalculator(4)};
  background: #f6f6f6;
  box-shadow: 0 ${sizeCalculator(-0.33)} 0 0 #a6a6aa;
  margin-top: auto;
  display: grid;
  grid-template-columns: repeat(4, 1fr);

  a {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    transition: 0.3s ease;
    span {
      color: rgba(84, 84, 88, 0.65);
      text-align: center;
      font-size: ${sizeCalculator(10)};
      font-weight: 500;
      transition: 0.3s ease;
    }
    svg {
      width: ${sizeCalculator(30)};
      height: ${sizeCalculator(30)};

      path {
        fill: rgba(84, 84, 88, 0.65);
        transition: 0.3s ease;
      }
    }
    &:active,
    &.active:not(.in-active) {
      span {
        color: #0098eb;
      }
      svg path {
        fill: #0098eb;
      }
    }
  }
`;

const Footer = () => {
  const dispatch = useDispatch();
  const { pathname } = useLocation();

  return (
    <FooterStyle>
      {tablinks.map((tablink) => (
        <NavLink
          key={tablink.name}
          onClick={(e) => {
            if (pathname === "/game") {
              e.preventDefault();
              dispatch(setExitVisible(true));
              return;
            }
            if (tablink.link === "#profile") {
              e.preventDefault();
              dispatch(setProfileOpened(true));
            }
          }}
          to={tablink.link}
          className={
            tablink.link === "#profile"
              ? "in-active"
              : tablink.activeRoutes.includes(pathname)
              ? "active"
              : ""
          }
        >
          {tablink.icon}
          <span>{tablink.name}</span>
        </NavLink>
      ))}
    </FooterStyle>
  );
};

export default Footer;
