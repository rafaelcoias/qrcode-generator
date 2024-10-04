import React from "react";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useItems } from "../context";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";

const SignUpWithGoogle = () => {
  const auth = getAuth();
  const { setUser } = useItems();
  const navigate = useNavigate();

  const handleGoogleSignUp = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      // Create doc in firebase for this user
      const userDoc = {
        email: user.email,
        name: user.displayName,
        photoURL: user.photoURL,
      };
      const usersCollection = collection(db, "users");
      await addDoc(usersCollection, userDoc);
      setUser(user);
      navigate("/home");
    } catch (error) {
      console.error("Error signing up with Google:", error);
    }
  };

  return (
    <div className="flex items-center justify-center w-full min-h-screen ">
      <div
        style={{
          borderRadius: "10px",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
          textAlign: "center",
        }}
        className="space-y-6 w-[20rem] p-6"
      >
        <h2 className="font-bold">
          Free and Fully Personalized QRCode Generator
        </h2>

        <button
          onClick={handleGoogleSignUp}
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
          Sign Up with Google
        </button>
        <p>
          Already have an account?{" "}
          <a href="/" className="text-blue-400">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignUpWithGoogle;
