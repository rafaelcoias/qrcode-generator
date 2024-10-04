import React, { useEffect, useState } from "react";
import "./styles.navbar.css";

import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaCar, FaMoneyBillTrendUp, FaRegFolder } from "react-icons/fa6";
import { FaParking } from "react-icons/fa";
import { IoIosSettings } from "react-icons/io";
import { HiOutlineLogout } from "@react-icons/all-files/hi/HiOutlineLogout";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const [menuActive, setMenuActive] = useState(false);

  const lang: string = "en";

  useEffect(() => {
    setMenuActive(false);
    document.body.style.overflow = "auto";
    window.scroll(0, 0);
  }, [location]);

  interface CustomLinkProps {
    href: string;
    icon?: React.ComponentType<{ width?: number }>;
    children: React.ReactNode;
  }

  const CustomLink: React.FC<CustomLinkProps> = ({
    href,
    icon: Icon,
    children,
  }) => {
    let selected = href === window.location.pathname;
    return (
      <div className="group">
        <Link
          to={href}
          className={`flex gap-4 rounded-full p-3 items-center oito:px-8 oito:p-3  ${
            selected ? " text-[var(--primary)]" : ""
          }`}
        >
          {Icon && (
            <span className="group-hover:text-[var(--primary)]">
              <Icon />
            </span>
          )}
          <p className="text-[1rem] font-bold group-hover:text-[var(--primary)]">
            {children}
          </p>
        </Link>
      </div>
    );
  };

  async function logOut() {
	navigate('/')
  }

  const toggleMenu = () => {
    if (!menuActive) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";
    setMenuActive(!menuActive);
  };

  return (
    <div id="navbar" className="relative ">
      <div
        className={`transition-all duration-300 fixed top-0 left-0 h-full flex flex-col items-start justify-center oito:justify-between oito:h-screen oito:w-[17rem] w-full bg-[white] px-4 oito:px-8 text-gray py-8 pl-[8vw] oito:py-4 z-[10] oito:translate-y-0 ${
          menuActive ? "translate-y-0" : "translate-y-[-100%]"
        }`}
      >
        <div className="flex flex-col h-full gap-8">
          <div className="flex-col hidden gap-4 oito:items-start oito:flex">
            <img src={"/content/logo.png"} alt="logo" className={`w-[15rem]`} />
            <h2 className="text-[1.2rem] text-[var(--primary)] font-bold pl-4">
              CLIENT
            </h2>
          </div>
          <div className="flex flex-col justify-between h-full gap-2 pt-12 oito:pt-0">
            <div className="flex flex-col h-full gap-2">
              <CustomLink icon={FaRegFolder} href="/home">
                {lang === "pt" ? "Minha Conta" : "My Account"}
              </CustomLink>
              <CustomLink icon={FaCar} href="/vehicles">
                {lang === "pt" ? "Veículos" : "Vehicles"}
              </CustomLink>
              <CustomLink icon={FaParking} href="/bookings">
                {lang === "pt" ? "Reservas" : "Bookings"}
              </CustomLink>
              <CustomLink icon={FaMoneyBillTrendUp} href="/billing">
                {lang === "pt" ? "Pagamentos" : "Billing"}
              </CustomLink>
            </div>
            <div className="flex flex-col gap-2 ">
              <CustomLink icon={IoIosSettings} href="/settings">
                {lang === "pt" ? "Definições" : "Settings"}
              </CustomLink>
              <div
                onClick={logOut}
                className={`flex gap-4 rounded-full p-3 items-center oito:px-8 oito:p-3 cursor-pointer hover:text-[var(--primary)]`}
              >
                <HiOutlineLogout className="group-hover:text-[var(--white)]"></HiOutlineLogout>
                <p className="text-[1rem] font-bold group-hover:text-[var(--primary)]">
                  {lang === "pt" ? "Sair" : "Logout"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="oito:hidden fixed top-0 left-0 flex justify-between w-full bg-[var(--darkgray)] h-[5rem] items-center px-[8vw] z-[30]">
        <img src={"/content/logo.png"} alt="logo" className={`w-28 z-[20]`} />
        <div
          onClick={toggleMenu}
          id="menu-btn"
          className={`w-[20px] h-7 flex flex-col justify-evenly items-center z-[20] ${
            menuActive && "active"
          }`}
        >
          <div className="menu-btn-bar bg-[black] relative w-full h-[3px]"></div>
          <div className="menu-btn-bar bg-[black] relative w-full h-[3px]"></div>
          <div className="menu-btn-bar bg-[black] relative w-full h-[3px]"></div>
        </div>
      </div>
    </div>
  );
}
