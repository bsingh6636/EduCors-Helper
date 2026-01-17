import React from 'react';
import { FaUserPlus, FaKey, FaCode, FaRocket } from 'react-icons/fa';

const Step = ({ number, icon: Icon, title, description, isLast }) => (
  <div className="relative flex flex-col items-center text-center">
    {/* Connector line */}
    {!isLast && (
      <div className="hidden lg:block absolute top-12 left-[calc(50%+3rem)] w-[calc(100%-6rem)] h-0.5 bg-gradient-to-r from-blue-500 to-purple-500" />
    )}
    
    {/* Step circle */}
    <div className="relative mb-6">
      <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
        <Icon className="text-3xl text-white" />
      </div>
      <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-sm font-bold text-white shadow-lg">
        {number}
      </div>
    </div>
    
    <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
    <p className="text-gray-400 max-w-xs leading-relaxed">{description}</p>
  </div>
);

const HowItWorksSection = () => {
  const steps = [
    {
      icon: FaUserPlus,
      title: 'Sign Up',
      description: 'Create your free account in seconds. No credit card required to get started.'
    },
    {
      icon: FaKey,
      title: 'Get Your API Key',
      description: 'Generate your unique API key instantly from your dashboard.'
    },
    {
      icon: FaCode,
      title: 'Integrate',
      description: 'Add a single line of code to your application. Works with any framework.'
    },
    {
      icon: FaRocket,
      title: 'Go Live',
      description: 'Deploy with confidence. Your CORS issues are now a thing of the past.'
    }
  ];

  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-900/5 to-transparent" />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1 rounded-full bg-green-500/10 text-green-400 text-sm font-medium mb-4">
            How It Works
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Unlock the Power of APIs
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Get started in just four simple steps. No complex setup, no configuration headaches.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {steps.map((step, index) => (
            <Step 
              key={index} 
              number={index + 1} 
              {...step} 
              isLast={index === steps.length - 1}
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="text-gray-400 mb-6">Ready to eliminate CORS issues forever?</p>
          <a 
            href="/signUp" 
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-500 rounded-xl font-semibold text-white shadow-lg shadow-green-500/25 hover:shadow-green-500/40 transition-all duration-300 hover:-translate-y-0.5"
          >
            Start Building Now
            <FaRocket className="text-sm" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
