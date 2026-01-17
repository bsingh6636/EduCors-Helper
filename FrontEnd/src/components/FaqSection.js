import React, { useState } from 'react';
import { FaChevronDown, FaQuestionCircle } from 'react-icons/fa';

const FaqItem = ({ question, answer, isOpen, onClick }) => (
  <div 
    className={`border border-gray-700/50 rounded-xl overflow-hidden transition-all duration-300 ${isOpen ? 'bg-gray-800/50' : 'bg-gray-900/30 hover:bg-gray-800/30'}`}
  >
    <button
      onClick={onClick}
      className="w-full px-6 py-5 flex items-center justify-between text-left"
    >
      <span className="font-semibold text-white pr-4">{question}</span>
      <FaChevronDown 
        className={`flex-shrink-0 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
      />
    </button>
    <div 
      className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-48' : 'max-h-0'}`}
    >
      <p className="px-6 pb-5 text-gray-400 leading-relaxed">{answer}</p>
    </div>
  </div>
);

const FaqSection = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      question: "How do I get my API key?",
      answer: "Simple! Sign up on our platform, and generate your unique API key instantly from your dashboard. No credit card required."
    },
    {
      question: "What if I have issues with CORS?",
      answer: "Our API is designed to resolve CORS issues effortlessly. Just integrate your API key and pass your target URL - we handle all the cross-origin complexity for you."
    },
    {
      question: "Is my data secure?",
      answer: "Absolutely! Our system ensures secure access to your data with unique, user-specific API keys. All requests are encrypted and we never store your API responses."
    },
    {
      question: "How do I get support?",
      answer: "If you encounter any issues, simply reach out through our support channels for quick assistance. We typically respond within 24 hours."
    },
    {
      question: "What are the rate limits?",
      answer: "Free tier includes 1000 requests per day. For higher limits, check out our premium plans or contact us for enterprise solutions."
    }
  ];

  return (
    <section className="py-16 md:py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1 rounded-full bg-yellow-500/10 text-yellow-400 text-sm font-medium mb-4">
            FAQ
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-400">
            Discover answers to the most common questions about our CORS-Solving API
          </p>
        </div>

        {/* FAQ items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <FaqItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === index}
              onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
            />
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-10 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gray-800/50 border border-gray-700/50">
            <FaQuestionCircle className="text-blue-400" />
            <span className="text-gray-400">
              Can't find what you're looking for?{' '}
              <a href="/help" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                Contact our support
              </a>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
