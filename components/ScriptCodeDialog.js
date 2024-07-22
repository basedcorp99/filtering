import React from 'react';

const ScriptCodeDialog = ({ currentEntry, handleCloseDialog }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full">
        <h3 className="text-xl mb-4 text-gray-800">Script Code</h3>
        <p className="mb-4 bg-gray-100 p-2 rounded-lg text-gray-800">
          <a href={`/api/script/${currentEntry.stream_name}`} target="_blank" className="text-blue-500 underline">
            {`<script src="/api/script/${currentEntry.stream_name}"></script>`}
          </a>
        </p>
        <button
          onClick={() => navigator.clipboard.writeText(`<script src="/api/script/${currentEntry.stream_name}"></script>`)}
          className="bg-blue-500 text-white py-2 px-4 rounded-lg mr-2 hover:bg-blue-600 transition duration-200"
        >
          Copy Code
        </button>
        <button
          onClick={handleCloseDialog}
          className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition duration-200"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ScriptCodeDialog;
