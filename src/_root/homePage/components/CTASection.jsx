import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { userContext } from "@/context/userContext";
import { useContext } from "react";

const CTASection = () => {
  const navigate = useNavigate();
  const { user } = useContext(userContext);

  const handleClick = () => {
    if (user) {
      navigate("/create-profile"); // Redirect to profile creation if logged in
    } else {
      navigate("/auth"); // Redirect to authentication if not logged in
    }
  };
  return (
    <section className="py-20 bg-green-600">
      <div className="container mx-auto px-4">
        <div></div>
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold text-white mb-6"
          >
            किसान सारथी से अभी जुड़ें
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-green-100 mb-8"
          >
            Join a thriving community of farmers and landowners maximizing their
            agricultural potential.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button
              onClick={handleClick}
              className="bg-white text-green-600 px-8 py-4 rounded-full font-semibold hover:bg-green-50 transition-colors"
            >
              Get Started Now
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
