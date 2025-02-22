import React from "react";
import HeroSection from "./components/HeroSection";
import FeaturesSection from "./components/FeaturesSection";
import HowItWorksSection from "./components/HowItWorksSection";
import CTASection from "./components/CTASection";
import ChatWidget from "@/components/shared/Chatbot";
import WeatherWidget from "@/components/shared/Weather";

const HomePage = () => {
  return (
    <div className="min-h-screen">
      {/* <WeatherWidget /> */}
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <ChatWidget />
      <CTASection />
    </div>
  );
};

export default HomePage;
