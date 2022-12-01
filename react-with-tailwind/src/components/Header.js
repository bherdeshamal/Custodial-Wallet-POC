// src/components/Header.js

import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

const Header = () => {
  const [cookies] = useCookies(["jwt"]);
  const [value, setValues] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // if (cookies.jwt && cookies.jwt !== "undefined") {
    if (localStorage.user) {
      setValues(true);
    } else {
      setValues(false);
    }
  }, [cookies, navigate]);

  // const logOut = () => {
  //   // removeCookie("jwt");
  //   navigate("/");
  // };

  const logout = async () => {
    try {
      const res = await axios.get("http://localhost:4000/logout");
      toast(` ${res.data.message} 🦄`, {
        position: "bottom-right",
      });
      localStorage.clear();
      navigate("/");
    } catch (error) {
      console.log(error);
      toast(` ${error} 🦄`, {
        position: "bottom-right",
      });
    }
  };

  return (
    <div className="navbar bg-[#FA7D19] text-white  px-16">
      <div className="flex-1">
        <h1 className=" normal-case text-4xl">Custodial Wallet</h1>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal p-0 font-bold">
          <li>
            <ToastContainer />
            {value ? (
              <>
                <li>
                  <Link to="/Custodial-Wallet">Home</Link>
                </li>
                <li>
                  <Link to="/User-Profile">My Wallet</Link>
                </li>
                <li>
                  <Link to="/Set-Message">Set Message</Link>
                </li>
                <li>
                  <Link to="/Get-Tokens-From-Admin">Get Tokens</Link>
                </li>
                <li>
                  <Link to="/Transfer-Token">Transfer Tokens</Link>
                </li>
                <li onClick={() => logout()}>
                  <span>Logout</span>
                </li>
              </>
            ) : (
              <li>
                <Link to="/Register">Register</Link>
              </li>
            )}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Header;
