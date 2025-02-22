import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { userContext } from "@/context/userContext";
import { availabilityStatus, quantityUnits } from "@/lib/utils";
import { productServices } from "@/services/productServices";
import { storageServices } from "@/services/storageServices";
import { useContext, useEffect, useState } from "react";
import { Camera, Check } from "lucide-react";

const AddProduct = () => {
  const [files, setFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [currentStep, setCurrentStep] = useState(1);
  const { user } = useContext(userContext);

  const [formData, setFormData] = useState({
    title: "",
    sellingPrice: "",
    negotiable: false,
    quantity: "",
    quantityUnit: quantityUnits.KILOGRAM,
    status: availabilityStatus.AVAILABLE,
    description: "",
    media: [],
  });

  const steps = [
    { number: 1, title: "Basic Details" },
    { number: 2, title: "Product Specifications" },
    { number: 3, title: "Images & Preview" },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSwitchChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

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

  const handleSubmit = async () => {
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

      const finalFormData = {
        userId: user.$id,
        ...formData,
        sellingPrice: parseInt(formData.sellingPrice),
        quantity: parseInt(formData.quantity),
        media: uploaded,
      };

      await productServices.addProduct({ product: finalFormData });

      // Reset form
      setFiles([]);
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
      setPreviewUrls([]);
      setUploadProgress({});
      setFormData({
        title: "",
        sellingPrice: "",
        negotiable: false,
        quantity: "",
        quantityUnit: quantityUnits.KILOGRAM,
        status: availabilityStatus.AVAILABLE,
        description: "",
        media: [],
      });
      setCurrentStep(1);
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
    setCurrentStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const renderStepIndicator = () => (
    <div className="flex justify-between mb-8">
      {steps.map((step, idx) => (
        <div key={step.number} className="flex items-center">
          <div
            className={`flex items-center justify-center w-10 h-10 rounded-full border-2 
              ${
                currentStep >= step.number
                  ? "border-emerald-600 bg-emerald-600 text-white"
                  : "border-gray-300 text-gray-500"
              }`}
          >
            {currentStep > step.number ? (
              <Check className="w-6 h-6" />
            ) : (
              step.number
            )}
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">{step.title}</p>
          </div>
          {idx < steps.length - 1 && (
            <div
              className={`h-0.5 w-12 mx-4 ${
                currentStep > step.number ? "bg-emerald-600" : "bg-gray-300"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Card className="border-none shadow-none">
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-base font-semibold">
                  Product Title
                </Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter a descriptive title for your product"
                  className="w-full"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="sellingPrice"
                    className="text-base font-semibold"
                  >
                    Selling Price (₹)
                  </Label>
                  <Input
                    id="sellingPrice"
                    name="sellingPrice"
                    type="number"
                    value={formData.sellingPrice}
                    onChange={handleInputChange}
                    placeholder="Enter price in rupees"
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quantity" className="text-base font-semibold">
                    Available Quantity
                  </Label>
                  <Input
                    id="quantity"
                    name="quantity"
                    type="number"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    placeholder="Enter available quantity"
                    className="w-full"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="description"
                  className="text-base font-semibold"
                >
                  Product Description
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe your product in detail"
                  className="min-h-[120px]"
                />
              </div>
            </CardContent>
          </Card>
        );

      case 2:
        return (
          <Card className="border-none shadow-none">
            <CardContent className="space-y-8">
              <div className="space-y-4">
                <Label className="text-base font-semibold">Quantity Unit</Label>
                <RadioGroup
                  value={formData.quantityUnit}
                  onValueChange={(value) =>
                    handleSwitchChange("quantityUnit", value)
                  }
                  className="grid grid-cols-2 gap-4"
                >
                  <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50">
                    <RadioGroupItem value={quantityUnits.KILOGRAM} id="kg" />
                    <Label htmlFor="kg" className="font-medium">
                      Kilogram (kg)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50">
                    <RadioGroupItem value={quantityUnits.LITRES} id="ltr" />
                    <Label htmlFor="ltr" className="font-medium">
                      Liters (L)
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-4">
                <Label className="text-base font-semibold">
                  Availability Status
                </Label>
                <RadioGroup
                  value={formData.status}
                  onValueChange={(value) => handleSwitchChange("status", value)}
                  className="grid grid-cols-1 gap-4"
                >
                  {Object.values(availabilityStatus).map((status) => (
                    <div
                      key={status}
                      className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <RadioGroupItem
                        value={status}
                        id={status.toLowerCase()}
                      />
                      <Label
                        htmlFor={status.toLowerCase()}
                        className="font-medium"
                      >
                        {status}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="negotiable"
                    checked={formData.negotiable}
                    onCheckedChange={(checked) =>
                      handleSwitchChange("negotiable", checked)
                    }
                  />
                  <Label htmlFor="negotiable" className="font-medium">
                    Price is Negotiable
                  </Label>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 3:
        return (
          <Card className="border-none shadow-none">
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Camera className="w-12 h-12 text-gray-400 mb-4" />
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span>{" "}
                        or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">
                        PNG, JPG or JPEG (MAX. 800x400px)
                      </p>
                    </div>
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
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900">
                      Image Previews
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {previewUrls.map((url, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={url}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-40 object-cover rounded-lg border"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                            <button
                              onClick={() => {
                                const newFiles = [...files];
                                const newUrls = [...previewUrls];
                                newFiles.splice(index, 1);
                                newUrls.splice(index, 1);
                                setFiles(newFiles);
                                setPreviewUrls(newUrls);
                              }}
                              className="text-white hover:text-red-400"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
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
          {renderStep()}
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
