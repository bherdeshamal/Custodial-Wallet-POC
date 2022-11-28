import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useCookies } from "react-cookie";
import { Link, useNavigate } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";

function Register() {
  const [cookies] = useCookies(["cookie-name"]);
  const navigate = useNavigate();
  useEffect(() => {
    if (cookies.jwt) {
      navigate("/Custodial-Wallet");
    }
  }, [cookies, navigate]);

  const [values, setValues] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const generateError = (error) =>
    toast.error(error, {
      position: "bottom-right",
    });
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      const { data } = await axios.post(
        "http://localhost:4000/register",
        {
          ...values,
        },
        { withCredentials: true }
      );
      setLoading(false);
      if (data) {
        if (data.errors) {
          const { email, password } = data.errors;
          if (email) generateError(email);
          else if (password) generateError(password);
        } else {
          navigate("/Custodial-Wallet");
        }
      }
    } catch (ex) {
      setLoading(false);
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
            Register Your Account
          </h2>
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
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? "Loading ..." : "Register"}
              </button>
            </div>
            <label className="mt-2">
              Already have an account?{" "}
              <Link
                to="/Sign-in"
                className="btn btn-link text-blue underline px-0"
              >
                Login
              </Link>
            </label>
          </form>
          <ToastContainer />
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Register;
