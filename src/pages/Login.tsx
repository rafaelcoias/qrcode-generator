import React, { useEffect, useState } from "react";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LoginWithGoogle = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in, if so, redirect to home
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!!user) navigate("/home");
      else setLoading(false);
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      // Sign in with Google
      await signInWithPopup(auth, provider);
    } catch (error) {
      toast.error("Error logging in with Google");
      console.error("Error logging in with Google:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full flex justify-center items-center text-[2rem]">
        <h1>Loading...</h1>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center w-full min-h-screen ">
      <ToastContainer />
      <div
        style={{
          borderRadius: "10px",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
          textAlign: "center",
        }}
        className="space-y-6 w-[20rem] p-6"
      >
        <h1>Welcome!</h1>
        <h2 className="font-bold">
          Check Out This Free and Fully Personalized QRCode Generator
        </h2>
        <button
          onClick={handleGoogleLogin}
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#4285F4",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Login with Google
        </button>
      </div>
    </div>
  );
};

export default LoginWithGoogle;
