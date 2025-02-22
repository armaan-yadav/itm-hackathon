import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cloud, Sun, CloudRain, Thermometer, Droplets, X } from "lucide-react";
import { useToast } from "@/lib/utils";

const WeatherWidget = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          useToast(
            "Unable to get your location. Please enable location access."
          );
        }
      );
    } else {
      useToast("Geolocation is not supported by your browser");
    }
  };

  const fetchWeatherData = async () => {
    if (!location) return;

    try {
      setLoading(true);
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,is_day,precipitation&timezone=auto`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch weather data");
      }

      const data = await response.json();
      setWeatherData(data);
    } catch (error) {
      console.error("Error fetching weather data:", error);
      useToast("Failed to fetch weather data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && !location) {
      getLocation();
    }
  }, [isOpen]);

  useEffect(() => {
    if (location) {
      fetchWeatherData();

      const interval = setInterval(fetchWeatherData, 30 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [location]);

  const iconAnimationVariants = {
    initial: { y: 0 },
    animate: {
      y: [-2, 2, -2],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  const expandAnimation = {
    initial: { scale: 0.8, opacity: 0 },
    animate: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20,
      },
    },
    exit: {
      scale: 0.8,
      opacity: 0,
      transition: {
        duration: 0.2,
      },
    },
  };

  const getWeatherIcon = (size = 24) => {
    if (!weatherData)
      return (
        <motion.div
          variants={iconAnimationVariants}
          initial="initial"
          animate="animate"
        >
          <Cloud className={`w-${size} h-${size} text-gray-400`} />
        </motion.div>
      );

    const { is_day, precipitation } = weatherData.current;

    return (
      <motion.div
        variants={iconAnimationVariants}
        initial="initial"
        animate="animate"
      >
        {precipitation > 0 ? (
          <CloudRain className={`w-${size} h-${size} text-blue-500`} />
        ) : is_day ? (
          <Sun className={`w-${size} h-${size} text-yellow-500`} />
        ) : (
          <Cloud className={`w-${size} h-${size} text-gray-600`} />
        )}
      </motion.div>
    );
  };

  // Small circular button when widget is collapsed
  if (!isOpen) {
    return (
      <motion.button
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300"
      >
        {weatherData ? (
          <motion.div
            className="flex flex-col items-center"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          >
            {getWeatherIcon(8)}
            <motion.span
              className="text-sm font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {weatherData.current.temperature_2m}°C
            </motion.span>
          </motion.div>
        ) : (
          <Cloud className="w-8 h-8 text-gray-400" />
        )}
      </motion.button>
    );
  }

  // Expanded weather widget
  return (
    <AnimatePresence>
      <motion.div
        {...expandAnimation}
        className="absolute top-full mt-7 right-0 bg-white rounded-2xl p-4 shadow-xl w-72 z-50"
      >
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(false)}
            className="absolute right-0 top-0 p-1"
          >
            <X className="w-4 h-4 text-gray-500" />
          </motion.button>

          {loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center h-32"
            >
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
            </motion.div>
          ) : weatherData ? (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="space-y-4"
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-center mb-2"
              >
                <h3 className="text-lg font-semibold text-gray-700">
                  Paldi, Gujarat
                </h3>
              </motion.div>

              <div className="flex items-center justify-center space-x-4">
                {getWeatherIcon(12)}
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-4xl font-bold"
                >
                  {weatherData.current.temperature_2m}°C
                </motion.div>
              </div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="grid grid-cols-2 gap-4"
              >
                <div className="flex items-center space-x-2">
                  <Droplets className="w-4 h-4 text-blue-500" />
                  <span>
                    {weatherData.current.relative_humidity_2m}% Humidity
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Thermometer className="w-4 h-4 text-red-500" />
                  <span>{weatherData.current.temperature_2m}°C Feels like</span>
                </div>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center h-32"
            >
              <p className="text-gray-500">Unable to fetch weather data</p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default WeatherWidget;
