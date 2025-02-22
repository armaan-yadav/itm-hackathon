import React from "react";
import { motion } from "framer-motion";
import brandLogoInvert from "/images/brand-logo-invert.png";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white  h-max">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-between w-full">
            <img
              src={brandLogoInvert}
              alt="Brand Logo"
              className="w-32 h-auto"
            />
            <p className="text-gray-400 text-sm max-w-[60%] text-right">
              @ITM HACKATHON 2025
            </p>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
