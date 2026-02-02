import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Loader2 } from "lucide-react";
import robo from "../assets/robo.jpg";
import { MessageSquare, Zap, ShieldAlert } from "lucide-react";

const Register = () => {
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const registerUser = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password.length < 6) {
      setError("Password should be minimum length of 6 characters");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        email: formData.email,
        fullName: {
          firstName: formData.firstName,
          lastName: formData.lastName,
        },
        password: formData.password,
      };

      const response = await axios.post(
        "https://ask-freely.onrender.com/api/auth/register",
        payload,
      );
      if (response.status === 201) {
        navigate("/login");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#FDEBD0] p-4 font-sans">
      {/* Main Card Container */}
      <div className="w-full max-w-5xl flex flex-col md:flex-row bg-white rounded-[40px] shadow-2xl overflow-hidden min-h-650px">
        {/* Left Side: Illustration Section */}
        <div
          className="md:w-1/2 p-12 flex flex-col justify-center items-center text-center relative overflow-hidden bg-cover bg-center"
          style={{ backgroundImage: `url(${robo})` }}
        >
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-black/30"></div>

          <div className="relative z-10 grow flex flex-col justify-center items-center">
            <h1 className="text-3xl font-extrabold text-white mb-4">
              Join the community.
            </h1>
            <p className="text-white/80 font-medium max-w-[320px]">
              Create your account and start turning your ideas into reality
              today.
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

            <div className="text-center md:text-left mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Create an account
              </h2>
              <p className="text-gray-400 text-sm mt-1">
                Start your journey with Ask-Freely AI
              </p>
            </div>
            {error && (
              <div className="mb-4 text-red-500 text-xs bg-red-50 p-3 rounded-lg border border-red-100 text-center">
                {error}
              </div>
            )}

            <form className="space-y-4" onSubmit={registerUser}>
              {/* Name Fields Row */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 space-y-1">
                  <label className="text-xs font-semibold text-gray-500 ml-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    placeholder="Jatin"
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#7D0A39] focus:border-[#7D0A39] outline-none transition-all"
                    // ye overwrite krdega pehle wale formData ko, isliye spread operator use krre hai
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="flex-1 space-y-1">
                  <label className="text-xs font-semibold text-gray-500 ml-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    placeholder="Rajoria"
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#7D0A39] focus:border-[#7D0A39] outline-none transition-all"
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 ml-1">
                  Email ID
                </label>
                <input
                  type="email"
                  placeholder="mail@abc.com"
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#7D0A39] focus:border-[#7D0A39] outline-none transition-all"
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
                  placeholder="Min. 6 characters"
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#7D0A39] focus:border-[#7D0A39] outline-none transition-all"
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 mt-4 bg-[#7D0A39] hover:bg-[#5a0729] text-white font-bold rounded-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg"
              >
                {loading ? (
                  <Loader2 className="animate-spin w-5 h-5" />
                ) : (
                  "Create Account"
                )}
              </button>
            </form>
            <p className="text-center text-xs text-gray-500 mt-6">
              Already have an account?
              <Link
                to="/login"
                className="ml-1 text-[#7D0A39] font-bold hover:underline"
              >
                Login Here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
