import React, { useEffect, useRef, useState } from 'react';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css'; // Choose your preferred Prism theme
import '../css/CodeDemo.css';

const CodeDemo = () => {
  const [isCopied, setIsCopied] = useState(false);
  const codeRef = useRef(null);

  const code =    
`      fetch('https://api.yourwebsite.com/data', {
                  headers: {
                  'Authorization': 'Bearer YOUR_API_KEY'
                }
              })
            .then(response => response.json())
            .then(data => console.log(data))
            .catch(error => console.error('Error:', error));`;
 
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
    <div className="code-container  ">
      <pre className="code-block">
        <code ref={codeRef} className="language-javascript">
          {code}
        </code>
        <div className="line-numbers">
          {Array.from({ length: 12 }, (_, i) => (
            <span key={i + 1} className="line">{i + 1}</span>
          ))}
        </div>
      </pre>
      <button onClick={copyToClipboard} className={`copy-btn ${isCopied ? 'copied' : ''}`}>
        {isCopied ? 'Copied!' : 'Copy'}
      </button>
    </div>
  );
}

export default CodeDemo;
