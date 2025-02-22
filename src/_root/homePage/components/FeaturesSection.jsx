import React from 'react';
import { motion } from 'framer-motion';

const features = [
  {
    title: "Efficient Land Utilization",
    description: "Convert idle land into productive farmland, benefiting both landowners and farmers.",
    icon: "📊"
  },
  {
    title: "Direct Sales",
    description: "Farmers sell directly to consumers, ensuring fair prices and higher profits.",
    icon: "🔒"
  },
  {
    title: "Access to Resources",
    description: "A one-stop shop for seeds, fertilizers, and cutting-edge farming tools.",
    icon: "👥"
  },
  {
    title: "Farmer Empowerment",
    description: "Farmers gain control over their business, with access to land, resources, and better market opportunities.",
    icon: "👥"
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold text-gray-900 mb-4"
          >
            किसान सारथी क्यों चुने ?  
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-gray-600 m-auto w-[65%]"
          >
            At Kisaan Sarthi, we connect landowners, farmers, and consumers in a streamlined ecosystem. Our platform empowers farmers with direct access to land, resources, and markets, while ensuring landowners earn passive income. We eliminate middlemen, creating a transparent and efficient agricultural process.
          </motion.p>
        </div>

        <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
