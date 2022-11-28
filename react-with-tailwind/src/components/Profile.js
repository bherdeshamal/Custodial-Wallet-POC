import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import Footer from "./Footer";
import Header from "./Header";

export default function Cards() {
  const navigate = useNavigate();
  const [cookies, removeCookie] = useCookies([]);

  const [values, setValues] = useState({
    email: "",
    userAddress: "",
  });

  const [message, setMessage] = useState("");
  const [balance, setBalance] = useState("");

  useEffect(() => {
    const verifyUser = async () => {
      if (!cookies.jwt) {
        navigate("/");
      } else {
        const { data } = await axios.post(
          "http://localhost:4000",
          {},
          {
            withCredentials: true,
          }
        );
        if (!data.status) {
          removeCookie("jwt");
          navigate("/");
        } else
          toast(`Hi ${data.user} 🦄`, {
            // theme: "dark",

            position: "bottom-right",
          });
      }
    };
    verifyUser();
  }, [cookies]);

  const id = JSON.parse(localStorage.getItem("user"));

  const getUserDetails = async () => {
    const result = await axios.get(`http://localhost:4000/getItems?id=${id}`);
    setValues({ ...result.data });
  };

  const getMessage = async () => {
    const result = await axios.post(`http://localhost:4000/getMessage`, {
      userId: id,
    });
    setMessage(result.data);
  };

  const getUserBalance = async () => {
    const result = await axios.post(`http://localhost:4000/getUserBalance`, {
      userId: id,
    });
    setBalance(result.data);
  };

  useEffect(() => {
    getUserDetails();
    getMessage();
    getUserBalance();
  }, []);

  return (
    <>
      <Header />

      <div className=" flex justify-center lg:h-screen items-center banner-container">
        <div className="card w-full md:w-96 items-left shadow-3xl bg-base-200">
          <h2 className="text-center normal-case text-3xl">My Wallet</h2>
          <div className="card-body w-full lg:w-96">
            <div className="form-control">
              <label className="label">User Email</label>

              <input className="input input-bordered" value={values.email} />
            </div>
            <div className="form-control">
              <label className="label">Wallet Address</label>

              <input
                className="input input-bordered"
                value={values.userAddress}
              />
            </div>
            <div className="form-control">
              <label className="label">User Message</label>

              <input
                className="input input-bordered"
                value={`Your Message is ${message} `}
              />
            </div>
            <div className="form-control">
              <label className="label">User Balance</label>

              <input
                className="input input-bordered"
                value={`Your Balance is ${balance} Matic Token`}
              />
            </div>
            <ToastContainer />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
