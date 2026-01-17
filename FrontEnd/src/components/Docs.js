import React, { useState, useRef, useEffect } from 'react';
import { FaExclamationTriangle, FaRocket, FaCode, FaQuestionCircle, FaCopy, FaCheck, FaKey, FaPlug, FaPlay } from 'react-icons/fa';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';

const Docs = () => {
  const [copiedCode, setCopiedCode] = useState(false);
  const codeRef = useRef(null);

  const exampleCode = `const ApiKey = 'your_ApiKey';
const EDUCORS_URL = 'https://cors-proxy.brijeshdev.space/api/getData';
// Target URL from which you want to fetch data, e.g., GitHub API
const Target = 'https://api.github.com/users/bsingh6636/repos';

async function getData() {
  const response = await fetch(
    \`\${EDUCORS_URL}?ApiKey=\${ApiKey}&Target=\${encodeURIComponent(Target)}\`
  );
  const data = await response.json();
  console.log('Data fetched successfully:', data);
}

getData();`;

  useEffect(() => {
    if (codeRef.current) {
      Prism.highlightElement(codeRef.current);
    }
  }, []);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(exampleCode).then(() => {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    });
  };

  const steps = [
    {
      icon: FaKey,
      title: 'Sign Up & Get API Key',
      description: 'Create your account and generate your unique API key instantly from the dashboard.'
    },
    {
      icon: FaPlug,
      title: 'Integrate the API',
      description: 'Add the API endpoint to your application with your API key and target URL.'
    },
    {
      icon: FaPlay,
      title: 'Start Making Requests',
      description: 'Make requests through our proxy and bypass CORS restrictions effortlessly.'
    }
  ];

  const faqs = [
    {
      question: 'How do I get my API key?',
      answer: 'Sign up on our platform, and generate your unique API key instantly from your dashboard.'
    },
    {
      question: 'What if I have issues with CORS?',
      answer: 'Our API is designed to resolve CORS issues effortlessly. Just integrate your API key and target URL.'
    },
    {
      question: 'Is my data secure?',
      answer: 'Absolutely! Our system ensures secure access to your data with unique, user-specific API keys. We never store your API responses.'
    },
    {
      question: 'How do I get support?',
      answer: 'If you encounter any issues, reach out through our support channels for quick assistance.'
    }
  ];

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1 rounded-full bg-blue-500/10 text-blue-400 text-sm font-medium mb-4">
            Documentation
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            CORS Proxy API Documentation
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Everything you need to integrate our CORS proxy service into your application.
          </p>
        </div>

        {/* CORS Error Example */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-red-500/10">
              <FaExclamationTriangle className="text-red-400 text-xl" />
            </div>
            <h2 className="text-2xl font-bold text-white">The Problem We Solve</h2>
          </div>
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 rounded-2xl overflow-hidden">
            <div className="px-4 py-3 bg-red-500/10 border-b border-red-500/20">
              <span className="text-red-400 text-sm font-medium">Console Error</span>
            </div>
            <pre className="p-4 text-red-400 text-sm overflow-x-auto whitespace-pre-wrap">
{`Access to fetch at 'https://destination.com' from origin 'http://localhost:3000' 
has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is 
present on the requested resource.`}
            </pre>
          </div>
          <p className="text-gray-400 mt-4 leading-relaxed">
            This error occurs when the server does not allow cross-origin requests. Our CORS Proxy solves this by acting as an intermediary that adds the required headers.
          </p>
        </section>

        {/* Getting Started */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-green-500/10">
              <FaRocket className="text-green-400 text-xl" />
            </div>
            <h2 className="text-2xl font-bold text-white">Getting Started</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((step, index) => (
              <div key={index} className="relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 rounded-2xl p-6">
                <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                  {index + 1}
                </div>
                <div className="p-3 rounded-xl bg-gradient-to-br from-blue-600/10 to-purple-600/10 w-fit mb-4">
                  <step.icon className="text-blue-400 text-xl" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Example Usage */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-purple-500/10">
              <FaCode className="text-purple-400 text-xl" />
            </div>
            <h2 className="text-2xl font-bold text-white">Example Usage</h2>
          </div>
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 bg-gray-800/50 border-b border-gray-700/50">
              <span className="text-gray-400 text-sm font-medium">JavaScript</span>
              <button
                onClick={copyToClipboard}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  copiedCode 
                    ? 'bg-green-500/20 text-green-400' 
                    : 'bg-gray-700/50 text-gray-400 hover:bg-gray-700 hover:text-white'
                }`}
              >
                {copiedCode ? <FaCheck /> : <FaCopy />}
                {copiedCode ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <pre className="p-4 overflow-x-auto">
              <code ref={codeRef} className="language-javascript text-sm">
                {exampleCode}
              </code>
            </pre>
          </div>
        </section>

        {/* FAQs */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-yellow-500/10">
              <FaQuestionCircle className="text-yellow-400 text-xl" />
            </div>
            <h2 className="text-2xl font-bold text-white">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 rounded-xl p-5">
                <h3 className="text-white font-semibold mb-2">{faq.question}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="text-center">
          <div className="bg-gradient-to-br from-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-2xl p-8 md:p-12">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
            <p className="text-gray-400 mb-8 max-w-lg mx-auto">
              Resolve CORS issues effortlessly with our secure API proxy service.
            </p>
            <a 
              href="/signUp" 
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl font-semibold text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 hover:-translate-y-0.5"
            >
              Sign Up & Get Your API Key
              <FaRocket className="text-sm" />
            </a>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Docs;
