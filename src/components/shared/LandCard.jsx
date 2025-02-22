import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

const LandCard = ({ land, refProp }) => {
  return (
    <Link to={`/land/${land.$id}`}>
      <Card
        ref={refProp}
        className="hover:shadow-lg transition-shadow duration-300 ease-in-out border border-gray-100 rounded-lg overflow-hidden"
      >
        {land.media && land.media.length > 0 && (
          <img
            src={land.media[0]}
            alt={land.title}
            className="w-full h-48 object-cover"
          />
        )}

        <CardHeader className="p-4">
          <CardTitle className="text-xl font-semibold text-gray-800">
            {land.title}
          </CardTitle>
        </CardHeader>

        <CardContent className="p-4 pt-0">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600 font-medium">Rent Per Month:</span>
              <span className="font-semibold text-gray-800">
                ₹{land.rentPerMonth?.toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600 font-medium">Area:</span>
              <span className="text-gray-800">
                {land.area} {land.areaUnit}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600 font-medium">City:</span>
              <span className="text-gray-800">{land.city}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600 font-medium">Duration:</span>
              <span className="text-gray-800">
                {land.durationInMonths} months
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600 font-medium">Address:</span>
              <span className="text-gray-800">{land.address}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600 font-medium">Soil Type:</span>
              <span className="text-gray-800">{land.soilType}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600 font-medium">Organic:</span>
              <span className="text-gray-800">
                {land.organic ? "Yes" : "No"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default LandCard;
