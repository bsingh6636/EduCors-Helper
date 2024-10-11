import React from 'react';
import CodeDemo from '../pages/CodeDemo';
import { FaCloudUploadAlt, FaLock } from "react-icons/fa";
import { FaBoltLightning } from "react-icons/fa6";
import FAQComponent from '../pages/FAQComponent';
import { Link } from 'react-router-dom';
import Hover from './Hovercard';
const Home = () => {
  return (
    <>
      <div className='flex justify-center flex-col'>
        <div className='flex justify-center'>
          <p className='mt-20 border-2 p-1 px-2 rounded-2xl  border-white max-sm:mt-2'>Now: Effotless soltutions for devvelopers |
            <span className='text-blue-700 max-sm:flex max-sm:justify-center'>Learn more></span>
          </p>
        </div>
        <div className='flex flex-col text-5xl font-extrabold items-center mt-5 text max-sm:text-3xl '>
          <span>𝕆𝕡𝕥𝕚𝕞𝕚𝕫𝕖 𝕐𝕠𝕦𝕣 𝔸ℙ𝕀</span>
          <span>𝔻𝕖𝕧𝕖𝕝𝕠𝕡𝕞𝕖𝕟𝕥</span>
        </div>
        <div className=' items-center text-xl flex-col max-sm:text-base flex max-sm:flex-none sm:flex '>
        
          <span>Resolve CORS issues seamlessly with our secure API Keys. Focus on building</span>
          <span>great Application without hassle</span>
          <Hover/>
          <Home2 />
          <Home3 />
          <FAQComponent />
          <Home4 />
          <Homee />
        </div>
      </div>
      
    </>

  );
};

export default Home;

const Home2 = () => {
  return ( 
    <div className='mt-10 flex flex-row max-md:flex-col max-lg:w-96'>
    <div className='flex-1 md:w-1/2 md:mr-5'>
      <p className='text-blue-700 mb-5 text-base sm:text-lg md:text-xl'>Seamless API Integration</p>
      <h1 className='font-extrabold text-2xl max-lg:text-xl  lg:text-5xl '>
        Unlock your application potential
      </h1>
      <p className='mt-5 md:mt-9 text-sm sm:text-base lg:text-lg'>
        Effortlessly resolve CORS issues and streamline your development process if u r having  request blocked CORS policy:  No 'Access-Control-Allow-Origin'
      </p>
      <div className='flex flex-col md:flex-row mt-5 md:mt-10'>
        <div className='text-blue-600 flex flex-row md:flex-col items-center mb-5 md:mb-0 md:mr-4'>
          <FaCloudUploadAlt className='mb-1' />
          <p className='text-black mb-0'>df</p>
          <FaLock className='mt-3' />
          <FaBoltLightning className='mt-3'/>
        </div>
        <div className='w-'>
          <p className='text-xs  lg:text-lg'><strong>Instant CORS Resolution:</strong> Transform complex integration into smooth API interaction</p>
          <p className='text-xs lg:text-lg'><strong>Secure API Keys:</strong> Protect your data with tailored user-specific keys.</p>
          <p className='text-xs lg:text-lg'><strong>Quick Setup:</strong> Get started swiftly without any hassle</p>
        </div>
      </div>
    </div>
    <div className='flex-1 mt-5 md:mt-0 md:w-1/2'>
      <CodeDemo />
    </div>
  </div>
  

  )
}


