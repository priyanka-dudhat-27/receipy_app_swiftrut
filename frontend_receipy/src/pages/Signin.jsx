import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthProvider";
import { motion } from "framer-motion";

export default function Signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const notify1 = (msg) => toast.error(msg);
  const notify2 = (msg) => toast.success(msg);

  const emailRegex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const passwordRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/;

  const loginData = async (e) => {
    e.preventDefault();

    if (!emailRegex.test(email)) {
      notify1("Invalid email format");
      return;
    }
    if (!passwordRegex.test(password)) {
      notify1(
        "Invalid password format, must contain a number, must contain one lowercase, must contain one uppercase, must contain one special character, password must be 8-16 characters long"
      );
      return;
    }

    try {
      const response = await login(email, password);
      notify2(response.message);
      navigate("/");
    } catch (error) {
      if (error.response) {
        notify1(error.response.data.message);
      } else {
        notify1(error.message);
      }
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-100 to-blue-200 min-h-screen">
      <div className="container mx-auto">
        <div className="flex justify-center items-center min-h-screen">
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white p-10 rounded-lg shadow-xl text-center"
          >
            <h1 className="mb-10 text-2xl md:text-5xl font-bold text-blue-800">
              Ocian Restro
            </h1>

            <form className="flex flex-col gap-4" onSubmit={loginData}>
              <input
                className="p-3 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                name="email"
              />
              <input
                className="p-3 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                name="password"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-blue-500 text-white rounded-md py-3 font-medium hover:bg-blue-600 transition duration-300"
                type="submit"
              >
                Sign in
              </motion.button>
              <p className="text-blue-600">
                Already have not an account?{" "}
                <Link className="font-medium hover:underline" to="/signup">
                  Sign Up
                </Link>
              </p>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}