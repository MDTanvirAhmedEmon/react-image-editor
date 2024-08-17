"use client";
import { BiRedo } from "react-icons/bi";
import { BiUndo } from "react-icons/bi";
import { LuFlipHorizontal2 } from "react-icons/lu";
import { LuFlipVertical2 } from "react-icons/lu";
import { LiaUndoAltSolid } from "react-icons/lia";
import { LiaRedoAltSolid } from "react-icons/lia";
import { ConfigProvider, Slider, Tooltip } from 'antd';
import { useState } from "react";
import Image from "next/image";

const Home = () => {

    const filtersItem = [
        {
            name: "brightness",
            maxValue: 200,
        },
        {
            name: "grayscale",
            maxValue: 100,
        },
        {
            name: "sepia",
            maxValue: 100,
        },
        {
            name: "saturate",
            maxValue: 200,
        },
        {
            name: "contrast",
            maxValue: 200,
        },
        {
            name: "hueRotate",
            maxValue: 360,
        },
    ];

    const [property, setProperty] = useState({
        name: "brightness",
        maxValue: 200,
    });

    const [imageState, setImageState] = useState({
        image: '',
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

    const imageHandle = (e) => {
        if (e.target.files.length !== 0) {
            const reader = new FileReader();

            reader.onload = () => {
                setImageState({
                    ...imageState,
                    image: reader.result
                });
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const inputHandle = (value) => {
        setImageState({
            ...imageState,
            [property.name]: value
        });
    };

    return (
        <div className="container mx-auto">
            <div className="flex justify-between items-center h-[10vh]">
                <div className="flex items-center gap-4">
                    <Tooltip title="Undo" placement="leftTop">
                        <button className="text-white bg-[#1E201E] py-2 px-4 rounded-sm shadow-md">
                            <BiUndo className="w-6 h-6" />
                        </button>
                    </Tooltip>
                    <Tooltip title="Redo" placement="bottomRight">
                        <button className="text-white bg-[#1E201E] py-2 px-4 rounded-sm shadow-md">
                            <BiRedo className="w-6 h-6" />
                        </button>
                    </Tooltip>
                    <button className="text-white bg-[#3C3D37] py-2 px-4 rounded-sm shadow-md">
                        Crop Image
                    </button>
                    <label
                        htmlFor="choose"
                        className="text-black bg-[#ECDFCC] py-2 px-4 rounded-sm shadow-md cursor-pointer"
                    >
                        Choose Image
                    </label>
                    <input onChange={imageHandle} id="choose" className="hidden" type="file" />
                </div>

                <div className="flex items-center gap-4">
                    <button className="text-white bg-[#1E201E] py-2 px-4 rounded-sm shadow-md">
                        Reset
                    </button>
                    <button className="text-black bg-[#ECDFCC] py-2 px-4 rounded-sm shadow-md">
                        Save Image
                    </button>
                </div>
            </div>

            <div className="h-[80vh] flex">
                <div className="w-[10%] h-full">
                    <div className="flex gap-4">
                        <Tooltip title="Flip" placement="leftTop">
                            <button className="text-black bg-[#ECDFCC] py-2 px-4 rounded-sm shadow-md">
                                <LuFlipHorizontal2 className="w-6 h-6" />
                            </button>
                        </Tooltip>
                        <Tooltip title="Flip" placement="rightTop">
                            <button className="text-black bg-[#ECDFCC] py-2 px-4 rounded-sm shadow-md">
                                <LuFlipVertical2 className="w-6 h-6" />
                            </button>
                        </Tooltip>
                    </div>
                    <div className="flex gap-4 mt-3">
                        <Tooltip title="Rotate" placement="leftTop">
                            <button className="text-black bg-[#ECDFCC] py-2 px-4 rounded-sm shadow-md">
                                <LiaUndoAltSolid className="w-6 h-6" />
                            </button>
                        </Tooltip>
                        <Tooltip title="Rotate" placement="rightTop">
                            <button className="text-black bg-[#ECDFCC] py-2 px-4 rounded-sm shadow-md">
                                <LiaRedoAltSolid className="w-6 h-6" />
                            </button>
                        </Tooltip>
                    </div>

                    <div className="flex flex-col gap-4 mt-3">
                        {filtersItem.map((item, index) => (
                            <button
                                key={index}
                                onClick={() => setProperty(item)}
                                className={`w-[128px] ${property.name === item.name ? `bg-[#697565] text-white` : `text-black bg-[#ECDFCC]`} py-2 px-4 rounded-sm capitalize shadow-md`}
                            >
                                {item?.name}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="w-[90%] bg-slate-100 flex items-center justify-center">
                    {imageState.image && (
                        <Image
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
                                    scale(${imageState.vertical}, ${imageState.horizontal})
                                `
                            }}
                            className="w-[1000px]"
                            src={imageState.image}
                            width={0}
                            height={0}
                            alt="img"
                        />
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
