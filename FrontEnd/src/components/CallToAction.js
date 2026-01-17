import React from 'react';
import { Link } from 'react-router-dom';
import { FaCheck, FaArrowRight } from 'react-icons/fa';

const CallToAction = () => {
  const features = [
    "Resolve CORS issues with a few simple API key integrations",
    "Enjoy secure access to your data with unique API keys",
    "Quick setup allows you to focus on building your applications"
  ];

  return (
    <section className="py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700/50">
          {/* Background decorations */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative p-8 md:p-12 lg:p-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Content */}
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
                  Experience Seamless API Access for Developers
                </h2>
                <div className="space-y-4 mb-8">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center mt-0.5">
                        <FaCheck className="text-blue-400 text-xs" />
                      </span>
                      <p className="text-gray-300">{feature}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col gap-4 lg:items-end">
                <Link 
                  to="/signUp"
                  className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl font-semibold text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 hover:-translate-y-0.5 w-full lg:w-auto"
                >
                  Get Started Now
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link 
                  to="/documentation"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gray-700/50 hover:bg-gray-700 border border-gray-600 rounded-xl font-semibold text-gray-300 transition-all duration-300 w-full lg:w-auto"
                >
                  Discover Our API Solutions
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
