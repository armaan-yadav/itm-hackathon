import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from "react-router-dom";
import { userContext } from '@/context/userContext';
import { useContext } from 'react';

const HeroSection = () => {
  const navigate = useNavigate();
  const { user } = useContext(userContext);

  const handleClick = () => {
    if (user) {
      navigate('/create-profile'); // Redirect to profile creation if logged in
    } else {
      navigate('/auth'); // Redirect to authentication if not logged in
    }
  };


  return (
    <section
      className="relative min-h-screen flex items-center bg-cover bg-center"
      style={{ backgroundImage: "url('/images/main-bg.jpg')" }} // Update with actual image path
    >
      {/* Overlay for better readability */}
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl  tracking-tight md:text-6xl ml-6 font-bold text-[#f3eee4] mb-6" style={{lineHeight: 1.3}}>
              किसान की ताकत, तकनीक की राह – समृद्धि की नई चाह!
            </h1>
            <p className="text-xl ml-6 text-[#f0e4cb] mb-8">

              किसान से सीधा ग्राहक तक सही दाम, सही काम!
            </p>
            <div className="flex gap-4">
              <button onClick={handleClick}
                className="bg-green-600 text-white ml-6 px-8 py-4 rounded-full font-semibold hover:bg-green-700 transition-colors">
                Create Profile
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
