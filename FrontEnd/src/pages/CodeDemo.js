import React, { useEffect, useRef, useState } from 'react';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';

const CodeDemo = () => {
  const [isCopied, setIsCopied] = useState(false);
  const codeRef = useRef(null);


  const code = `
  const ApiKey = 'your_ApiKey';
  const EDUCORS_URL = 'https://educorssolver.host/api/getData';
  // Target URL from you want to fetch data m ,ex-github api
  const Target = 'https://api.github.com/users/bsingh6636/repos';
  const response = await fetch(\`\${EDUCORS_URL}?ApiKey=\${ApiKey}&Target=\${Target}\`);
  const data = await response.json();
  console.log('Data fetched successfully:', data);
`;



  useEffect(() => {
    if (codeRef.current) {
      Prism.highlightElement(codeRef.current); // Highlight the code block on render
    }
  }, []);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
    });
  };
  return (
    <div className="code-demo-container mt-8 sm:mt-10 md:mt-12 text-sm max-sm:text-xs">
  <pre className="code-block p-4 sm:p-6 md:p-8 bg-gray-900 text-white overflow-x-auto rounded-lg">
    <code ref={codeRef} className="language-javascript">
      {code}
    </code>
    {/* <div className="line-numbers hidden sm:block">
      {Array.from({ length: code.split('\n').length }, (_, i) => (
        <span key={i + 1} className="line">{i + 1}</span>
      ))}
    </div> */}
  </pre>
  <button
    onClick={copyToClipboard}
    className={`copy-btn ${isCopied ? 'bg-green-500' : 'bg-blue-600'} text-white px-4 py-2 rounded mt-4`}
  >
    {isCopied ? 'Copied!' : 'Copy Code'}
  </button>
</div>
  );
};

export default CodeDemo;
