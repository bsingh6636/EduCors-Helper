import React from 'react';
import HeroSection from './HeroSection';
import FeaturesSection from './FeaturesSection';
import HowItWorksSection from './HowItWorksSection';
import FaqSection from './FaqSection';
import CallToAction from './CallToAction';
import SupportSection from './SupportSection';

const Home = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <FaqSection />
      <CallToAction />
      <SupportSection />
    </div>
  );
};

export default Home;
