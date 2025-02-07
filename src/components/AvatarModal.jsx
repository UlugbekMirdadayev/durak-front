import styled from "styled-components";
import sizeCalculator from "../hook/useSizeCalculator";
import { useState, useRef, useCallback, useEffect } from "react";
import { setAvatarModal } from "../redux/profileSlice";
import { useDispatch, useSelector } from "react-redux";
import { ArrowIcon, FileUploadIcon } from "../assets/images/svgs";
import ImageCropper from "./ImageCropper";
import { BASE_URL } from "../service/constants";

const Container = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  z-index: 9999;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  pointer-events: ${({ $visible }) => ($visible ? "auto" : "none")};
  transform: translateY(${({ $visible }) => ($visible ? 0 : 100)}%);
  transition: 0.3s;
  overflow: hidden;
`;

const Body = styled.div`
  border-radius: ${sizeCalculator(10)} ${sizeCalculator(10)} 0 0;
  background: #fff;
  width: 100%;
  display: flex;
  padding: ${sizeCalculator(22)} ${sizeCalculator(15)};
  flex-direction: column;
  gap: ${sizeCalculator(10)};
  overflow: scroll;

  h1 {
    color: #090909;
    font-size: ${sizeCalculator(16)};
    font-weight: 700;
    line-height: ${sizeCalculator(19)};
  }
`;

const Back = styled.button`
  display: flex;
  align-items: center;
  gap: ${sizeCalculator(5)};
  border: 0;
  background: none;
  cursor: pointer;
  overflow: hidden;
  svg {
    transition: all 0.3s;
    width: ${sizeCalculator(14)};
    height: ${sizeCalculator(14)};
    rotate: 180deg;
    transform-origin: center;
  }
  &:active {
    svg {
      margin-left: ${sizeCalculator(-15)};
    }
  }
`;
const Handler = styled.div`
  width: ${sizeCalculator(134)};
  height: ${sizeCalculator(5)};
  cursor: pointer;
  border-radius: ${sizeCalculator(100)};
  background: #fff;
  margin: ${sizeCalculator(8)} auto;
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background: transparent;
  z-index: -1;
`;

const View = styled.div`
  position: ${({ $visible }) => ($visible ? "relative" : "absolute")};
  left: ${({ $visible }) => ($visible ? 0 : "-100%")};
  transition: 0.3s;
`;

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${sizeCalculator(30)} ${sizeCalculator(10)};
  margin-top: ${sizeCalculator(20)};
  width: calc(100dvw - ${sizeCalculator(30)});

  label {
    display: block;
    cursor: pointer;
    width: ${sizeCalculator(72)};
    height: ${sizeCalculator(72)};
    border-radius: ${sizeCalculator(72)};
    overflow: hidden;
    position: relative;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    svg {
      width: 100%;
      height: 100%;
    }
  }
`;

const IconFileUpload = styled(FileUploadIcon)`
  width: 100%;
  height: 100%;
`;

const Avatar = styled.img.attrs({
  loading: "lazy",
  alt: "Avatar",
})`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: ${sizeCalculator(72)};
`;

const Box = styled.div`
  margin: auto;
  width: ${sizeCalculator(72)};
  height: ${sizeCalculator(72)};
  border-radius: ${sizeCalculator(72)};
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  .status {
    border-radius: ${sizeCalculator(8)} / 40%;
    background: #e8e8e8;
    position: absolute;
    left: 50%;
    bottom: 0;
    z-index: 2;
    transform: translate(-50%, 50%);
    padding: ${sizeCalculator(4)};
    width: ${sizeCalculator(24)};
    height: ${sizeCalculator(24)};
  }
  &.active {
    .status {
      background: #10a5f7;
    }
  }
`;

