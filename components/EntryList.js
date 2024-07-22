import React from 'react';

const EntryList = ({
  entries,
  searchQuery,
  handleSearch,
  handleOpenEditDialog,
  handleDeleteEntry,
  handleOpenDialog
}) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Active Cloaking Entries</h2>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search by Stream Name or Destination Link"
        className="w-full mb-4 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <ul>
        {entries.map((entry) => (
          <li key={entry.id} className="mb-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center">
              <div className="flex-grow lg:mr-4">
                <p className="font-semibold text-gray-800 break-words">{entry.stream_name}</p>
                <p className="text-gray-600 break-all">{entry.destination_link}</p>
                <p className="text-gray-600">UTM: {entry.utm ? 'Yes' : 'No'}, TTCLID: {entry.ttclid ? 'Yes' : 'No'}</p>
              </div>
              <div className="flex space-x-2 mt-4 lg:mt-0">
                <button
                  onClick={() => handleOpenEditDialog(entry)}
                  className="bg-yellow-500 text-white py-1 px-3 rounded-lg hover:bg-yellow-600 transition duration-200"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteEntry(entry.id)}
                  className="bg-red-500 text-white py-1 px-3 rounded-lg hover:bg-red-600 transition duration-200"
                >
                  Delete
                </button>
                <button
                  onClick={() => handleOpenDialog(entry)}
                  className="bg-green-500 text-white py-1 px-3 rounded-lg hover:bg-green-600 transition duration-200"
                >
                  Code
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EntryList;
