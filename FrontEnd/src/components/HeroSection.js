import React from 'react';
import { Link } from 'react-router-dom';
import { FaRocket, FaShieldAlt } from 'react-icons/fa';

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden py-16 md:py-24">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900 -z-10" />
      
      {/* Animated background elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 mb-8">
            <FaRocket className="text-blue-400 text-sm" />
            <span className="text-sm text-blue-300 font-medium">Effortless CORS Solutions</span>
          </div>

          {/* Main heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6">
            <span className="bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
              Optimize Your API
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Development
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            Resolve CORS issues seamlessly with our secure API Keys. 
            Focus on building great applications without the hassle of cross-origin restrictions.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              to="/signUp" 
              className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl font-semibold text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 hover:-translate-y-0.5"
            >
              <span className="flex items-center gap-2">
                Get Started Free
                <FaRocket className="group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
            <Link 
              to="/documentation" 
              className="px-8 py-4 border border-gray-600 rounded-xl font-semibold text-gray-300 hover:bg-white/5 hover:border-gray-500 transition-all duration-300"
            >
              View Documentation
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="mt-12 flex flex-wrap justify-center items-center gap-6 text-gray-400 text-sm">
            <div className="flex items-center gap-2">
              <FaShieldAlt className="text-green-400" />
              <span>Secure & Encrypted</span>
            </div>
            <div className="w-px h-4 bg-gray-600 hidden sm:block" />
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span>99.9% Uptime</span>
            </div>
            <div className="w-px h-4 bg-gray-600 hidden sm:block" />
            <div>No Credit Card Required</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
