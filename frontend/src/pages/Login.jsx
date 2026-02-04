import axios from "axios";
import { Loader2 } from "lucide-react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import robo from "../assets/robo.jpg";
import { MessageSquare, Zap, ShieldAlert } from "lucide-react";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const loginUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "https://ask-freely.onrender.com/api/auth/login",
        formData,
        {
          withCredentials: true,
        },
      );
      if (response.status === 200) {
        navigate("/");
        const username = response.data.user.fullName.firstName;
        localStorage.setItem('userName', username);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-(--aimessage-color) p-4 font-sans">
      {/* Main Card Container */}
      <div className="w-full max-w-5xl flex flex-col md:flex-row bg-white rounded-[40px] shadow-2xl overflow-hidden min-h-600px">
        {/* Left Side: Illustration Section */}
        <div
          className="md:w-1/2 p-12 flex flex-col justify-between items-center text-center relative overflow-hidden bg-cover bg-center"
          style={{ backgroundImage: `url(${robo})` }}
        >
          <div className="absolute inset-0 bg-black/30"></div>

          <div className="relative z-10 grow flex flex-col justify-center items-center">
            <h1 className="text-3xl font-extrabold text-[white] mb-4">
              Turn your ideas into reality.
            </h1>
            <p className="text-white/80 font-medium max-w-[320px]">
              Your AI companion is waiting for you. Let's continue where you left off.
            </p>
          </div>
        </div>

        {/* Right Side: Form Section */}
        <div className="md:w-1/2 px-10 pt-6 pb-5 md:px-14 md:pt-6 md:pb-8 flex flex-col bg-white">
          <div className="max-w-md mx-auto w-full">
            {/* Logo/Icon */}
            <div className="mb-2 flex justify-center md:justify-start">
              <div className=" text-[white] bg-[#7D0A39]  p-2 rounded-full">
        <Zap className="dark:text-blue-500" size={48} />
      </div>
            </div>

            <div className="text-center md:text-left mb-4">
              <h2 className="text-2xl font-bold text-gray-800">
                Login to your Account
              </h2>
              <p className="text-gray-400 text-sm mt-1">
                See what is going on with your business
              </p>
            </div>
            {/* Google Button */}
           {/*  <button className="w-full py-2.5 border border-gray-200 rounded-lg flex items-center justify-center gap-3 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all mb-6">
              <img
                src="https://www.svgrepo.com/show/355037/google.svg"
                className="w-4 h-4"
                alt="Google"
              />
              Continue with Google
            </button> */}


            {error && (
              <div className="mb-4 text-red-500 text-xs bg-red-50 p-3 rounded-lg border border-red-100 text-center">
                {error}
              </div>
            )}

            <form className="space-y-4" onSubmit={loginUser}>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 ml-1">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="mail@abc.com"
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#7D0A39] focus:border-[#7D0A39] outline-none transition-all placeholder:text-gray-300"
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 ml-1">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="********"
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#7D0A39] focus:border-[#7D0A39] outline-none transition-all placeholder:text-gray-300"
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                />
              </div>
        
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#7D0A39] hover:bg-[#5a0729] text-white font-bold rounded-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg"
              >
                {loading ? (
                  <Loader2 className="animate-spin w-5 h-5" />
                ) : (
                  "Login"
                )}
              </button>
            </form>
            <p className="text-center text-xs text-gray-500 mt-6">
              Not Registered Yet?
              <Link
                to="/register"
                className="ml-1 text-[#7D0A39] font-bold hover:underline"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
