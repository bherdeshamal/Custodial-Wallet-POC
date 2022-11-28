// src/components/Header.js

import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

const Header = () => {
  const [cookies, removeCookie] = useCookies([]);
  const [value, setValues] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (cookies.jwt && cookies.jwt !== "undefined") {
      setValues(true);
    } else {
      setValues(false);
    }
  }, [cookies, navigate, removeCookie]);

  const logOut = () => {
    removeCookie("jwt");
    navigate("/");
  };
  return (
    <div className="navbar bg-[#FA7D19] text-white  px-16">
      <div className="flex-1">
        <h1 className="btn btn-ghost normal-case text-3xl">Custodial Wallet</h1>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal p-0 font-bold">
          <li>
            {value ? (
              <>
                <li>
                  <Link to="/Custodial-Wallet">Home</Link>
                </li>
                <li>
                  <Link to="/User-Profile">User Profile</Link>
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
                <li onClick={() => logOut()}>
                  <span>Logout</span>
                </li>
              </>
            ) : (
              <li>
                <Link to="/">Register</Link>
              </li>
            )}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Header;
