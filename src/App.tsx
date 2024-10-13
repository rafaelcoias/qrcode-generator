import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useItems } from "./context";

// Pages
import Login from "./pages/Login";
import Home from "./pages/Home";
import NotFoundPage from "./pages/NotFound";
import QRCode from "./pages/QRCode";
import CircularProgress from "@mui/material/CircularProgress";
import { useEffect, useState } from "react";
import { auth } from "./firebase";

function App() {
  const { user } = useItems();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setIsLoading(true);
      if (!user) {
        setIsLoading(false);
        return;
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

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
        <CircularProgress />
      </div>
    );

  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Login />} />
        {user && (
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
