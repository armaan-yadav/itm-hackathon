import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { storageServices } from "@/services/storageServices";
import { areaUnits, soilTypesHindi, useToast } from "@/lib/utils";
import { landServices } from "@/services/landServices";
import { StateList } from "@/components/shared/StateList";
import { CityList } from "@/components/shared/CityList";

const ListLandPage = () => {
  const [stateName, setStateName] = useState("");
  const [stateCode, setStateCode] = useState("");
  const [city, setCity] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    area: "",
    areaUnit: areaUnits[0]?.value || "",
    numberOfOpenings: "",
    state: "",
    city: "",
    pincode: "",
    durationInMonths: "",
    rentPerMonth: "",
    electricity: false,
    water: true,
    media: [],
    ownerName: "",
    address: "",
    soilType: soilTypesHindi[0] || "",
    organic: false,
    fullOwnership: true,
    phone: "",
  });

  const [files, setFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      state: stateName,
    }));
  }, [stateName]);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      city: city,
    }));
  }, [city]);

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;

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

  const validatePincode = (pincode) => {
    return /^\d{6}$/.test(pincode);
  };

  const handleSubmit = async () => {
    if (!validatePincode(formData.pincode)) {
      alert("Please enter a valid 6-digit pincode.");
      return;
    }

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
        ...formData,
        media: uploaded,
      };

      console.log("Submitting form data:", finalFormData);

      await landServices.addLand({ land: finalFormData });
      useToast("Land listed successfully!", 2000);

      setFiles([]);
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
      setPreviewUrls([]);
      setUploadProgress({});
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to submit form. Please try again.");
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

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter listing title"
                className="w-full"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="area">Area</Label>
                <Input
                  id="area"
                  name="area"
                  value={formData.area}
                  onChange={handleInputChange}
                  placeholder="Enter area"
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="areaUnit">Area Unit</Label>
                <select
                  id="areaUnit"
                  name="areaUnit"
                  value={formData.areaUnit}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md bg-white"
                >
                  {areaUnits.map((e) => (
                    <option key={e.value} value={e.value}>
                      {e.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="numberOfOpenings">Number of Openings</Label>
              <Input
                id="numberOfOpenings"
                name="numberOfOpenings"
                value={formData.numberOfOpenings}
                onChange={handleInputChange}
                placeholder="Enter number of openings"
                className="w-full"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <StateList
                  setStateCode={setStateCode}
                  setStateName={setStateName}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <CityList setCityName={setCity} stateCode={stateCode} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pincode">Pin Code</Label>
              <Input
                id="pincode"
                name="pincode"
                type="text"
                value={formData.pincode}
                onChange={handleInputChange}
                placeholder="Enter 6-digit pincode"
                maxLength={6}
                className="w-full"
              />
              {!validatePincode(formData.pincode) && (
                <p className="text-sm text-red-500">
                  Please enter a valid 6-digit pincode.
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="durationInMonths">Duration (Months)</Label>
                <Input
                  id="durationInMonths"
                  name="durationInMonths"
                  value={formData.durationInMonths}
                  onChange={handleInputChange}
                  placeholder="Enter duration"
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rentPerMonth">Rent per Month</Label>
                <Input
                  id="rentPerMonth"
                  name="rentPerMonth"
                  value={formData.rentPerMonth}
                  onChange={handleInputChange}
                  placeholder="Enter monthly rent"
                  className="w-full"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="ownerName">Owner Name</Label>
              <Input
                id="ownerName"
                name="ownerName"
                value={formData.ownerName}
                onChange={handleInputChange}
                placeholder="Enter owner's name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Enter complete address"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="soilType">Soil Type</Label>
              <select
                id="soilType"
                name="soilType"
                value={formData.soilType}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
              >
                {soilTypesHindi.map((e, index) => (
                  <option key={index} value={e}>
                    {e}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Enter phone number"
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="electricity"
                  checked={formData.electricity}
                  onCheckedChange={(checked) =>
                    handleSwitchChange("electricity", checked)
                  }
                />
                <Label htmlFor="electricity">Electricity Available</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="water"
                  checked={formData.water}
                  onCheckedChange={(checked) =>
                    handleSwitchChange("water", checked)
                  }
                />
                <Label htmlFor="water">Water Available</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="organic"
                  checked={formData.organic}
                  onCheckedChange={(checked) =>
                    handleSwitchChange("organic", checked)
                  }
                />
                <Label htmlFor="organic">Organic Certified</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="fullOwnership"
                  checked={formData.fullOwnership}
                  onCheckedChange={(checked) =>
                    handleSwitchChange("fullOwnership", checked)
                  }
                />
                <Label htmlFor="fullOwnership">Full Ownership</Label>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Land Images</Label>
              <label className="block w-full bg-blue-500 text-white px-4 py-2 rounded cursor-pointer text-center hover:bg-blue-600 transition-colors">
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
                                  ? "text-blue-600"
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
                      className="w-full h-24 object-cover rounded border"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        List Your Land
      </h2>

      <div className="mb-6">
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-600">Step {currentStep} of 5</p>
        </div>
        <Progress
          value={(currentStep / 5) * 100}
          className="h-2 mt-2 bg-gray-200"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {renderStep()}
      </div>

      <div className="mt-8 flex justify-between">
        <button
          onClick={prevStep}
          disabled={currentStep === 1}
          className="bg-gray-500 text-white px-8 py-2 rounded hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:hover:bg-gray-500"
        >
          Previous
        </button>

        {currentStep < 5 ? (
          <button
            onClick={nextStep}
            className="bg-blue-600 text-white px-8 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={
              uploading ||
              !formData.title ||
              !formData.area ||
              files.length === 0
            }
            className="bg-blue-600 text-white px-8 py-2 rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:hover:bg-blue-600"
          >
            {uploading ? "Submitting..." : "Submit Listing"}
          </button>
        )}
      </div>
    </div>
  );
};

export default ListLandPage;
