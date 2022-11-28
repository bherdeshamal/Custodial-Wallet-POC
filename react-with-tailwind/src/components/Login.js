import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "./Header";
import Footer from "./Footer";

function Login() {
  const [cookies, removeCookies] = useCookies([]);
  const navigate = useNavigate();
  useEffect(() => {
    if (cookies.jwt) {
      removeCookies("jwt");
      navigate("/");
    }
  }, [cookies, navigate]);

  const [values, setValues] = useState({ email: "", password: "" });
  const generateError = (error) =>
    toast.error(error, {
      position: "bottom-right",
    });
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const { data } = await axios.post(
        "http://localhost:4000/login",
        {
          ...values,
        },
        { withCredentials: true }
      );
      if (data) {
        if (data.errors) {
          const { email, password } = data.errors;
          if (email) generateError(email);
          else if (password) generateError(password);
        } else {
          localStorage.setItem("user", JSON.stringify(data.user));
          navigate("/Custodial-Wallet");
        }
      }
    } catch (ex) {
      console.log(ex);
    }
  };

  return (
    <>
      <Header />
      <div className=" flex justify-center lg:h-screen items-center banner-container">
        <div className="card w-full md:w-96 items-center shadow-2xl bg-base-100">
          <br />
          <h2 className="text-center normal-case text-3xl">
            Login to your Account
          </h2>
          <ToastContainer />

          <form
            onSubmit={(e) => handleSubmit(e)}
            className="card-body w-full lg:w-96"
          >
            <div className="form-control">
              <label className="label">Email</label>
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="input input-bordered"
                onChange={(e) =>
                  setValues({ ...values, [e.target.name]: e.target.value })
                }
              />
            </div>
            <div className="form-control">
              <label className="label">Password</label>
              <input
                type="password"
                placeholder="Password"
                name="password"
                className="input input-bordered"
                onChange={(e) =>
                  setValues({ ...values, [e.target.name]: e.target.value })
                }
              />
            </div>
            <div className="form-control mt-6">
              <button type="submit" className="btn btn-primary">
                Submit
              </button>
            </div>
            <label className="mt-2">
              Don't have an account ?
              <Link
                to="/Register"
                className="btn btn-link text-blue underline px-0"
              >
                Register
              </Link>
            </label>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Login;
