import React, { useEffect, useRef, useState } from 'react';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css'; 
import '../css/CodeDemo.css';

const CodeDemo = () => {
  const [isCopied, setIsCopied] = useState(false);
  const codeRef = useRef(null);

const code = `
 // It's recommended to use environment variables for 
 // sensitive information like API keys.
 const API_KEY = '310ecb8f2154245c';
 const EDUCORS_URL ='https://educorssolver.host/api/getData';
 const TARGET_URL ='https://api.github.com/users/bsingh6636/repos';

 // Function to get data from the API
  async function githubUserData() {
    const response = await fetch(EDUCORS_URL, {
      method: 'POST',
      headers: {'Content-Type': 'application/json' },
      body: JSON.stringify({ ApiKey: API_KEY, Target: TARGET_URL }),
    });
    const data = await response.json();
    console.log('Data fetched successfully:', data);
    return data;
    }

    // Example usage
    githubUserData();
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
    <div className="code-demo-container">
      <pre className="code-block">
        <code ref={codeRef} className="language-javascript">
          {code}
        </code>
        <div className="line-numbers">
          {Array.from({ length: 19}, (_, i) => (
            //  length: code.split('\n').length 
            <span key={i + 1} className="line">{i + 1}</span>
          ))}
        </div>
      </pre>
      <button onClick={copyToClipboard} className={`copy-btn ${isCopied ? 'copied' : ''}`}>
        {isCopied ? 'Copied!' : 'Copy Code'}
      </button>
    </div>
  );
};

export default CodeDemo;
