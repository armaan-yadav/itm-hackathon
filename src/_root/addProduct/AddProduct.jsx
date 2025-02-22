import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { userContext } from "@/context/userContext";
import { availabilityStatus, quantityUnits, useToast } from "@/lib/utils";
import { productServices } from "@/services/productServices";
import { storageServices } from "@/services/storageServices";
import { useContext, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, UploadCloud } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AddProduct = () => {
  const [files, setFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [permanentUrls, setPermanentUrls] = useState([]);
  const [negotiable, setNegotiable] = useState(false);
  const [title, setTitle] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [quantityUnit, setQuantityUnit] = useState(quantityUnits.KILOGRAM);
  const [status, setStatus] = useState(availabilityStatus.AVAILABLE);
  const [description, setDescription] = useState("");
  const { user } = useContext(userContext);
  const [step, setStep] = useState(1);
  const navigator = useNavigate();

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    if (selectedFiles.length === 0) return;
    setFiles(selectedFiles);
    const imagePreviews = selectedFiles
      .filter((file) => file.type.startsWith("image/"))
      .map((file) => URL.createObjectURL(file));
    setPreviewUrls(imagePreviews);
    const initialProgress = {};
    selectedFiles.forEach((file) => {
      initialProgress[file.name] = 0;
    });
    setUploadProgress(initialProgress);
  };

  const handleAddProduct = async () => {
    if (files.length === 0) {
      alert("Please select at least one image.");
      return;
    }

    try {
      setUploading(true);
      const uploaded = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        try {
          const progressInterval = setInterval(() => {
            setUploadProgress((prev) => ({
              ...prev,
              [file.name]: Math.min((prev[file.name] || 0) + 10, 90),
            }));
          }, 200);

          const { response, previewUrl } = await storageServices.uploadFile(
            file
          );
          uploaded.push(previewUrl);

          clearInterval(progressInterval);
          setUploadProgress((prev) => ({
            ...prev,
            [file.name]: 100,
          }));
        } catch (error) {
          console.error("Upload failed for:", file.name, error);
          setUploadProgress((prev) => ({
            ...prev,
            [file.name]: -1,
          }));
          throw new Error(`Failed to upload ${file.name}`);
        }
      }

      const data = {
        userId: user?.$id,
        title,
        sellingPrice: parseInt(sellingPrice),
        quantity: parseInt(quantity),
        description,
        media: uploaded,
        availabilityStatus: status,
        negotiable,
      };

      console.log("Product data:", data);
      await productServices.addProduct({ product: data });
      useToast("Grocery added successfully");
      navigator("/all-products");

      setFiles([]);
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
      setPreviewUrls([]);
      setUploadProgress({});
      setPermanentUrls([]);
      setTitle("");
      setSellingPrice("");
      setQuantity("");
      setDescription("");
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Failed to add product. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const getProgressStatus = (progress) => {
    if (progress === -1) return "Failed";
    if (progress === 100) return "Completed";
    if (progress > 0) return "Uploading";
    return "Pending";
  };

  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  const nextStep = () => {
    setStep((prevStep) => prevStep + 1);
  };

  const prevStep = () => {
    setStep((prevStep) => prevStep - 1);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-gray-700 font-medium">
                Product Title
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter product title"
                className="w-full bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price" className="text-gray-700 font-medium">
                Selling Price (₹) for complete quantity
              </Label>
              <Input
                id="price"
                type="number"
                value={sellingPrice}
                onChange={(e) => setSellingPrice(e.target.value)}
                placeholder="Enter selling price"
                min="0"
                className="w-full bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="negotiable"
                checked={negotiable}
                onCheckedChange={(e) => setNegotiable(e)}
                className="data-[state=checked]:bg-emerald-500"
              />
              <Label htmlFor="negotiable" className="text-gray-700 font-medium">
                Price Negotiable
              </Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity" className="text-gray-700 font-medium">
                Quantity Available
              </Label>
              <Input
                id="quantity"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Enter available quantity"
                min="0"
                className="w-full bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-700 font-medium">Availability</Label>
              <RadioGroup
                defaultValue={availabilityStatus.AVAILABLE}
                onValueChange={(e) => setStatus(e)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value={availabilityStatus.AVAILABLE}
                    id="available"
                    className="text-emerald-500 border-gray-300"
                  />
                  <Label htmlFor="available">Available</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value={availabilityStatus.SOLD}
                    id="sold"
                    className="text-emerald-500 border-gray-300"
                  />
                  <Label htmlFor="sold">Sold</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value={availabilityStatus.PROCESSING}
                    id="processing"
                    className="text-emerald-500 border-gray-300"
                  />
                  <Label htmlFor="processing">Processing</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-700 font-medium">Quantity Unit</Label>
              <RadioGroup
                defaultValue={quantityUnits.KILOGRAM}
                onValueChange={(e) => setQuantityUnit(e)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value={quantityUnits.KILOGRAM}
                    id="kg"
                    className="text-emerald-500 border-gray-300"
                  />
                  <Label htmlFor="kg">kg</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value={quantityUnits.LITRES}
                    id="ltr"
                    className="text-emerald-500 border-gray-300"
                  />
                  <Label htmlFor="ltr">ltr</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="description"
                className="text-gray-700 font-medium"
              >
                Product Description
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter product description"
                className="w-full min-h-[120px] bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <button
              onClick={nextStep}
              className="mt-8 w-full bg-emerald-600 text-white px-8 py-3 rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center"
            >
              Next <ChevronRight className="ml-2 h-4 w-4" />
            </button>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-gray-700 font-medium">
                Product Images
              </Label>
              <label className="block w-full bg-emerald-600 text-white px-4 py-2 rounded-lg cursor-pointer text-center hover:bg-emerald-700 transition-colors flex items-center justify-center">
                <UploadCloud className="mr-2 h-4 w-4" />
                Select Images
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/*"
                />
              </label>
            </div>

            {files.length > 0 && (
              <div className="space-y-4">
                {files.map((file, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">{file.name}</span>
                      <span
                        className={`
                          ${
                            uploadProgress[file.name] === 100
                              ? "text-green-600"
                              : ""
                          }
                          ${
                            uploadProgress[file.name] === -1
                              ? "text-red-600"
                              : ""
                          }
                          ${
                            uploadProgress[file.name] > 0 &&
                            uploadProgress[file.name] < 100
                              ? "text-emerald-600"
                              : ""
                          }
                        `}
                      >
                        {getProgressStatus(uploadProgress[file.name])}
                      </span>
                    </div>
                    <Progress
                      value={
                        uploadProgress[file.name] === -1
                          ? 0
                          : uploadProgress[file.name]
                      }
                      className={`h-2 ${
                        uploadProgress[file.name] === -1 ? "bg-red-200" : ""
                      }`}
                    />
                  </div>
                ))}
              </div>
            )}

            {previewUrls.length > 0 && (
              <div>
                <p className="text-sm text-gray-600 mb-2">Image Previews:</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {previewUrls.map((url, index) => (
                    <img
                      key={index}
                      src={url}
                      alt={`Preview ${index}`}
                      className="w-full h-24 object-cover rounded-lg border border-gray-200"
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-between mt-8">
              <button
                onClick={prevStep}
                className="bg-gray-600 text-white px-8 py-3 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center"
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Previous
              </button>
              <button
                onClick={handleAddProduct}
                disabled={
                  uploading ||
                  !title ||
                  !sellingPrice ||
                  !quantity ||
                  !description ||
                  files.length === 0
                }
                className="bg-emerald-600 text-white px-8 py-3 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:hover:bg-emerald-600 flex items-center justify-center"
              >
                {uploading ? "Adding Product..." : "Add Product"}
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-8 border border-green-100 mt-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Add Product</h2>
          <div className="mb-6">
            <div className="flex items-center justify-center space-x-4">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step === 1
                    ? "bg-emerald-600 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                1
              </div>
              <div className="h-1 w-16 bg-gray-200 rounded-full"></div>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step === 2
                    ? "bg-emerald-600 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                2
              </div>
            </div>
          </div>
          {renderStep()}
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
