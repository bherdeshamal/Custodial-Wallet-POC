import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import Header from "./Header";
import Footer from "./Footer";

function TransferToken() {
  const [values, setValues] = useState({
    user: "",
    userId: "",
    amount: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      const resultApprove = await axios.post(
        "http://localhost:4000/ApproveUser",
        {
          amount: values.amount,
          userId: JSON.parse(localStorage.getItem("user")),
        }
      );

      const result = await axios.post(
        "http://localhost:4000/transferTokenOnSell",
        {
          amount: values.amount,
          user: values.user,
          userId: JSON.parse(localStorage.getItem("user")),
        }
      );
      setLoading(false);
      toast(`${result.data}🦄`, {
        // theme: "dark",
        position: "bottom-right",
      });
    } catch (ex) {
      setLoading(false);
      console.log(ex);
      toast(`${ex}🦄`, {
        // theme: "dark",
        position: "bottom-right",
      });
    }
  };

  useEffect(() => {
    setValues({
      ...values,
      userId: JSON.parse(localStorage.getItem("user")),
    });
  }, []);

  return (
    <>
      <Header />
      <div className=" flex justify-center lg:h-screen items-center banner-container">
        <div className="card w-full md:w-96 items-center shadow-2xl bg-base-100">
          <br />{" "}
          <h2 className="text-center normal-case text-3xl">Transfer Tokens</h2>
          <ToastContainer />
          <form
            onSubmit={(e) => handleSubmit(e)}
            className="card-body w-full lg:w-96"
          >
            <div className="form-control">
              <label className="label">Receiver's Address</label>
              <input
                type="text"
                name="user"
                placeholder="Enter receiver address "
                className="input input-bordered"
                onChange={(e) => setValues({ ...values, user: e.target.value })}
              />
            </div>

            <div className="form-control">
              <label className="label">Amount</label>
              <input
                type="number"
                name="amount"
                placeholder="Enter Amount of Tokens"
                className="input input-bordered"
                onChange={(e) =>
                  setValues({ ...values, amount: e.target.value })
                }
              />
            </div>

            <div className="form-control mt-6">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? "Loading ..." : "Transfer Tokens"}
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default TransferToken;
