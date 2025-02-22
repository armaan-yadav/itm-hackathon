import { userContext } from "@/context/userContext";
import React, { useContext } from "react";

const ProfilePage = () => {
  const { user } = useContext(userContext);
  console.log(user);
  return <div className="h-screen">ProfilePage</div>;
};

export default ProfilePage;
