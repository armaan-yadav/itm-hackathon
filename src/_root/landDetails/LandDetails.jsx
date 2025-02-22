import Loading from "@/components/shared/Loading";
import { Button } from "@/components/ui/button";
import { landServices } from "@/services/landServices";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const LandDetails = () => {
  const { id } = useParams();
  const [LandDetails, setLandDetails] = useState();
  const [isLoading, setIsLoading] = useState(true);

  const getDetails = async () => {
    const res = await landServices.getLandById(id);
    setLandDetails(res);
    setIsLoading(false);
  };
  useEffect(() => {
    if (id) {
      getDetails();
    }
  }, [id]);

  if (isLoading) {
    return <Loading />;
  }
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="relative h-64">
          <img
            src={LandDetails.media[0]}
            alt={LandDetails.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {LandDetails.title}
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-gray-600">
                <span className="font-semibold">Area:</span> {LandDetails.area}{" "}
                {LandDetails.areaUnit}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">Location:</span>{" "}
                {LandDetails.city}, {LandDetails.state}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">Address:</span>{" "}
                {LandDetails.address}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">Pincode:</span>{" "}
                {LandDetails.pincode}
              </p>
            </div>
            <div>
              <p className="text-gray-600">
                <span className="font-semibold">Soil Type:</span>{" "}
                {LandDetails.soilType}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">Organic:</span>{" "}
                {LandDetails.organic ? "Yes" : "No"}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">Full Ownership:</span>{" "}
                {LandDetails.fullOwnership ? "Yes" : "No"}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">Openings:</span>{" "}
                {LandDetails.numberOfOpenings}
              </p>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Utilities
            </h2>
            <div className="flex space-x-4">
              <p
                className={`text-sm font-medium ${
                  LandDetails.electricity ? "text-green-600" : "text-red-600"
                }`}
              >
                Electricity:{" "}
                {LandDetails.electricity ? "Available" : "Not Available"}
              </p>
              <p
                className={`text-sm font-medium ${
                  LandDetails.water ? "text-green-600" : "text-red-600"
                }`}
              >
                Water: {LandDetails.water ? "Available" : "Not Available"}
              </p>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Rent Details
            </h2>
            <p className="text-gray-600">
              <span className="font-semibold">Rent per Month:</span> ₹
              {LandDetails.rentPerMonth}
            </p>
            <p className="text-gray-600">
              <span className="font-semibold">Duration:</span>{" "}
              {LandDetails.durationInMonths} months
            </p>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Owner Details
            </h2>
            <p className="text-gray-600">
              <span className="font-semibold">Name:</span>{" "}
              {LandDetails.ownerName}
            </p>
            <p className="text-gray-600">
              <Button className="font-semibold w-full">
                Contact: {LandDetails.phone}
              </Button>{" "}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandDetails;
