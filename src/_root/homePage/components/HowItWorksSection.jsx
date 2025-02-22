import React from 'react';
import { motion } from 'framer-motion';

const steps = [
  {
    number: "01",
    title: "Create Account",
    description: "Sign up for free and complete your verification to get started."
  },
  {
    number: "02",
    title: "Browse Land & Resources",
    description: "Explore available land for lease, farming tools, and resources."
  },
  {
    number: "03",
    title: "Lease Land & Purchase Products",
    description: "Securely lease land or purchase farming tools through our platform."
  },
  {
    number: "04",
    title: "Manage Your Farm Operations",
    description: "Easily oversee your land, crops, and direct sales through the platform."
  }
];

const HowItWorksSection = () => {
  return (
    <section className="py-20 bg-green-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            किसान सारथी से जुड़े सिर्फ 4 स्टेप्स में 
          </h2>
          <p className="text-xl text-gray-600">
          Get Started with Farming Solutions in Four Simple Steps
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative"
            >
              <div className="bg-white p-8 rounded-2xl shadow-lg">
                <div className="text-3xl font-bold text-green-600 mb-4">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600">
                  {step.description}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-green-300" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
