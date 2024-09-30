import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const notify1 = (msg) => toast.error(msg);
  const notify2 = (msg) => toast.success(msg);

  const emailRegex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const passwordRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/;

  const sendData = async (e) => {
    e.preventDefault();
    if (!emailRegex.test(email)) {
      notify1("Invalid email format");
      return;
    }
    if (!passwordRegex.test(password)) {
      notify1(
        "Invalid password format,  must contain a number, must contain one lowercase, must contain one uppercase, must contain one special character, password must be 8-16 characters long"
      );
      return;
    }

    try {
      const response = await axios.post(`${BASE_URL}/users/register`, {
        name,
        email,
        password,
      });

      notify2(response.data.message);
      navigate("/signin");
    } catch (error) {
      if (error.response) {
        notify1(error.response.data.message);
      } else {
        notify1(error.message);
      }
      navigate("/signup");
    }
  };

  return (
    <div className="bg-gray-100 h-screen">
      <div className="container mx-auto">
        <div className="flex justify-center items-center h-screen">
          <div className="bg-white p-10 rounded-md text-center shadow-md">
            <h1 className="mb-5 text-2xl md:text-5xl font-bold text-gray-800">
            Ocian Restro
            </h1>
            <h2 className="mb-5 text-xl font-semibold text-gray-600">
              Complete Your Tasks With Us
            </h2>
            <form className="flex flex-col gap-2" onSubmit={sendData}>
              <input
                className="mb-3 p-2 rounded-sm"
                type="text"
                placeholder="Username"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
                name="name"
              />
              <input
                className="mb-3 p-2 rounded-sm"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                name="email"
              />
              <input
                className="mb-3 p-2 rounded-sm"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                name="password"
              />
              <button className="bg-blue-600 hover:bg-blue-700 text-white rounded-md py-2 my-4" type="submit">
                Sign up
              </button>
              <p>
                Already have an account?{" "}
                <Link className="text-blue-600 hover:text-blue-800" to="/signin">
                  Sign in
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}