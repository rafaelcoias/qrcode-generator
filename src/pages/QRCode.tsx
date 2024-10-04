import React, { MutableRefObject, useEffect, useRef, useState } from "react";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import { QRCode } from "react-qrcode-logo";
import { SketchPicker } from "react-color";
import { useNavigate, useParams } from "react-router-dom";
import Download from "../content/icons/download.png";
import { db } from "../firebase";
import { useItems } from "../context";
export default function QRCodePage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user, items, setItems } = useItems();

  const ref = useRef<QRCode>();
  const [name, setName] = useState("");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [fgColor, setFgColor] = useState("#000000");
  const [size, setSize] = useState(256);
  const [eyeColor, setEyeColor] = useState("#000000");
  const [type, setType] = useState<"dots" | "squares" | "fluid">("squares");
  const [eyeRadius, setEyeRadius] = useState(0);
  const [image, setImage] = useState("");
  const [link, setLink] = useState("https://google.com");

  useEffect(() => {
    if (id && !items?.length) navigate("/home");
  }, [items, navigate, id]);

  useEffect(() => {
    if (!id || !items?.length) return;
    const fetchQRCode = async () => {
      const qrCode = items.find((item: any) => item.id === id);
      setBgColor(qrCode.bgColor);
      setFgColor(qrCode.fgColor);
      setSize(qrCode.size);
      setEyeColor(qrCode.eyeColor);
      setImage(qrCode.image);
      setType(qrCode.type);
      setEyeRadius(qrCode.eyeRadius);
      setLink(qrCode.link);
      setName(qrCode.name);
    };
    fetchQRCode();
  }, [id, items]);

  const handleColorChange = (color: any, property: string) => {
    if (property === "bgColor") {
      setBgColor(color.hex);
    } else if (property === "fgColor") {
      setFgColor(color.hex);
    } else if (property === "eyeColor") {
      setEyeColor(color.hex);
    }
  };

  const handleChange = (e: any) => {
    setImage(e.target.value);
  };

  const retrievePathFile = (files: any) => {
    const file = files[0];
    if (file.type !== "image/png" && file.type !== "image/jpeg") {
      console.error("Only png and jpg/jpeg allowed.");
    } else {
      const target: any = {};
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = (e) => {
        target.name = name;
        target.value = reader.result;
        target.logoName = file.name;
        handleChange({ target });
      };
    }
  };

  const handleDownload = () => {
    const canvas = document.querySelector("#qrcode canvas");
    if (!canvas) {
      alert("QR Code not found");
      return;
    }
    const dataURL = (canvas as HTMLCanvasElement).toDataURL("image/png");

    // Create an anchor element to download the image
    const downloadLink = document.createElement("a");
    downloadLink.href = dataURL;

    // Set the custom filename here
    downloadLink.download = `${name || "qrcode"}.png`;

    // Trigger the download
    downloadLink.click();
  };

  const action = () => {
    if (id) {
      updateQRCode();
    } else {
      saveQRCode();
    }
  };

  const updateQRCode = async () => {
    // TODO: update all info to firestore
    const qrcodesCollection = collection(db, "users", user.id, "qrcodes");
    const qrCodeDocRef = doc(qrcodesCollection, id);
    try {
      await setDoc(qrCodeDocRef, {
        bgColor,
        fgColor,
        size,
        eyeColor,
        type,
        eyeRadius,
        link,
        image,
        name,
      });

      const updatedItems = items.map((item: any) => {
        if (item.id === id) {
          return {
            id: id,
            bgColor,
            fgColor,
            size,
            eyeColor,
            type,
            eyeRadius,
            image,
            link,
            name,
          };
        }
        return item;
      });
      setItems(updatedItems);
      alert("QRCode updated successfully");
      navigate("/home");
    } catch (error) {
      alert("Error updating QRCode");
      console.error("Error updating QRCode:", error);
    }
  };

  const saveQRCode = async () => {
    const qrcodesCollection = collection(db, "users", user.id, "qrcodes");
    try {
      await addDoc(qrcodesCollection, {
        bgColor,
        fgColor,
        size,
        eyeColor,
        type,
        eyeRadius,
        image,
        link,
        name,
      });
      const randomId = Math.random().toString(36).substr(2, 9);
      setItems([
        ...items,
        {
          id: randomId,
          bgColor,
          fgColor,
          size,
          eyeColor,
          type,
          eyeRadius,
          image,
          link,
          name,
        },
      ]);
      alert("QRCode saved successfully");
      navigate("/home");
    } catch (error) {
      alert("Error saving QRCode");
      console.error("Error saving QRCode:", error);
    }
  };

  const handleGoBack = () => {
    navigate("/home");
  };

  return (
    <div className="flex flex-col gap-6 relative overflow-hidden min-h-screen py-20 px-[8vw] space-y-6">
      <div className="flex justify-between">
        <button onClick={handleGoBack}>← Home</button>
      </div>
      {/* Sample QRCode */}
      <div className="flex justify-center w-full">
        <div className="w-[12rem] shadow-lg">
          <QRCode
            size={256}
            style={{
              height: "auto",
              width: "100%",
            }}
            value={link}
            logoImage={image}
            logoWidth={60}
            logoHeight={60}
            bgColor={bgColor}
            fgColor={fgColor}
            qrStyle={type}
            eyeColor={eyeColor}
            eyeRadius={eyeRadius}
          />
        </div>
      </div>
      {/* Downloaded QRCode */}
      <div className="absolute top-[200vw] left-[200vw]">
        <div id="qrcode">
          <QRCode
            ref={ref as MutableRefObject<QRCode>}
            size={size}
            style={{
              height: size,
              width: size,
            }}
            value={link}
            logoImage={image}
            logoWidth={size * 0.2}
            logoHeight={size * 0.2}
            bgColor={bgColor}
            fgColor={fgColor}
            qrStyle={type}
            eyeColor={eyeColor}
            eyeRadius={eyeRadius * 5}
          />
        </div>
      </div>
      <div className="flex items-center w-full gap-4">
        <p className="cinco:w-[15rem]">Name</p>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 px-4 bg-transparent border border-black rounded-full"
        />
      </div>
      <div className="flex items-center w-full gap-4">
        <p className="cinco:w-[15rem]">Target link</p>
        <input
          type="text"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          className="w-full p-2 px-4 bg-transparent border border-black rounded-full"
        />
      </div>
      <div className="flex flex-col gap-10 sete:flex-row">
        <div className="grid gap-16 sete:grid-cols-2 mil:grid-cols-3">
          <div className="flex items-center gap-4">
            <p className="cinco:w-[15rem]">Background Color</p>
            <button
              className="pointer-events-auto w-[6rem] text-center relative group border"
              style={{
                backgroundColor: bgColor,
              }}
            >
              {bgColor}
              <div className="absolute hidden text-black -left-full group-hover:flex">
                <SketchPicker
                  onChangeComplete={(color: any) =>
                    handleColorChange(color, "bgColor")
                  }
                />
              </div>
            </button>
          </div>
          <div className="flex items-center gap-4">
            <p className="cinco:w-[15rem]">Primary Color</p>
            <button
              className="pointer-events-auto w-[6rem] text-center relative group border"
              style={{
                backgroundColor: fgColor,
              }}
            >
              {fgColor}
              <div className="absolute hidden text-black -left-full group-hover:flex">
                <SketchPicker
                  onChangeComplete={(color: any) =>
                    handleColorChange(color, "fgColor")
                  }
                />
              </div>
            </button>
          </div>
          <div className="flex items-center gap-4">
            <p className="cinco:w-[15rem]">Corner Color</p>
            <button
              className="pointer-events-auto w-[6rem] text-center relative group border"
              style={{
                backgroundColor: eyeColor,
              }}
            >
              {eyeColor}
              <div className="absolute hidden text-black -left-full group-hover:flex">
                <SketchPicker
                  onChangeComplete={(color: any) =>
                    handleColorChange(color, "eyeColor")
                  }
                />
              </div>
            </button>
          </div>
          <div className="flex items-center w-full gap-4">
            <p className="cinco:w-[15rem]">Corners Roundness</p>
            <input
              type="number"
              value={eyeRadius}
              onChange={(e) => {
                setEyeRadius(parseInt(e.target.value));
              }}
              className="w-full p-2 px-4 bg-transparent border border-black rounded-full"
            />
          </div>
          <div className="flex items-center w-full gap-4">
            <p className="cinco:w-[15rem]">Image Upload</p>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => retrievePathFile(e.target.files)}
              className="w-full p-2 px-4 overflow-hidden bg-transparent border border-black rounded-full"
            />
            {image && (
              <button onClick={() => setImage("")} className="text-red-400">
                Remove
              </button>
            )}
          </div>
          <div className="flex items-center gap-4">
            <p className="cinco:w-[15rem]">Type</p>
            <select
              value={type}
              onChange={(e) =>
                setType(e.target.value as "dots" | "squares" | "fluid")
              }
              className="w-full p-2 bg-transparent border border-black rounded-full"
            >
              <option value="dots" className="text-black">
                Dots
              </option>
              <option value="fluid" className="text-black">
                Fluid
              </option>
              <option value="squares" className="text-black">
                Squares
              </option>
            </select>
          </div>
          <div className="flex items-center w-full gap-4">
            <p className="cinco:w-[15rem]">QRCode final size (in px)</p>
            <input
              type="number"
              value={size}
              onChange={(e) => {
                setSize(parseInt(e.target.value));
              }}
              className="w-full p-2 px-4 bg-transparent border border-black rounded-full"
            />
          </div>
        </div>
      </div>
      <div className="flex justify-center w-full gap-4">
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-4 py-2 text-white transition-all bg-yellow-500 rounded-full hover:brightness-90"
        >
          Export
          <img
            src={Download}
            alt="qrcode"
            width={20}
            height={20}
            className="invert"
          />
        </button>
        <button
          onClick={action}
          className="flex items-center gap-2 px-4 py-2 text-white transition-all bg-green-400 rounded-full hover:brightness-90"
        >
          {id ? "Update" : "Save"}
        </button>
      </div>
    </div>
  );
}
