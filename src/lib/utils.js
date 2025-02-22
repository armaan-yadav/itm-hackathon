import { clsx } from "clsx";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function convertToPlainNumber(phoneNumber) {
  return parseInt(phoneNumber.replace(/^\+\d{1,3}/, ""), 10);
}

export const availabilityStatus = {
  AVAILABLE: "available",
  SOLD: "sold",
  PROCESSING: "processing",
};

export const quantityUnits = {
  KILOGRAM: "kg",
  LITRES: "ltr",
};

export const areaUnits = [
  { name: "Square Feet", value: "squarefeet" },
  { name: "Square Meter", value: "squaremeter" },
  { name: "Acre", value: "acre" },
  { name: "Hectare", value: "hectare" },
  { name: "Bigha", value: "bigha" },
  { name: "Biswa", value: "biswa" },
  { name: "Kanal", value: "kanal" },
  { name: "Marla", value: "marla" },
  { name: "Guntha", value: "guntha" },
  { name: "Vigha", value: "vigha" },
  { name: "Ground", value: "ground" },
  { name: "Ankanam", value: "ankanam" },
  { name: "Cent", value: "cent" },
  { name: "Katha (Cottah)", value: "katha_cottah" },
  { name: "Dhur", value: "dhur" },
];

export const soilTypesHindi = [
  "जलोढ़ मिट्टी (Alluvial Soil)",
  "काली मिट्टी (Black Soil)",
  "लाल मिट्टी (Red Soil)",
  "लेटेराइट मिट्टी (Laterite Soil)",
  "पहाड़ी मिट्टी (Mountain Soil)",
  "रेगिस्तानी मिट्टी (Desert Soil)",
  "पीट मिट्टी (Peat Soil)",
  "लवणीय और क्षारीय मिट्टी (Saline and Alkaline Soil)",
  "दलदली मिट्टी (Marshy Soil)",
  "वन मिट्टी (Forest Soil)",
];

export const useToast = (message, duration) => {
  toast(message, {
    duration: duration || 2000,
  });
};
