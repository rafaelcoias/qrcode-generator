import React, { useEffect, useState } from "react";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useItems } from "./context";

// Components
// import Navbar from "./components/Navbar";

// Pages
import Login from "./pages/Login";
import Home from "./pages/Home";
import NotFoundPage from "./pages/NotFound";
import SignUp from "./pages/SignUp";
import { auth, db } from "./firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import QRCode from "./pages/QRCode";

function App() {
  const { setUser } = useItems();

  const [isLogged, setIsLogged] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setIsLogged(!!user);
      if (user) {
        const userInfo = await fetchUserInfo();
        if (!userInfo) {
          alert("User not found");
          auth.signOut();
          return;
        }
        setUser(userInfo);
        setIsLoading(false);
      } else {
        setIsLoading(false);
        setIsLogged(false);
      }
    });
    return () => unsubscribe();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchUserInfo = async () => {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", auth?.currentUser?.email));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) return null;
    const userDoc = querySnapshot.docs[0];
    const user = { id: userDoc.id, ...userDoc.data() };
    return user;
  };

  const Layout = ({ children }: { children: any }) => {
    return (
      <div className="flex flex-col oitocentos:flex-row">
        {/* <Navbar /> */}
        {/* <div className="w-full text-[var(--black)] pt-[5rem] oito:pt-0 oito:pl-[17rem]"> */}
        {children}
        {/* </div> */}
      </div>
    );
  };

  if (isLoading)
    return (
      <div className="min-h-screen w-full flex justify-center items-center text-[2rem]">
        <h1>Loading...</h1>
      </div>
    );

  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Login />} />
        <Route path="signup" element={<SignUp />} />
        {isLogged && (
          <>
            <Route
              path="/home"
              element={
                <Layout>
                  <Home />
                </Layout>
              }
            />
            <Route
              path="/create"
              element={
                <Layout>
                  <QRCode />
                </Layout>
              }
            />
            <Route
              path="/:id"
              element={
                <Layout>
                  <QRCode />
                </Layout>
              }
            />
          </>
        )}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
