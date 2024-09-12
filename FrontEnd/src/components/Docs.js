import React from 'react';

const Docs = () => {
  return (
    <div className="bg-black text-white min-h-screen py-12 px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Edu Cors Solver API Documentation</h1>
         {/* CORS Error Example */}
         <section className="mb-12">
          <h2 className="text-2xl ml-5 font-semibold mb-4 "> Error Example which can be fixed</h2>
          <div className="bg-black p-4 rounded-md ">
            <pre className="text-red-600 whitespace-pre-wrap bg-white pl-4 py-1">
              {`Access to fetch at 'https://destination.com' from origin 'http://localhost:3000' has been blocked by CORS policy: 
No 'Access-Control-Allow-Origin' header is present on the requested resource. If an opaque response serves your needs, 
set the request's mode to 'no-cors' to fetch the resource with CORS disabled.`}
            </pre>
            <pre className="text-white">
              {`fetch('https://destination.com', { mode: 'no-cors' })`}
            </pre>
          </div>
          <p className="text-gray-400 mt-2">
            This error occurs when the server does not allow cross-origin requests. Edu Cors Solver helps resolve this issue by serving as a proxy and adding the required CORS headers.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-semibold mb-4">Getting Started</h2>
          <p className="text-lg">
            Welcome to Edu Cors Solver, where you can effortlessly resolve CORS issues and enhance your application's capabilities. Follow the steps below to start using our service.
          </p>
          <ol className="list-decimal ml-6 mt-4">
            <li className="mb-2">Sign up on our platform and generate your unique API key.</li>
            <li className="mb-2">Integrate the API key into your application by sending a request to Edu Cors Solver’s API.</li>
            <li className="mb-2">Resolve CORS issues by simply passing your API key and target API in the request body.</li>
          </ol>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-semibold mb-4">Example Usage</h2>
          <pre className="bg-gray-800 p-4 rounded-md text-green-400 overflow-x-auto">
            {`// It's recommended to use environment variables for sensitive information like API keys.
const API_KEY = 'your_api_key';
const EDUCORS_URL = 'https://educorssolver.host/api/getData';
const TARGET_URL = 'https://api.example.com/data';

async function fetchData() {
  const response = await fetch(EDUCORS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ApiKey: API_KEY, Target: TARGET_URL }),
  });
  const data = await response.json();
  console.log('Data fetched successfully:', data);
}

fetchData();`}
          </pre>
        </section>

       

        <section className="mb-12">
          <h2 className="text-3xl font-semibold mb-4">FAQs</h2>
          <ul className="list-disc ml-6">
            <li className="mb-2">
              <strong>How do I get my API key?</strong>
              <p>Sign up on our platform, and generate your unique API key instantly.</p>
            </li>
            <li className="mb-2">
              <strong>What if I have issues with CORS?</strong>
              <p>Our API is designed to resolve CORS issues effortlessly. Just integrate your API key.</p>
            </li>
            <li className="mb-2">
              <strong>Is my data secure?</strong>
              <p>Absolutely! Our system ensures secure access to your data with unique, user-specific API keys.</p>
            </li>
            <li className="mb-2">
              <strong>How do I get support?</strong>
              <p>If you encounter any issues, reach out through our support channels for quick assistance.</p>
            </li>
          </ul>
        </section>

        <section className="text-center py-8">
          <h2 className="text-3xl font-semibold mb-4">Get Started Now</h2>
          <p className="text-lg mb-8">Resolve CORS issues effortlessly with Edu Cors Solver's secure API services.</p>
          <a href="/signup" className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition">Sign Up & Get Your API Key</a>
        </section>
      </div>
    </div>
  );
};

export default Docs;
