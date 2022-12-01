// src/App.js
import React from "react";
import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import Home from "./components/Home/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import Profile from "./components/Profile";
import SetMessage from "./components/SetMessage";
import GetTokenFromAdmin from "./components/GetToken";
import TransferToken from "./components/TransferToken";
import "react-toastify/dist/ReactToastify.css";
import Header from "./components/Header";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route
            path="/Get-Tokens-From-Admin"
            element={<GetTokenFromAdmin />}
          />
          <Route path="/Transfer-Token" element={<TransferToken />} />
          <Route path="/Custodial-Wallet" element={<Home />} />
          <Route path="/User-Profile" element={<Profile />} />
          <Route path="/Set-Message" element={<SetMessage />} />
          <Route path="/Register" element={<Register />} />
          <Route exact path="/" element={<Login />} />
          <Route path="/logout" element={<Header />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
