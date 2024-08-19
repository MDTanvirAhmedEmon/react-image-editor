"use client";
import { BiRedo } from "react-icons/bi";
import { BiUndo } from "react-icons/bi";
import { LuFlipHorizontal2 } from "react-icons/lu";
import { LuFlipVertical2 } from "react-icons/lu";
import { LiaUndoAltSolid } from "react-icons/lia";
import { LiaRedoAltSolid } from "react-icons/lia";
import { ConfigProvider, Slider, Tooltip } from "antd";
import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import storeData from "@/LinkedList";

const Home = () => {
  const filtersItem = [
    { name: "brightness", maxValue: 200 },
    { name: "grayscale", maxValue: 100 },
    { name: "sepia", maxValue: 100 },
    { name: "saturate", maxValue: 200 },
    { name: "contrast", maxValue: 200 },
    { name: "hueRotate", maxValue: 360 },
  ];

  const [property, setProperty] = useState({
    name: "brightness",
    maxValue: 200,
  });

  const [imageState, setImageState] = useState({
    image: "",
    brightness: 100,
    grayscale: 0,
    sepia: 0,
    saturate: 100,
    contrast: 100,
    hueRotate: 0,
    rotate: 0,
    vertical: 1,
    horizontal: 1,
  });

  const [originalImageState, setOriginalImageState] = useState(null);
  const [crop, setCrop] = useState("");
  const [details, setDetails] = useState("");

  const imageHandle = (e) => {
    if (e.target.files.length !== 0) {
      const reader = new FileReader();

      reader.onload = () => {
        const stateData = {
          image: reader.result,
          brightness: 100,
          grayscale: 0,
          sepia: 0,
          saturate: 100,
          contrast: 100,
          hueRotate: 0,
          rotate: 0,
          vertical: 1,
          horizontal: 1,
        };
        setImageState(stateData);
        setOriginalImageState(stateData);
        storeData.insert(stateData);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const inputHandle = (value) => {
    const newState = {
      ...imageState,
      [property.name]: value,
    };
    setImageState(newState);
    storeData.insert(newState);
  };

  const leftRotate = () => {
    const newRotate = imageState.rotate + 90;
    const stateData = { ...imageState, rotate: newRotate };
    setImageState(stateData);
    storeData.insert(stateData);
  };

  const rightRotate = () => {
    const newRotate = imageState.rotate - 90;
    const stateData = { ...imageState, rotate: newRotate };
    setImageState(stateData);
    storeData.insert(stateData);
  };

  const verticalFlip = () => {
    const newVertical = imageState.vertical === 1 ? -1 : 1;
    const stateData = { ...imageState, vertical: newVertical };
    setImageState(stateData);
    storeData.insert(stateData);
  };

  const horizontalFlip = () => {
    const newHorizontal = imageState.horizontal === 1 ? -1 : 1;
    const stateData = { ...imageState, horizontal: newHorizontal };
    setImageState(stateData);
    storeData.insert(stateData);
  };

  const redo = () => {
    const data = storeData.redoEdit();
    if (data) setImageState(data);
  };

  const undo = () => {
    const data = storeData.undoEdit();
    if (data) setImageState(data);
  };

  const resetImage = () => {
    if (originalImageState) {
      setImageState(originalImageState);
      storeData.insert(originalImageState);
    }
  };

  const imageCrop = useCallback(() => {
    const canvas = document.createElement("canvas");
    const scaleX = details.naturalWidth / details.width;
    const scaleY = details.naturalHeight / details.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext("2d");

    ctx.drawImage(
      details,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    const base64Url = canvas.toDataURL("image/jpg");
    const stateData = { ...imageState, image: base64Url };

    setImageState(stateData);
    storeData.insert(stateData);
    // Reset the crop state to hide the crop box
    setCrop(null);
  });

  // Add useEffect to listen for Enter key
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Enter" && crop) {
        imageCrop();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [crop, imageState]); // Dependency array to re-apply effect when crop or imageState changes

  const saveImage = () => {
    const canvas = document.createElement("canvas");
    canvas.width = details.naturalWidth;
    canvas.height = details.naturalHeight;
    const ctx = canvas.getContext("2d");

    ctx.filter = `
        brightness(${imageState.brightness}%) 
        grayscale(${imageState.grayscale}%) 
        sepia(${imageState.sepia}%) 
        saturate(${imageState.saturate}%) 
        contrast(${imageState.contrast}%) 
        hue-rotate(${imageState.hueRotate}deg)
        `;
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((imageState.rotate * Math.PI) / 180);
    ctx.scale(imageState.vertical, imageState.horizontal);

    ctx.drawImage(
      details,
      -canvas.width / 2,
      -canvas.height / 2,
      canvas.width,
      canvas.height
    );

    const link = document.createElement("a");
    link.download = Date.now() + "-" + "image_edit.jpg";
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center h-[10vh]">
        <div className="flex items-center gap-4">
          <Tooltip title="Undo" placement="leftTop">
            <button
              className="text-white bg-[#1E201E] py-2 px-4 rounded-sm shadow-md"
              onClick={undo}
            >
              <BiUndo className="w-6 h-6" />
            </button>
          </Tooltip>
          <Tooltip title="Redo" placement="bottomRight">
            <button
              className="text-white bg-[#1E201E] py-2 px-4 rounded-sm shadow-md"
              onClick={redo}
            >
              <BiRedo className="w-6 h-6" />
            </button>
          </Tooltip>
          {crop && (
            <button
              onClick={imageCrop}
              className="text-white bg-[#3C3D37] py-2 px-4 rounded-sm shadow-md"
            >
              Crop Image
            </button>
          )}

          <label
            htmlFor="choose"
            className="text-black bg-[#ECDFCC] py-2 px-4 rounded-sm shadow-md cursor-pointer"
          >
            Choose Image
          </label>
          <input
            onChange={imageHandle}
            id="choose"
            className="hidden"
            type="file"
          />
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={resetImage}
            className="text-white bg-[#1E201E] py-2 px-4 rounded-sm shadow-md"
          >
            Reset
          </button>
          <button
            onClick={saveImage}
            className="text-black bg-[#ECDFCC] py-2 px-4 rounded-sm shadow-md"
          >
            Save Image
          </button>
        </div>
      </div>

      <div className="h-[80vh] flex">
        <div className="w-[10%] h-full">
          <div className="flex gap-4">
            <Tooltip title="Horizontal Flip" placement="leftTop">
              <button
                onClick={horizontalFlip}
                className="text-black bg-[#ECDFCC] py-2 px-4 rounded-sm shadow-md"
              >
                <LuFlipHorizontal2 className="w-6 h-6" />
              </button>
            </Tooltip>
            <Tooltip title="Vertical Flip" placement="rightTop">
              <button
                onClick={verticalFlip}
                className="text-black bg-[#ECDFCC] py-2 px-4 rounded-sm shadow-md"
              >
                <LuFlipVertical2 className="w-6 h-6" />
              </button>
            </Tooltip>
          </div>
          <div className="flex gap-4 mt-3">
            <Tooltip title="Left Rotate" placement="leftTop">
              <button
                onClick={leftRotate}
                className="text-black bg-[#ECDFCC] py-2 px-4 rounded-sm shadow-md"
              >
                <LiaUndoAltSolid className="w-6 h-6" />
              </button>
            </Tooltip>
            <Tooltip title="Right Rotate" placement="rightTop">
              <button
                onClick={rightRotate}
                className="text-black bg-[#ECDFCC] py-2 px-4 rounded-sm shadow-md"
              >
                <LiaRedoAltSolid className="w-6 h-6" />
              </button>
            </Tooltip>
          </div>

          <div className="flex flex-col gap-4 mt-3">
            {filtersItem.map((item, index) => (
              <button
                key={index}
                onClick={() => setProperty(item)}
                className={`w-[128px] ${
                  property.name === item.name
                    ? `bg-[#697565] text-white`
                    : `text-black bg-[#ECDFCC]`
                } py-2 px-4 rounded-sm capitalize shadow-md`}
              >
                {item?.name}
              </button>
            ))}
          </div>
        </div>

        <div className="w-[90%] bg-slate-100 flex items-center justify-center overflow-hidden">
          {imageState.image && (
            <ReactCrop crop={crop} onChange={(c) => setCrop(c)}>
              <Image
                onLoad={(e) => setDetails(e.currentTarget)}
                style={{
                  filter: `
                                    brightness(${imageState.brightness}%) 
                                    grayscale(${imageState.grayscale}%) 
                                    sepia(${imageState.sepia}%) 
                                    saturate(${imageState.saturate}%) 
                                    contrast(${imageState.contrast}%) 
                                    hue-rotate(${imageState.hueRotate}deg)
                                `,
                  transform: `
                                    rotate(${imageState.rotate}deg) 
                                    scale(${imageState.horizontal}, ${imageState.vertical})
                                `,
                }}
                className="w-auto"
                src={imageState.image}
                width={0}
                height={0}
                alt="img"
              />
            </ReactCrop>
          )}
        </div>
      </div>

      <div className="w-full h-[10vh] flex items-center justify-center">
        <div className="w-[600px]">
          <ConfigProvider
            theme={{
              components: {
                Slider: {
                  controlSize: 50,
                  dotSize: 10,
                  dotActiveBorderColor: "#697565",
                  handleActiveColor: "#697565",
                  handleColor: "#697565",
                  trackBg: "#3C3D37",
                  trackHoverBg: "#1E201E",
                  railSize: 8,
                  handleActiveOutlineColor: "#3C3D37",
                  colorPrimaryBorderHover: "#3C3D37",
                },
              },
            }}
          >
            <Slider
              value={imageState[property.name]}
              onChange={inputHandle}
              max={property.maxValue}
            />
          </ConfigProvider>
        </div>
      </div>
    </div>
  );
};

export default Home;
