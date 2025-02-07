import styled from "styled-components";
import sizeCalculator from "../hook/useSizeCalculator";
import { setAvatarModal } from "../redux/profileSlice";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";

const BottomBarStyle = styled.div`
  position: absolute;
  bottom: 0;
  z-index: 2;
  background: linear-gradient(to bottom, #b4d8e7, #87c6e9);
  left: ${sizeCalculator(15)};
  right: ${sizeCalculator(15)};
  padding: ${sizeCalculator(5)};
  border-radius: ${sizeCalculator([5, 5, 0, 0])};
  border: ${sizeCalculator(0.5)} solid #cdeaff;
  box-shadow: ${sizeCalculator(5)} ${sizeCalculator(5)} ${sizeCalculator(8)} 0
      rgba(0, 0, 0, 0.1),
    ${sizeCalculator(-2)} ${sizeCalculator(-2)} ${sizeCalculator(5)} 0
      rgba(255, 255, 255, 0.28),
    ${sizeCalculator(1)} ${sizeCalculator(1)} ${sizeCalculator(3)} 0
      rgba(0, 0, 0, 0.25) inset;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Box = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${sizeCalculator(10)};
  border: ${sizeCalculator(0.5)} solid rgba(255, 255, 255, 0.6);
  box-shadow: ${sizeCalculator(1)} ${sizeCalculator(1)} ${sizeCalculator(3)} 0
    rgba(0, 0, 0, 0.25) inset;
  width: ${sizeCalculator(27)};
  height: ${sizeCalculator(27)};

  svg {
    width: calc(100% - ${sizeCalculator(4)});
    height: calc(100% - ${sizeCalculator(4)});
  }
  span {
    font-family: Pribambas;
    font-size: ${sizeCalculator(17)};
    font-weight: 400;
    position: relative;
    top: ${sizeCalculator(-3)};
    text-transform: uppercase;
  }
`;

const Center = styled.div`
  cursor: pointer;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: ${sizeCalculator(62.035)};
  height: ${sizeCalculator(49.267)};
  border-radius: ${sizeCalculator(13)};

  span {
    color: #fff;
    text-align: center;
    font-size: ${sizeCalculator(14)};
    font-weight: 600;
    transform: translateY(-100%);
  }
  .badge {
    position: absolute;
    top: ${sizeCalculator(-10)};
    right: ${sizeCalculator(-5)};
    display: flex;
    transform: translateY(-100%);
    align-items: center;
    justify-content: center;
    width: ${sizeCalculator(21)};
    height: ${sizeCalculator(21)};
    border-radius: 50%;
    border: ${sizeCalculator(1)} solid #87a2b4;
    background: #5d8199;
    color: #fff;
    font-family: Rubik;
    font-size: ${sizeCalculator(10)};
    font-weight: 700;
  }
`;

const AvatarMe = styled.img`
  width: 100%;
  height: 100%;
  min-width: ${sizeCalculator(56)};
  min-height: ${sizeCalculator(45)};
  border-radius: ${sizeCalculator(6)};
  object-fit: cover;
  background: #fff;
  top: 50%;
  transform: translateY(-100%);
  position: relative;
`;

