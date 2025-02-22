import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";

const ProductCard = ({
  title,
  sellingPrice,
  quantity,
  thumbnailImage,
  unit,
  $id,
}) => {
  const pricePerUnit = parseInt(sellingPrice / quantity);

  return (
    <Link to={`/product/${$id}`}>
      <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg">
        <div className="relative aspect-square overflow-hidden">
          <img
            src={thumbnailImage}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {quantity <= 5 && quantity > 0 && (
            <Badge className="absolute top-2 right-2 bg-red-500">
              Only {quantity} left
            </Badge>
          )}
        </div>

        <CardContent className="p-4">
          <h3 className="font-semibold text-lg line-clamp-2 mb-2 min-h-[3.5rem]">
            {title}
          </h3>

          <div className="space-y-2">
            <div className="text-2xl font-bold text-primary">
              ₹{pricePerUnit.toLocaleString()}
              <span className="text-sm text-gray-600 ml-1">
                per {unit ?? "unit"} unit
              </span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0">
          <Button
            className="w-full gap-2 bg-green-600 hover:bg-green-700"
            disabled={quantity === 0}
          >
            <ShoppingCart className="w-4 h-4" />
            Buy Now
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default ProductCard;
