// src/components/Home/Home.js

// import CSS
import "./Home.css";
import React from "react";
import Header from "../Header";
import Footer from "../Footer";

const Home = (props) => {
  return (
    <div>
      <Header />
      <div className="banner-container">
        <div className="text-center">
          <h1 className="text-white text-6xl">Welcome to Custodial Wallet</h1>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