const BottomBar = ({ Button, ButtonInner, dispatch }) => {
  const user = useSelector(({ user }) => user);
  return (
    <BottomBarStyle>
      <Button
        style={{
          position: "static",
          transform: "none",
          gap: sizeCalculator(3),
          padding: sizeCalculator(8),
          width: sizeCalculator(133),
        }}
      >
        <Box>
          <span>36</span>
        </Box>
        <Box>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="19"
            viewBox="0 0 14 19"
            fill="none"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M2.5 8.75005V1.75C2.5 0.783502 3.2835 0 4.25 0H12.25C13.2165 0 14 0.783502 14 1.75V17.25C14 18.2165 13.2165 19 12.25 19H4.25C3.2835 19 2.5 18.2165 2.5 17.25V10.25L0 10.25V8.75005L2.5 8.75005ZM4.25 0.5H12.25C12.9404 0.5 13.5 1.05964 13.5 1.75V17.25C13.5 17.9404 12.9404 18.5 12.25 18.5H4.25C3.55964 18.5 3 17.9404 3 17.25V10.25H5L5 13.8302L12.5 9.50005L5 5.16992L5 8.75005H3V1.75C3 1.05964 3.55964 0.5 4.25 0.5Z"
              fill="white"
            />
          </svg>
        </Box>
        <Box>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="23"
            height="19"
            viewBox="0 0 23 19"
            fill="none"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M17.5114 6.52885V1.75C17.5114 0.783502 16.6922 0 15.6818 0H7.31818C6.30775 0 5.48864 0.783502 5.48864 1.75V6.52885L4.07727 5.75L4.07727 8.54043H0V9.70957L4.07727 9.70957L4.07727 12.5L5.48864 11.7212V17.25C5.48864 18.2165 6.30775 19 7.31818 19H15.6818C16.6922 19 17.5114 18.2165 17.5114 17.25V11.7212L18.9227 12.5V9.70957L23 9.70957V8.54043H18.9227V5.75L17.5114 6.52885ZM15.6818 0.5H7.31818C6.59645 0.5 6.01136 1.05964 6.01136 1.75V6.81731L10.1932 9.125L6.01136 11.4327V17.25C6.01136 17.9404 6.59645 18.5 7.31818 18.5H15.6818C16.4036 18.5 16.9886 17.9404 16.9886 17.25V11.4327L12.8068 9.125L16.9886 6.81731V1.75C16.9886 1.05964 16.4036 0.5 15.6818 0.5Z"
              fill="white"
            />
          </svg>
        </Box>
        <Box>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="11"
            height="19"
            viewBox="0 0 11 19"
            fill="none"
          >
            <path
              d="M6.324 7.12842L6.34034 7.14453C6.43457 7.24084 6.48163 7.35547 6.48163 7.48853C6.48163 7.62158 6.43457 7.73633 6.34034 7.83264C6.26048 7.91431 6.16765 7.96143 6.06198 7.97375C5.95211 8.65125 6.06163 9.35852 6.39055 9.97607C6.94307 9.39758 7.71394 9.0387 8.56678 9.0387C8.5948 9.0387 8.62282 9.03906 8.65073 9.03979C8.65902 9.01978 8.66871 9.00037 8.6798 8.98169C8.68658 8.97021 8.69393 8.95898 8.70176 8.948C8.71658 8.927 8.7334 8.90698 8.7522 8.88782C8.84409 8.7937 8.95665 8.7467 9.08976 8.7467C9.14184 8.7467 9.19076 8.75391 9.23653 8.76831C9.30776 8.79065 9.37139 8.83044 9.42732 8.88782C9.51396 8.97644 9.55973 9.08398 9.56475 9.21008L9.56487 9.21497L9.5651 9.22009L9.56522 9.23328C9.56522 9.36951 9.51921 9.48474 9.42732 9.57874C9.33543 9.67285 9.22287 9.71985 9.08976 9.71985C9.06617 9.71985 9.04317 9.71838 9.02099 9.71545C9.00254 9.71301 8.98467 9.70959 8.96716 9.70508C8.90422 9.68909 8.84689 9.66016 8.79528 9.61816C8.0236 10.183 7.5207 11.1077 7.5207 12.1527L7.52082 12.1832C7.52105 12.2056 7.52152 12.2278 7.52222 12.25H3.47778C3.47848 12.2278 3.47895 12.2056 3.47918 12.1832L3.4793 12.1527C3.4793 11.1077 2.9764 10.183 2.20472 9.61816C2.12135 9.68591 2.02327 9.71985 1.91024 9.71985C1.77713 9.71985 1.66457 9.67285 1.57268 9.57874C1.48079 9.48474 1.43478 9.36951 1.43478 9.23328L1.43525 9.21008C1.4377 9.14758 1.4502 9.0896 1.47273 9.03625C1.49573 8.98193 1.52901 8.9325 1.57268 8.88782C1.63036 8.82874 1.69633 8.78821 1.77036 8.76624C1.81415 8.75317 1.86073 8.7467 1.91024 8.7467C2.04335 8.7467 2.15591 8.7937 2.2478 8.88782C2.29252 8.93347 2.32627 8.98425 2.34927 9.03979C2.37718 9.03906 2.4052 9.0387 2.43322 9.0387C3.28583 9.0387 4.05646 9.39734 4.60887 9.97546C4.59766 9.16382 4.8947 8.34863 5.49988 7.72937L5.51483 7.71423C5.52977 7.6991 5.54495 7.68408 5.56013 7.66943C5.54846 7.64001 5.53982 7.60938 5.53421 7.57751C5.52919 7.54883 5.52674 7.51917 5.52674 7.48853C5.52674 7.39465 5.55009 7.30994 5.59703 7.23425C5.61653 7.20276 5.64023 7.17285 5.66802 7.14453C5.76213 7.0481 5.87423 7 6.00418 7C6.12667 7 6.23339 7.04285 6.324 7.12842Z"
              fill="white"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M0 1.75C0 0.783447 0.749384 0 1.67391 0H9.32609C10.2506 0 11 0.783447 11 1.75V17.25C11 18.2166 10.2506 19 9.32609 19H1.67391C0.749384 19 0 18.2166 0 17.25V1.75ZM1.67391 0.5H9.32609C9.98638 0.5 10.5217 1.05969 10.5217 1.75V17.25C10.5217 17.9403 9.98638 18.5 9.32609 18.5H1.67391C1.01362 18.5 0.478261 17.9403 0.478261 17.25V1.75C0.478261 1.05969 1.01362 0.5 1.67391 0.5Z"
              fill="white"
            />
          </svg>
        </Box>
      </Button>
      <Center
        onClick={() => {
          dispatch(setAvatarModal(true));
        }}
      >
        <AvatarMe src={user?.user_photo} alt="Avatar" loading="lazy" />

        <div className="badge">{user?.all_games_win_count}</div>
        <span
          className="rubik"
          style={{
            textTransform: "capitalize",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            maxWidth: "100%",
            overflowX: "clip",
          }}
        >
          {user?.first_name || user?.last_name || user?.username}

        </span>
      </Center>
      <Button
        style={{
          position: "static",
          transform: "none",
          width: sizeCalculator(133),
        }}
      >
        <ButtonInner>Готов</ButtonInner>
      </Button>
    </BottomBarStyle>
  );
};

BottomBar.propTypes = {
  Button: PropTypes.elementType,
  ButtonInner: PropTypes.elementType,
  dispatch: PropTypes.func,
};

export default BottomBar;
