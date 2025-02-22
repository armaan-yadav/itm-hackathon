import { Button } from "@/components/ui/button";
import { userContext } from "@/context/userContext";
import { orderServices } from "@/services/orderServices";
import { productServices } from "@/services/productServices";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const PlaceOrder = () => {
  const { productId, quantity } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(userContext);
  const navigator = useNavigate();

  const getProduct = async () => {
    try {
      const res = await productServices.getProductById(productId);
      setProduct(res);
    } catch (error) {
      console.error("Error fetching product:", error);
      setError("Failed to fetch product details. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (productId) {
      getProduct();
    }
  }, [productId]);

  const handlePlaceOrder = async () => {
    const data = {
      buyerId: user.$id,
      sellerId: product.userId,
      productId: product.$id,
      quantity,
      orderStatus: "pending",
      date: new Date().toISOString(),
      totalAmount: String(product.sellingPrice * quantity),
    };

    await orderServices.placeOrder({ order: data });
    console.log("placed");
    navigator("/my-orders");
    console.log(data);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-center text-red-500">{error}</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-center text-gray-500">Product not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-purple-50 py-10">
      <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Place Order</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <img
              src={product.media?.[0] || "https://via.placeholder.com/400"}
              alt={product.title}
              className="w-full h-64 object-cover"
            />
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">
              {product.title}
            </h2>
            <p className="text-gray-700">{product.description}</p>

            <div className="flex justify-between items-center">
              <p className="text-lg font-semibold text-green-600">
                Price: ₹{product.sellingPrice}
              </p>
              <p className="text-gray-600">
                Available Quantity: {product.quantity}
              </p>
            </div>

            <p className="text-sm text-gray-500">
              Status:{" "}
              <span className="font-medium text-blue-600">
                {product.availabilityStatus}
              </span>
            </p>

            <div className="mt-4">
              <p className="text-lg font-semibold text-gray-900">
                Order Quantity: {quantity}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <Button
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-300"
            onClick={handlePlaceOrder}
          >
            Confirm Order
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;
