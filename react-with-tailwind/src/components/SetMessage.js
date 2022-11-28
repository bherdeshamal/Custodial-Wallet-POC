import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import Header from "./Header";
import Footer from "./Footer";

function SetMessage() {
  const [values, setValues] = useState({ newMessage: "", userId: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      const result = await axios.post("http://localhost:4000/setMessage", {
        newMessage: values.newMessage,
        userId: JSON.parse(localStorage.getItem("user")),
      });
      setLoading(false);
      console.log(result);
      toast(`${result.data}🦄`, {
        // theme: "dark",
        position: "bottom-right",
      });
    } catch (ex) {
      setLoading(false);
      console.log(ex);
    }
  };

  useEffect(() => {
    setValues({ ...values, userId: JSON.parse(localStorage.getItem("user")) });
  }, []);

  return (
    <>
      <Header />
      <div className=" flex justify-center lg:h-screen items-center banner-container">
        <div className="card w-full md:w-96 items-center shadow-2xl bg-base-100">
          <br />
          <h2 className="text-center normal-case text-3xl">Set Message </h2>
          <ToastContainer />
          <form
            onSubmit={(e) => handleSubmit(e)}
            className="card-body w-full lg:w-96"
          >
            {/* <div className="form-control">
              <label className="label">User Id</label>
              <input
                type="text"
                name="id"
                placeholder="user id"
                className="input input-bordered"
                value={values.userId}
              />
            </div> */}
            <div className="form-control">
              <label className="label">Set Message</label>
              <input
                type="text"
                name="newMessage"
                placeholder="Set Message"
                className="input input-bordered"
                onChange={(e) => setValues({ newMessage: e.target.value })}
              />
            </div>

            <div className="form-control mt-6">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? "Loading ..." : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default SetMessage;
