import React from "react";
import { useItems } from "../context";
import { Link, useNavigate } from "react-router-dom";
import { QRCode } from "react-qrcode-logo";
import { deleteDoc, doc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { signOut } from "firebase/auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { QRCode as QRCodeI } from "../types/types";

export default function Home() {
  const navigate = useNavigate();
  const { items, setItems, user } = useItems();

  const removeItem = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this QRCode?")) {
      return;
    }

    try {
      if (!user) {
        throw new Error("User is not authenticated");
      }
      const qrCodeDocRef = doc(db, "users", user.id, "qrcodes", id);
      await deleteDoc(qrCodeDocRef);
      const newItems = items.filter((ele: QRCodeI) => ele.id !== id);
      setItems(newItems);
      toast.success("QRCode deleted successfully");
    } catch (error) {
      console.error("Error deleting document:", error);
      toast.error("Error deleting QRCode");
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error logging out:", error);
    }
    navigate("/");
  };

  return (
    <div className="p-[2rem] space-y-6">
      <ToastContainer />
      <div className="flex items-center justify-between">
        <h1 className="text-[1.5rem] seis:text-[2rem] font-bold">
          Welcome back {user?.name?.split(" ")[0] || user?.name} !
        </h1>
        <button
          className="px-4 py-2 text-white transition-all bg-blue-400 rounded-full hover:brightness-90"
          onClick={logout}
        >
          Logout
        </button>
      </div>
      <div className="flex flex-col-reverse items-center justify-between gap-4 cinco:flex-row">
        <h2 className="text-[1.5rem] seis:text-[2rem]">My QRCodes</h2>
        <button
          className="px-4 py-2 text-white transition-all bg-green-400 rounded-full hover:brightness-90"
          onClick={() => navigate("/create")}
        >
          Create new QRCode
        </button>
      </div>
      <div className="qrcode-container">
        {items && items.length !== 0 ? (
          items.map((ele: QRCodeI, index: number) => {
            return (
              <div key={index} className="flex flex-col items-center space-y-4">
                <Link
                  to={`/${ele.id}`}
                  className="border shadow-lg w-[12rem] p-4 space-y-4 rounded-[25px]"
                >
                  <div className="w-full overflow-hidden">
                    <QRCode
                      size={256}
                      style={{ height: "auto", width: "100%" }}
                      value={ele.link}
                      logoImage={ele.image}
                      logoWidth={60}
                      logoHeight={60}
                      bgColor={ele.bgColor}
                      fgColor={ele.fgColor}
                      qrStyle={
                        ele.type as "dots" | "squares" | "fluid" | undefined
                      }
                      eyeColor={ele.eyeColor}
                      eyeRadius={ele.eyeRadius}
                    />
                  </div>
                  <p className="font-bold text-center capitalize">
                    {ele?.name || "No name"}
                  </p>
                </Link>
                <button
                  className="px-4 py-1 text-red-400 border border-red-400 rounded-full"
                  onClick={() => removeItem(ele.id)}
                >
                  Remove
                </button>
              </div>
            );
          })
        ) : (
          <p>You dont have any QRcodes generated</p>
        )}
      </div>
    </div>
  );
}
