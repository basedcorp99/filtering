import React, { useState } from 'react';
import TemporaryMessage from './TemporaryMessage';

const AdvancedOptions = ({ handleClearCache }) => {
    const [message, setMessage] = useState('');
    const [error, setError] = useState(false);

  const clearCache = async () => {
    await handleClearCache();
    alert('Cache cleared successfully!');
  };

  return (
    <div className="mt-8">
      <button
        onClick={clearCache}
        className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition duration-200"
      >
        Clear Cache
      </button>
      </div>
  );
};

export default AdvancedOptions;
