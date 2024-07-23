import React, { useState } from 'react';
import TemporaryMessage from './TemporaryMessage';

const ScriptCodeDialog = ({ currentEntry, handleCloseDialog }) => {
  const [message, setMessage] = useState('');
  const [message_is_err, setMessageErr] = useState('');
  const domain = window.location.origin;
  const snipUrl = `/api/script/${currentEntry.stream_name}`;
  const fullUrl = `${domain}${snipUrl}`;

  const copyToClipboard = () => {
    // Ensure the document is focused before attempting to copy
    setTimeout(() => {
      navigator.clipboard.writeText(`<script src="${fullUrl}"></script>`)
        .then(() => {
          setMessage('Code copied to clipboard!');
        })
        .catch(err => {
          console.error('Failed to copy: ', err);
          setMessage('Failed to copy code to clipboard');
          setMessageErr(true);
        });
    }, 0);
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
        <TemporaryMessage message={message} is_err={message_is_err}/>
      </div>
    </div>
  );
};

export default ScriptCodeDialog;