const Home3 = () => {
  return (
    <div className="bg-black text-white py-16 px-8 max-sm:py-10 max-sm:px-2">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4 max-sm:text-2xl">Unlock the Power of APIs</h1>
        <p className="text-lg mb-12 max-sm:text-base">
          Effortlessly integrate our secure APIs and enhance your application's capabilities while avoiding CORS issues.
        </p>
      </div>

      <div className="max-w-4xl mx-auto flex flex-col space-y-12">
        <div className="flex items-start space-x-4">
          <div className="bg-gray-800 p-4 rounded-full">
            {/* Icon for Get Your API Key */}
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2a10 10 0 00-5 18.71V22h10v-1.29A10 10 0 0012 2zm-4 10a4 4 0 118 0 4 4 0 01-8 0zm10 6h-2v-1.26a6 6 0 10-8 0V18H6a8 8 0 1116 0z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold max-sm:text-sm">Get Your API Key</h2>
            <p className='max-sm:text-xs'>Sign up and get your unique API key to start integrating with ease and security.</p>
          </div>
        </div>

        <div className="flex items-start space-x-4">
          <div className="bg-gray-800 p-4 rounded-full">
            {/* Icon for Integrate Seamlessly */}
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2a10 10 0 00-10 10 9.98 9.98 0 004.25 8.25L12 22l5.75-1.75A10 10 0 0022 12a10 10 0 00-10-10zm0 18.25L9.2 19h-.55a7.94 7.94 0 01-3.86-1.02L6 14.3l6-3.3 6 3.3-1.79 3.68c-1.3.65-2.74 1.03-4.21 1.06zm4.66-5.62a4 4 0 11-5.66 0 4 4 0 015.66 0z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold max-sm:text-sm">Integrate Seamlessly</h2>
            <p className='max-sm:text-xs'>Follow our straightforward guides to integrate our APIs into your application without hassle.</p>
          </div>
        </div>

        <div className="flex items-start space-x-4">
          <div className="bg-gray-800 p-4 rounded-full">
            {/* Icon for Go Live */}
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm5.67 5.67l-1.42 1.42A5.98 5.98 0 0112 18v-2a4 4 0 10-3.17-7l1.42-1.42a6 6 0 015.42 0z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold max-sm:text-sm">Go Live</h2>
            <p className='max-sm:text-xs'>Launch your application with confidence, backed by our secure and efficient API services.</p>
          </div>
        </div>
      </div>
    </div>
  );
};


const Home4 = () => {
  const features = [
    "Resolve CORS issues with a few simple API key integrations.",
    "Enjoy secure access to your data with unique API keys.",
    "Quick setup allows you to focus on building your applications.",
  ];

  return (
    <div className="bg-gray-900 text-white p-10 flex flex-col md:flex-row justify-between items-center">
      <div>
        <h2 className="text-4xl font-bold mb-4">Experience Seamless API Access for Developers.</h2>
        <div className="mb-8">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center mb-2">
              <span className="text-blue-500 mr-2">✔</span>
              <p className="text-gray-300">{feature}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col space-y-4">
        <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-full">
          Get Started Now
        </button>
        <button className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-6 rounded-full">
          Discover Our API Solutions
        </button>
      </div>
    </div>
  );
};







const Homee = () => {
  return (
    <div className="max-w-7xl mx-auto p-6 flex flex-col space-y-8">
     
      <div className="bg-gradient-dark p-6 rounded-lg shadow-lg hover-scale relative overflow-hidden">
        <img
          src="/images/support-bg.svg"
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover opacity-10 pointer-events-none"
        />
        <h2 className="text-3xl font-semibold text-gray-100 mb-4 z-10 relative">
          Support & Resources
        </h2>
        <p className="text-gray-300 leading-relaxed z-10 relative">
          Our support team is here to help you every step of the way. Whether you need assistance with API integration, troubleshooting, or exploring advanced features, we're just a click away.
        </p>
        <ul className="list-disc list-inside text-gray-300 leading-relaxed space-y-2 z-10 relative">
          <li>
            {/* <a href="/documentation" className="text-gray-100 hover:text-gray-400 hover:underline"> */}
    <Link to='/documentation' className='text-gray-100 hover:text-gray-400'> API Documentation </Link>
          </li>
          <li>
            {/* <a href="/support" className="text-gray-100 hover:text-gray-400 hover:underline" onClick={}>
              Contact Support
            </a> */}
          </li>
        </ul>
      </div>
    </div>
  )
}