const AvatarModal = () => {
  const dispatch = useDispatch();
  const [fileUpload, setFileUpload] = useState(false);
  const [file, setFile] = useState(null);
  const { avatarModal: visible } = useSelector((state) => state?.profile);
  const [height, setHeight] = useState(390); // Initial height in calculated units
  const startHeightRef = useRef(height); // Reference to track initial height
  const startYRef = useRef(0); // Reference to track initial Y position

  const onMouseMove = useCallback(
    (e) => {
      if (e.cancelable) e.preventDefault(); // Faqat cancelable bo'lsa defaultni bloklash

      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const diff = startYRef.current - clientY;
      const newHeight = Math.max(
        0,
        Math.min(window.innerHeight, startHeightRef.current + diff)
      );
      dispatch(setAvatarModal(newHeight > 120));
      setHeight(
        window.innerHeight - newHeight >
          (window?.Telegram?.WebApp?.contentSafeAreaInset?.top || 50)
          ? newHeight
          : newHeight -
              (window?.Telegram?.WebApp?.contentSafeAreaInset?.top || 50)
      );
    },
    [dispatch]
  );

  useEffect(() => {
    if (visible) {
      setHeight(390);
    }
  }, [visible]);

  const onMouseUp = useCallback(() => {
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("touchmove", onMouseMove);
    window.removeEventListener("mouseup", onMouseUp);
    window.removeEventListener("touchend", onMouseUp);
  }, [onMouseMove]);

  const onMouseDown = (e) => {
    e.preventDefault(); // Bu yerda bloklanadi

    startYRef.current = e.touches ? e.touches[0].clientY : e.clientY;
    startHeightRef.current = height;

    const moveListener = e.touches ? "touchmove" : "mousemove";
    const upListener = e.touches ? "touchend" : "mouseup";

    // Passiv bo‘lmagan hodisani qo‘shish
    window.addEventListener(moveListener, onMouseMove, { passive: false });
    window.addEventListener(upListener, onMouseUp, { passive: false });
  };

  const { all, my } = useSelector(({ products }) => products);
  const user = useSelector(({ user }) => user);

  return (
    <Container $visible={visible}>
      <Overlay onMouseDown={onMouseDown} onTouchStart={onMouseDown} />
      <Handler onMouseDown={onMouseDown} onTouchStart={onMouseDown} />

      <Body style={{ height: sizeCalculator(height) }}>
        <View $visible={fileUpload}>
          <Back
            onClick={() => {
              setFile(null);
              setFileUpload(false);
            }}
          >
            <ArrowIcon />
            <h1 className="roboto">Изменить аватар</h1>
          </Back>
          <ImageCropper
            setFile={setFile}
            file={file}
            setFileUpload={setFileUpload}
          />
        </View>
        <View $visible={!fileUpload}>
          <Back>
            <h1 className="roboto">Выбрать аватар</h1>
          </Back>
          <Wrapper>
            <Box onClick={() => setFileUpload(true)}>
              {file ? (
                <Avatar
                  src={
                    typeof file === "string" ? file : URL.createObjectURL(file)
                  }
                />
              ) : (
                <IconFileUpload />
              )}
            </Box>
            {user?.avatar_url && (
              <Box className={"active"}>
                <Avatar src={`${BASE_URL}${user?.avatar_url}`} />

                <svg
                  className="status"
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="15"
                  viewBox="0 0 18 15"
                  fill="none"
                >
                  <path
                    d="M0.338416 7.0798C0.0260188 7.39219 0.0257425 7.89849 0.338416 8.21117C4.4611 12.3338 2.74282 10.6166 6.56044 14.4342C6.71844 14.5922 6.92698 14.6709 7.13414 14.6693C7.33577 14.6665 7.53741 14.5886 7.69181 14.4342C17.7313 4.39474 11.3696 10.7565 17.6619 4.46409C17.9743 4.15169 17.9746 3.64539 17.662 3.33271L15.3992 1.06997C15.0865 0.757298 14.5802 0.757574 14.2678 1.06997L7.12664 8.21117L3.73253 4.81705C3.41986 4.50438 2.91356 4.50466 2.60116 4.81705L0.338416 7.0798Z"
                    fill="white"
                  />
                </svg>
              </Box>
            )}
            {all
              ?.filter(
                (product) =>
                  my?.find((p) => p?.product_id === product?.id) &&
                  product?.type === "avatar" &&
                  user?.avatar_url !== product?.image_url
              )
              ?.map((item) => (
                <Box
                  key={item?.id}
                  className={
                    my?.find((i) => i?.product_id === item?.id)?.is_equipped
                      ? "active"
                      : ""
                  }
                >
                  <Avatar src={`${BASE_URL}${item?.image_url}`} />

                  {my?.find((i) => i?.product_id === item?.id)?.is_equipped ? (
                    <svg
                      className="status"
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="15"
                      viewBox="0 0 18 15"
                      fill="none"
                    >
                      <path
                        d="M0.338416 7.0798C0.0260188 7.39219 0.0257425 7.89849 0.338416 8.21117C4.4611 12.3338 2.74282 10.6166 6.56044 14.4342C6.71844 14.5922 6.92698 14.6709 7.13414 14.6693C7.33577 14.6665 7.53741 14.5886 7.69181 14.4342C17.7313 4.39474 11.3696 10.7565 17.6619 4.46409C17.9743 4.15169 17.9746 3.64539 17.662 3.33271L15.3992 1.06997C15.0865 0.757298 14.5802 0.757574 14.2678 1.06997L7.12664 8.21117L3.73253 4.81705C3.41986 4.50438 2.91356 4.50466 2.60116 4.81705L0.338416 7.0798Z"
                        fill="white"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="status"
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                    >
                      <path
                        d="M6.4 0C5.9582 0 5.6 0.357812 5.6 0.8V5.6H0.8C0.614453 5.6 0.443359 5.6625 0.307422 5.76875C0.120313 5.91563 0 6.14375 0 6.4V9.6C0 9.82344 0.0917969 10.0266 0.239453 10.1719C0.383984 10.3125 0.581641 10.4 0.8 10.4H5.6V15.2C5.6 15.6422 5.9582 16 6.4 16H9.6C10.0418 16 10.4 15.6422 10.4 15.2V10.4H15.2C15.6418 10.4 16 10.0422 16 9.6V6.4C16 5.95781 15.6418 5.6 15.2 5.6H10.4V0.8C10.4 0.357812 10.0418 0 9.6 0H6.4Z"
                        fill="white"
                      />
                    </svg>
                  )}
                </Box>
              ))}
          </Wrapper>
        </View>
      </Body>
    </Container>
  );
};

export default AvatarModal;
