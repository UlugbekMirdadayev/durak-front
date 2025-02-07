import styled from "styled-components";
import sizeCalculator from "../hook/useSizeCalculator";
import dollar from "../assets/images/dollar.png";
import { PlusIcon, SettingsIcon } from "../assets/images/svgs";
import { useDispatch } from "react-redux";
import { setSettingVisible } from "../redux/settingsSlice";
import { setAvatarModal, setPaymentModal } from "../redux/profileSlice";
import { useSelector } from "react-redux";

const HeaderStyle = styled.header`
  position: relative;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #0098eb;
  padding: ${sizeCalculator(5)} ${sizeCalculator(11)};
`;

const LeftSide = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: ${sizeCalculator(5)};
  margin-top: ${window?.Telegram?.WebApp?.contentSafeAreaInset?.top}px;
`;
const Balance = styled.span`
  color: #fff;
  font-size: ${sizeCalculator(12)};
  font-weight: 400;
`;

const CenterLogo = styled.div`
  cursor: pointer;
  position: absolute;
  left: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: ${sizeCalculator(56)};
  height: ${sizeCalculator(45)};
  border-radius: ${sizeCalculator(6)};

  top: calc(100% + ${sizeCalculator(5)});
  transform: translateX(-50%) translateY(-50%);

  span {
    color: #999;
    font-size: ${sizeCalculator(12)};
    font-weight: 400;
  }
`;

const RightSide = styled.div`
  display: flex;
  align-items: center;
  margin-top: ${window?.Telegram?.WebApp?.contentSafeAreaInset?.top}px;
`;

const DollarIcon = styled.img.attrs(() => ({
  src: dollar,
  alt: "Dollar Icon",
  loading: "lazy",
}))`
  width: ${sizeCalculator(17)};
  height: ${sizeCalculator(17)};
`;

const IconPlus = styled(PlusIcon)`
  width: ${sizeCalculator(17)};
  height: ${sizeCalculator(17)};
`;

const IconSettings = styled(SettingsIcon)`
  width: ${sizeCalculator(24)};
  height: ${sizeCalculator(24)};
  cursor: pointer;
`;

const Avatar = styled.img`
  width: 100%;
  height: 100%;
  min-width: ${sizeCalculator(56)};
  min-height: ${sizeCalculator(45)};
  border-radius: ${sizeCalculator(6)};
  object-fit: cover;
  background: #fff;
`;

const Header = () => {
  const dispatch = useDispatch();
  const user = useSelector(({ user }) => user);
  return (
    <HeaderStyle>
      <LeftSide onClick={() => dispatch(setPaymentModal(true))}>
        <DollarIcon />
        <Balance className="rubik">{user?.balance}</Balance>
        <IconPlus />
      </LeftSide>
      <CenterLogo
        onClick={() => {
          dispatch(setAvatarModal(true));
        }}
      >
        <Avatar
          src={
            user?.user_photo || "https://placehold.co/60x50?text=Change+Pass"
          }
          alt="Avatar"
          loading="lazy"
        />
        <span className="rubik">
          {user?.username || user?.first_name || user?.last_name}
        </span>
      </CenterLogo>
      <RightSide>
        <IconSettings
          onClick={() => {
            dispatch(setSettingVisible(true));
          }}
        />
      </RightSide>
    </HeaderStyle>
  );
};

export default Header;
