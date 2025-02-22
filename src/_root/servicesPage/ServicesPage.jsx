import { Link, useNavigate } from "react-router-dom";
import { userContext } from "@/context/userContext";
import { useContext } from "react";
import { Button } from "@/components/ui/button";

const ServicesPage = () => {
  const navigate = useNavigate();
  const { user } = useContext(userContext);

  const handleBuyProducts = () => {
    if (user) {
      navigate("/all-products"); // Redirect to profile creation if logged in
    } else {
      navigate("/auth"); // Redirect to authentication if not logged in
    }
  };

  const handleViewMyOrders = () => {
    if (user) {
      navigate("/my-orders");
    } else {
      navigate("/auth"); // Redirect to authentication if not logged in
    }
  };

  return (
    <div className="h-screen p-4 sm:p-8 md:p-28 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 md:gap-12">
      <div
        className="flex flex-col items-center justify-center gap-4 bg-white shadow-lg rounded-lg p-6"
        style={{
          backgroundImage: "url('/images/lease.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <h2 className="text-2xl sm:text-4xl md:text-5xl text-white font-bold mb-2 text-center">
          Land Leasing
        </h2>
        <Button className="hover:bg-white hover:text-black text-white w-full sm:w-1/2 mx-auto px-4 py-2 rounded bg-green-600">
          <Link to={"/all-lands"}>Learn More</Link>
        </Button>
      </div>
      <div
        className="flex flex-col items-center justify-center gap-4 bg-white shadow-lg rounded-lg p-6"
        style={{
          backgroundImage: "url('/images/lease.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <h2 className="text-2xl sm:text-4xl md:text-5xl text-white font-bold mb-2 text-center">
          List New Land
        </h2>
        <Button className="hover:bg-white hover:text-black text-white w-full sm:w-1/2 mx-auto px-4 py-2 rounded bg-green-600">
          <Link to={"/list-land"}>Learn More</Link>
        </Button>
      </div>
      <div
        className="flex flex-col items-center justify-center gap-4 bg-white shadow-lg rounded-lg p-6"
        style={{
          backgroundImage: "url('/images/groceries.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <h2 className="text-2xl sm:text-4xl md:text-5xl text-white font-bold mb-2 text-center">
          Buy Groceries
        </h2>
        <Button
          onClick={handleBuyProducts}
          className="hover:bg-white hover:text-black text-white w-full sm:w-1/2 mx-auto px-4 py-2 rounded bg-green-600"
        >
          <Link to={"/all-products"}>Learn More</Link>
        </Button>
      </div>

      <div
        className="flex flex-col items-center justify-center gap-4 bg-white shadow-lg rounded-lg p-6"
        style={{
          backgroundImage: "url('/images/groceries.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <h2 className="text-2xl sm:text-4xl md:text-5xl text-white font-bold mb-2 text-center">
          View My Orders
        </h2>
        <Button className="hover:bg-white hover:text-black text-white w-full sm:w-1/2 mx-auto px-4 py-2 rounded bg-green-600">
          <Link to={"/my-orders"}>Learn More</Link>
        </Button>
      </div>
      <div
        className="flex flex-col items-center justify-center gap-4 bg-white shadow-lg rounded-lg p-6"
        style={{
          backgroundImage: "url('/images/groceries.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <h2 className="text-2xl sm:text-4xl md:text-5xl text-white font-bold mb-2 text-center">
          Manage My Orders
        </h2>
        <Button className="hover:bg-white hover:text-black text-white w-full sm:w-1/2 mx-auto px-4 py-2 rounded bg-green-600">
          <Link to={"/manage-orders"}>Learn More</Link>
        </Button>
      </div>
      <div
        className="flex flex-col items-center justify-center gap-4 bg-white shadow-lg rounded-lg p-6"
        style={{
          backgroundImage: "url('/images/groceries.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <h2 className="text-2xl sm:text-4xl md:text-5xl text-white font-bold mb-2 text-center">
          Add Groceries
        </h2>
        <Button className="hover:bg-white hover:text-black text-white w-full sm:w-1/2 mx-auto px-4 py-2 rounded bg-green-600">
          <Link to={"/add-product"}>Learn More</Link>
        </Button>
      </div>
    </div>
  );
};

export default ServicesPage;
