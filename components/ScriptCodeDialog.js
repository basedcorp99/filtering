import React, { useState } from 'react';

const ScriptCodeDialog = ({ currentEntry, handleCloseDialog }) => {
  const [copied, setCopied] = useState(false);
  const domain = window.location.origin;
  const snipUrl = `/api/script/${currentEntry.stream_name}`;
  const fullUrl = `${domain}${snipUrl}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`<script src="${fullUrl}"></script>`);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000); // Hide the message after 3 seconds
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full">
        <h3 className="text-xl mb-4 text-gray-800">Script Code for {currentEntry.stream_name}</h3>
        <p className="mb-4 break-all bg-gray-100 p-4 rounded-lg">
          <a href={snipUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
            <code>&lt;script src=&quot;{fullUrl}&quot;&gt;&lt;/script&gt;</code>
          </a>
        </p>
        <div className="flex justify-begin space-x-2">
          <button
            onClick={copyToClipboard}
            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200"
          >
            Copy Code
          </button>
          <button
            onClick={handleCloseDialog}
            className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition duration-200"
          >
            Close
          </button>
        </div>
        {copied && (
          <div className="mt-4 p-2 bg-green-100 text-green-700 rounded-lg">
            Code copied to clipboard!
          </div>
        )}
      </div>
    </div>
  );
};

export default ScriptCodeDialog;
