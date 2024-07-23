import React from 'react';

const EditEntryDialog = ({
  editStreamName,
  editSafeLink,
  editMoneyLink,
  editUtm,
  editTtclid,
  setEditSafeLink,
  setEditMoneyLink,
  setEditUtm,
  setEditTtclid,
  handleEditEntry,
  handleCloseEditDialog
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full">
        <h3 className="text-xl mb-4 text-gray-800">Edit Entry</h3>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Stream Name (cannot be edited)</label>
          <input
            type="text"
            value={editStreamName}
            disabled
            className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100 cursor-not-allowed"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Safe Link</label>
          <input
            type="text"
            value={editSafeLink}
            onChange={(e) => setEditSafeLink(e.target.value)}
            className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Money Link</label>
          <input
            type="text"
            value={editMoneyLink}
            onChange={(e) => setEditMoneyLink(e.target.value)}
            className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={editUtm}
              onChange={(e) => setEditUtm(e.target.checked)}
              className="form-checkbox h-5 w-5 text-blue-600"
            />
            <span className="ml-2 text-gray-700">UTM</span>
          </label>
        </div>
        <div className="mb-4">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={editTtclid}
              onChange={(e) => setEditTtclid(e.target.checked)}
              className="form-checkbox h-5 w-5 text-blue-600"
            />
            <span className="ml-2 text-gray-700">TTCLID</span>
          </label>
        </div>
        <div className="flex justify-end space-x-2">
          <button
            onClick={handleCloseEditDialog}
            className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition duration-200"
          >
            Cancel
          </button>
          <button
            onClick={handleEditEntry}
            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditEntryDialog;
