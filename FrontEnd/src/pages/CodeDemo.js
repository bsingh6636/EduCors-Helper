import React, { useEffect, useRef, useState } from 'react';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import { FaCopy, FaCheck } from 'react-icons/fa';

const CodeDemo = () => {
  const [isCopied, setIsCopied] = useState(false);
  const codeRef = useRef(null);

  const code = `const ApiKey = 'your_ApiKey';
const EDUCORS_URL = 'https://cors-proxy.brijeshdev.space/api/getData';
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
    navigator.clipboard.writeText(code).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  return (
    <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-gray-800/50 border-b border-gray-700/50">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500/80"></span>
            <span className="w-3 h-3 rounded-full bg-yellow-500/80"></span>
            <span className="w-3 h-3 rounded-full bg-green-500/80"></span>
          </div>
          <span className="text-gray-400 text-sm font-medium ml-2">JavaScript</span>
        </div>
        <button
          onClick={copyToClipboard}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
            isCopied 
              ? 'bg-green-500/20 text-green-400' 
              : 'bg-gray-700/50 text-gray-400 hover:bg-gray-700 hover:text-white'
          }`}
        >
          {isCopied ? <FaCheck className="text-xs" /> : <FaCopy className="text-xs" />}
          {isCopied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-sm">
        <code ref={codeRef} className="language-javascript">
          {code}
        </code>
      </pre>
    </div>
  );
};

export default CodeDemo;
