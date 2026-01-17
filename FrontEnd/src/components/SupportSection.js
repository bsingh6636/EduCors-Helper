import React from 'react';
import { Link } from 'react-router-dom';
import { FaBook, FaHeadset, FaGithub, FaArrowRight } from 'react-icons/fa';

const ResourceCard = ({ icon: Icon, title, description, link, linkText }) => (
  <div className="group p-6 rounded-2xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 hover:border-blue-500/30 transition-all duration-300">
    <div className="flex items-start gap-4">
      <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
        <Icon className="text-xl text-white" />
      </div>
      <div className="flex-1">
        <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
        <p className="text-gray-400 text-sm mb-4 leading-relaxed">{description}</p>
        <Link 
          to={link}
          className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
        >
          {linkText}
          <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  </div>
);

const SupportSection = () => {
  const resources = [
    {
      icon: FaBook,
      title: 'API Documentation',
      description: 'Comprehensive guides and API reference to help you integrate quickly.',
      link: '/documentation',
      linkText: 'Read the docs'
    },
    {
      icon: FaHeadset,
      title: 'Support Team',
      description: 'Our support team is here to help you every step of the way.',
      link: '/help',
      linkText: 'Get help'
    },
    {
      icon: FaGithub,
      title: 'Code Examples',
      description: 'Ready-to-use code snippets and examples in multiple languages.',
      link: '/documentation',
      linkText: 'View examples'
    }
  ];

  return (
    <section className="py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1 rounded-full bg-purple-500/10 text-purple-400 text-sm font-medium mb-4">
            Resources
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Support & Resources
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Everything you need to get started and succeed with our CORS proxy service.
          </p>
        </div>

        {/* Resource cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {resources.map((resource, index) => (
            <ResourceCard key={index} {...resource} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SupportSection;
