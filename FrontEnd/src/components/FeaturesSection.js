import React from 'react';
import { FaCloudUploadAlt, FaLock, FaBolt, FaCode, FaServer, FaChartLine } from 'react-icons/fa';
import CodeDemo from '../pages/CodeDemo';

const FeatureCard = ({ icon: Icon, title, description, gradient }) => (
  <div className="group relative p-6 rounded-2xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 hover:border-blue-500/30 transition-all duration-300 hover:-translate-y-1">
    <div className={`inline-flex p-3 rounded-xl ${gradient} mb-4`}>
      <Icon className="text-2xl text-white" />
    </div>
    <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
    <p className="text-gray-400 leading-relaxed">{description}</p>
  </div>
);

const FeaturesSection = () => {
  const features = [
    {
      icon: FaBolt,
      title: 'Instant CORS Resolution',
      description: 'Transform complex integration into smooth API interactions with zero configuration hassle.',
      gradient: 'bg-gradient-to-br from-yellow-500 to-orange-500'
    },
    {
      icon: FaLock,
      title: 'Secure API Keys',
      description: 'Protect your data with unique, user-specific API keys and enterprise-grade encryption.',
      gradient: 'bg-gradient-to-br from-green-500 to-emerald-500'
    },
    {
      icon: FaCloudUploadAlt,
      title: 'Quick Setup',
      description: 'Get started in minutes with our simple integration process. No complex configurations needed.',
      gradient: 'bg-gradient-to-br from-blue-500 to-cyan-500'
    },
    {
      icon: FaCode,
      title: 'Developer Friendly',
      description: 'Clean REST API with comprehensive documentation and code examples in multiple languages.',
      gradient: 'bg-gradient-to-br from-purple-500 to-pink-500'
    },
    {
      icon: FaServer,
      title: 'High Availability',
      description: 'Built on reliable infrastructure with 99.9% uptime guarantee and global CDN distribution.',
      gradient: 'bg-gradient-to-br from-red-500 to-rose-500'
    },
    {
      icon: FaChartLine,
      title: 'Usage Analytics',
      description: 'Monitor your API usage with detailed analytics dashboard and real-time insights.',
      gradient: 'bg-gradient-to-br from-indigo-500 to-violet-500'
    }
  ];

  return (
    <section className="py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1 rounded-full bg-blue-500/10 text-blue-400 text-sm font-medium mb-4">
            Features
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Unlock Your Application's Potential
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Effortlessly resolve CORS issues and streamline your development process with our powerful API proxy service.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>

        {/* Code demo section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mt-20">
          <div>
            <span className="inline-block px-4 py-1 rounded-full bg-purple-500/10 text-purple-400 text-sm font-medium mb-4">
              Seamless Integration
            </span>
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-6">
              Simple API Integration in Minutes
            </h3>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Our API is designed to be developer-friendly. Just add your API key and target URL, 
              and we handle all the CORS complexity for you. No more "Access-Control-Allow-Origin" errors.
            </p>
            <ul className="space-y-3">
              {['One-line integration', 'Works with any API', 'Real-time response'].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-gray-300">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                    <span className="text-green-400 text-xs">✓</span>
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl blur-xl" />
            <div className="relative">
              <CodeDemo />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
