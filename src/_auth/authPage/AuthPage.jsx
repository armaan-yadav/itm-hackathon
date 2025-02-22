import InputOtp from "@/components/shared/InputOtp";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { userContext } from "@/context/userContext";
import authServices from "@/services/authServices";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "/images/brand-logo.png";
import { FaPhone, FaKey } from "react-icons/fa"; // Icons for phone and OTP
import { useToast } from "@/lib/utils";

const slogans = [
  "Growing Smarter, Farming Better! 🌱🚜",
  "Empowering Farmers, Cultivating the Future! 🌾🚜",
  "Harvesting the Future, Cultivating Innovation! 🌾🚜",
];

const AuthPage = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [userId, setUserId] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [currentSlogan, setCurrentSlogan] = useState(slogans[0]);

  const { addUser } = useContext(userContext);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlogan(slogans[Math.floor(Math.random() * slogans.length)]);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const sendOtp = async () => {
    const userId = await authServices.sendOTP({ phoneNumber });
    setOtpSent(true);
    useToast("OTP sent successfully");
    setUserId(userId);
  };

  const handleOtp = async () => {
    try {
      const existingUser = await authServices.getCurrentUser();

      if (existingUser) {
        addUser(existingUser);
        navigate("/create-profile");
        return;
      }

      await authServices.verifyOTP({ userId, otp });

      const user = await authServices.getCurrentUser();
      addUser(user);
      navigate("/create-profile");
    } catch (error) {
      console.error("Error during authentication:", error);
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-[#387F39] to-[#2A5C2A]">
      <div className="h-full w-full flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-28 z-50 p-4">
        {/* Slogan Section */}
        <div className="w-full lg:w-[50%] flex items-center justify-center text-center">
          <h2 className="text-white text-xl sm:text-2xl font-semibold">
            {currentSlogan}
          </h2>
        </div>

        {/* Auth Form Section */}
        <div className="w-full lg:w-[50%] flex items-center justify-center">
          <div className="w-full sm:w-[30rem] h-auto sm:h-[25rem] p-6 sm:p-10 border-none rounded-xl flex flex-col gap-6 bg-lime-50 shadow-lg">
            {/* Logo */}
            <div className="flex justify-center">
              <img
                src={logo}
                alt="Brand Logo"
                className="w-24 h-24 mb-4 rounded-full shadow-md"
              />
            </div>

            {/* Welcome Text */}
            <label className="text-2xl sm:text-3xl font-semibold text-center text-gray-800">
              Welcome
            </label>

            {/* Phone Input */}
            <div className="relative">
              <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                className="bg-lime-50 pl-10"
                placeholder="Enter phone number"
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>

            {/* Send OTP Button */}
            {!otpSent && (
              <Button
                className="bg-[#387F39] hover:bg-green-800 w-full transition-all duration-300"
                onClick={sendOtp}
              >
                Send OTP
              </Button>
            )}

            {/* OTP Input and Verify Button */}
            {otpSent && (
              <>
                <div className="relative">
                  <FaKey className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <InputOtp
                    otp={otp}
                    setOtp={setOtp}
                    className="border-2 border-gray-300 pl-10"
                  />
                </div>
                <Button
                  className="bg-green-600 hover:bg-green-700 w-full transition-all duration-300"
                  onClick={handleOtp}
                >
                  Verify OTP
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
