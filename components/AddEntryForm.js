import React, { useState } from 'react';
import {validateStreamName, validateUrl } from '@lib/validation';

const AddEntryForm = ({ onAddEntry, error }) => {
  const [streamName, setStreamName] = useState('');
  const [safeLink, setSafeLink] = useState('');
  const [moneyLink, setMoneyLink] = useState('');
  const [utm, setUtm] = useState(false);
  const [ttclid, setTtclid] = useState(false);
  const [nameError, setNameError] = useState('');
  const [urlError, setUrlError] = useState('');

  const handleAddEntry = () => {
    setNameError(''); // Clear past errors
    setUrlError(''); // Clear past errors

    if (!validateStreamName(streamName)) {
      setNameError('Stream Name can only contain letters and numbers.');
      return;
    }

    if (safeLink && !validateUrl(safeLink)) {
      setUrlError('Invalid Safe URL.');
      return;
    }
    if (moneyLink && !validateUrl(moneyLink)) {
      setUrlError('Invalid Money URL.');
      return;
    }

    onAddEntry({ streamName, safeLink, moneyLink, utm, ttclid });
    setStreamName('');
    setSafeLink('');
    setMoneyLink('');
    setUtm(false);
    setTtclid(false);
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-8">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Add Redirect Entry</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Stream Name</label>
        <input
          type="text"
          value={streamName}
          onChange={(e) => setStreamName(e.target.value)}
          className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {nameError && <p className="text-red-500">{nameError}</p>}
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Safe Link (optional)</label>
        <input
          type="text"
          value={safeLink}
          onChange={(e) => setSafeLink(e.target.value)}
          className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {urlError && <p className="text-red-500">{urlError}</p>}
        </div>
        <div className="mb-4">
        <label className="block text-gray-700 mb-2">Money Link (optional)</label>
        <input
          type="text"
          value={moneyLink}
          onChange={(e) => setMoneyLink(e.target.value)}
          className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {urlError && <p className="text-red-500">{urlError}</p>}
      </div>
      <div className="mb-4">
        <label className="inline-flex items-center">
          <input
            type="checkbox"
            checked={utm}
            onChange={(e) => setUtm(e.target.checked)}
            className="form-checkbox h-5 w-5 text-blue-600"
          />
          <span className="ml-2 text-gray-700">UTM</span>
        </label>
      </div>
      <div className="mb-4">
        <label className="inline-flex items-center">
          <input
            type="checkbox"
            checked={ttclid}
            onChange={(e) => setTtclid(e.target.checked)}
            className="form-checkbox h-5 w-5 text-blue-600"
          />
          <span className="ml-2 text-gray-700">TTCLID</span>
        </label>
      </div>
      <button
      onClick={handleAddEntry}
      className="w-full sm:w-auto bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200"
      >
      Add Entry
      </button>
    </div>
  );
};

export default AddEntryForm;
