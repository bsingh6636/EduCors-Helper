import React from "react";

const FAQComponent = () => {
  const faqs = [
    {
      question: "How do I get my API key?",
      answer: "Simple! Sign up on our platform, and generate your unique API key  instantly.",
    },
    {
      question: "What if I have issues with CORS?",
      answer: "Our API is designed to resolve CORS issues effortlessly. Just integrate your API key.",
    },
    {
      question: "Is my data secure?",
      answer: "Absolutely! Our system ensures secure access to your data with unique, user-specific API keys.",
    },
    {
      question: "How do I get support?",
      answer: "If you encounter any issues, simply reach out through our support channels for quick assistance.",
    },
  ];

  return (
    <div className=" text-white p-10">
      <h2 className="text-4xl font-bold mb-4 text-center">FAQs & Information</h2>
      <p className="text-center text-gray-400 mb-10">Discover answers to the most common questions about our CORS-Solving API</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {faqs.map((faq, index) => (
          <div key={index} className="flex">
            <div className="bg-gray-800 p-4 rounded-full mr-4">
              <span className="text-2xl">?</span>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">{faq.question}</h3>
              <p className="text-gray-300">{faq.answer}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-10 text-center flex justify-center ">
        <p className="text-gray-400 border-2  w-max border-blue-600 rounded-3xl p-1 px-2 bg-slate-800">Can't find what you're looking for? <a href="/contact" className="text-blue-500 underline">Contact our support</a></p>
      </div>
    </div>
  );
};

export default FAQComponent;
