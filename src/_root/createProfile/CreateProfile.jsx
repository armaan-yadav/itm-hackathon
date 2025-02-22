import { CityList } from "@/components/shared/CityList";
import { StateList } from "@/components/shared/StateList";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { userContext } from "@/context/userContext";
import { convertToPlainNumber } from "@/lib/utils";
import { userServices } from "@/services/userServices";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateProfile = () => {
  const [stateCode, setStateCode] = useState("HR");
  const [stateName, setStateName] = useState("");
  const [cityName, setCityName] = useState("Ambala");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { user } = useContext(userContext);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setIsLoading(true);
    setError("");

    if (!name.trim()) {
      setError("Name is required");
      setIsLoading(false);
      return;
    }

    if (!age.trim()) {
      setError("Age is required");
      setIsLoading(false);
      return;
    }

    if (!stateName || !cityName) {
      setError("Please select state and city");
      setIsLoading(false);
      return;
    }

    const data = {
      phone: convertToPlainNumber(user.phone),
      state: stateName,
      city: cityName,
      name: name.trim(),
      age: parseInt(age),
    };

    await userServices.addUserIntoDb({ data });
    setIsLoading(false);
    navigate("/");
  };

  return (
    <>
      <section
        className="relative min-h-screen flex items-center bg-cover bg-center"
        style={{ backgroundImage: "url('/images/profile-bg.jpg')" }} // Update with actual image path
      >
        {/* <div className="absolute inset-0 bg-black bg-opacity-10"></div> */}
        <div className="h-screen w-screen flex items-center justify-center">
          <div className="w-[30rem] p-8 bg-white rounded-lg shadow-lg flex flex-col gap-4">
            <h2 className="text-2xl font-semibold text-center text-gray-800">
              Create Your Profile
            </h2>

            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="Enter your age"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label>State</Label>
              <StateList
                setStateCode={setStateCode}
                setStateName={setStateName}
              />
            </div>

            {stateCode && (
              <div className="flex flex-col gap-2">
                <Label>City</Label>
                <CityList setCityName={setCityName} stateCode={stateCode} />
              </div>
            )}

            {error && (
              <p className="text-red-600 text-sm text-center">{error}</p>
            )}

            <Button
              onClick={handleSubmit}
              className="bg-green-700 hover:bg-green-800 text-white font-semibold py-3 rounded-md transition"
            >
              {isLoading ? "Creating..." : "Create Profile"}
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};

export default CreateProfile;
