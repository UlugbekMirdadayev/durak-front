import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { v4 as uuidv4 } from "uuid";
import PropTypes from "prop-types";
import sizeCalculator from "../hook/useSizeCalculator";
import styled from "styled-components";
import { request } from "../service/api";
import { setUser } from "../redux/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

const CropperView = styled.div`
  width: ${() => `calc(${sizeCalculator(375)} - ${sizeCalculator(30)})`};
  height: ${() => `calc(${sizeCalculator(375)} - ${sizeCalculator(30)})`};
  background: #036595;
  position: relative;
  border-radius: ${sizeCalculator(20)};
  overflow: hidden;
  margin-top: ${sizeCalculator(20)};
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${sizeCalculator(20)};
  margin-top: ${sizeCalculator(20)};
  .custom-file-upload,
  button {
    padding: ${sizeCalculator(11)};
    background: #10a5f7;
    color: #fff;
    border: none;
    border-radius: ${sizeCalculator(10)};
    cursor: pointer;
    width: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: ${sizeCalculator(16)};
    font-weight: 500;
    line-height: ${sizeCalculator(24)};
    transition: 0.3s;
    &:active {
      transform: scale(0.98);
    }
    &.outlined {
      background: #fff;
      color: #10a5f7;
      border: ${sizeCalculator(1)} solid #e8e8e8;
    }
  }
  .custom-file-upload {
    background: #10a5f7;
    color: #fff;
    width: 100%;
  }
`;

const ImageCropper = ({ file, setFile, setFileUpload }) => {
  const token = useSelector((state) => state?.user?.token);
  const dispatch = useDispatch();
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  // Rasm yuklash
  const onFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setFile(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Kesilgan maydonni olish
  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  // Kesilgan rasmni yaratish
  const getCroppedImg = useCallback(async () => {
    const canvas = document.createElement("canvas");
    const image = new Image();
    image.src = file;

    return new Promise((resolve) => {
      image.onload = () => {
        const ctx = canvas.getContext("2d");
        canvas.width = croppedAreaPixels.width;
        canvas.height = croppedAreaPixels.height;

        ctx.drawImage(
          image,
          croppedAreaPixels.x,
          croppedAreaPixels.y,
          croppedAreaPixels.width,
          croppedAreaPixels.height,
          0,
          0,
          croppedAreaPixels.width,
          croppedAreaPixels.height
        );

        // Rasmni blob yoki base64 ko'rinishida olish
        canvas.toBlob((blob) => {
          const file = new File([blob], `${uuidv4()}.jpg`, {
            type: "image/jpeg",
          });
          resolve(file);
        }, "image/jpeg");
      };
    });
  }, [file, croppedAreaPixels]);

  // Rasmni serverga yuborish

  const handleUpload = useCallback(async () => {
    const croppedImage = await getCroppedImg();
    // Faylni yuklash uchun FormData ishlatamiz
    const avatar = new FormData();
    avatar.append("avatar", croppedImage);
    const toastId = toast.loading("Loading...");
    request
      .post("api/user/change-avatar", avatar, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      })
      .then(({ data }) => {
        toast.update(toastId, {
          render: data?.message,
          type: "success",
          isLoading: false,
          autoClose: 2000,
        });

        dispatch(
          setUser({ ...data?.data, token: localStorage.getItem("token") })
        );
        setFile(null);
        setFileUpload(false);
      })

      .catch((err) => {
        toast.update(toastId, {
          render: err?.response?.data?.message,
          type: "error",
          isLoading: false,
          autoClose: 2000,
        });
        console.log(err);
      });
  }, [getCroppedImg, dispatch, setFile, setFileUpload, token]);

  return (
    <div>
      {file && (
        <CropperView>
          <Cropper
            image={file}
            crop={crop}
            zoom={zoom}
            maxZoom={5}
            aspect={
              4 / 3 // 4:3 proporsiya
            } // Kvadrat shakl
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </CropperView>
      )}
      <Wrapper>
        {file ? (
          <>
            <button
              onClick={() => {
                setFile(null);
                setFileUpload(false);
              }}
            >
              Очистить
            </button>
            <button className="outlined" onClick={handleUpload}>
              Загрузить аватар
            </button>
          </>
        ) : (
          <label className="custom-file-upload">
            <span>Выбрать файл</span>
            <input
              type="file"
              accept="image/*"
              onChange={onFileChange}
              hidden
            />
          </label>
        )}
      </Wrapper>
    </div>
  );
};

ImageCropper.propTypes = {
  file: PropTypes.string,
  setFile: PropTypes.func,
  setFileUpload: PropTypes.func,
};

export default ImageCropper;
