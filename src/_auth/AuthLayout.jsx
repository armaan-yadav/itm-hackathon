import InputOtp from "@/components/shared/InputOtp";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { userContext } from "@/context/userContext";
import authServices from "@/services/authServices";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  const sendOtp = async () => {
    const userId = await authServices.sendOTP({ phoneNumber });
    setOtpSent(true);
    setUserId(userId);
  };

  const handleOtp = async () => {
    try {
      const existingUser = await authServices.getCurrentUser();

      if (existingUser) {
        // ✅ User is already logged in, redirect to create-profile
        addUser(existingUser);
        navigate("/");
        return;
      }

      // ✅ Proceed with OTP verification only if no active session
      await authServices.verifyOTP({ userId, otp });

      const user = await authServices.getCurrentUser();
      addUser(user);
      navigate("/");
    } catch (error) {
      console.error("Error during authentication:", error);
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-[#387F39]">
      {/* Content Wrapper */}
      <div className="h-full w-full flex items-center gap-28 z-50">
        {/* Rotating Slogan */}
        <div className="w-[50%] flex item-center justify-center ">
          <h2 className="text-white text-2xl font-semibold text-center">
            {currentSlogan}
          </h2>
        </div>

        <div className="w-[50%] flex item-center justify-center">
          <div className="w-[30rem] h-[25rem] p-10 border-none rounded-xl flex item-center justify-center gap-4 flex-col bg-lime-50">
            <label className="text-3xl">Welcome</label>
            <Input
              className="bg-lime-50"
              placeholder={"Enter phone number"}
              type="text"
              pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
              onChange={(e) => {
                setPhoneNumber(e.target.value);
              }}
            />
            {!otpSent && (
              <Button
                className="bg-[#387F39] hover:bg-green-800"
                onClick={sendOtp}
              >
                Send otp
              </Button>
            )}
            {otpSent && (
              <>
                <InputOtp
                  otp={otp}
                  setOtp={setOtp}
                  className="border-2 border-black"
                />
                <Button className="bg-green-600" onClick={handleOtp}>
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
