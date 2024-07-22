import React, { useState } from 'react';
import Modal from './Modal';

const EntryList = ({
  entries,
  searchQuery,
  handleSearch,
  handleOpenEditDialog,
  handleDeleteEntry,
  handleOpenDialog,
  handleBulkEdit,
}) => {
  const [entryToDelete, setEntryToDelete] = useState(null);
  const [selectedEntries, setSelectedEntries] = useState([]);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);

  const confirmDelete = (entry) => {
    setEntryToDelete(entry);
  };

  const handleConfirmDelete = () => {
    if (entryToDelete) {
      handleDeleteEntry(entryToDelete.id);
      setEntryToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setEntryToDelete(null);
  };

  const handleSelectEntry = (entry) => {
    setSelectedEntries((prevSelectedEntries) =>
      prevSelectedEntries.includes(entry)
        ? prevSelectedEntries.filter((e) => e !== entry)
        : [...prevSelectedEntries, entry]
    );
  };

  const handleSelectAll = () => {
    setSelectedEntries(entries.length === selectedEntries.length ? [] : entries);
  };

  const handleBulkDelete = () => {
    setIsBulkDeleteModalOpen(true);
  };

  const handleConfirmBulkDelete = () => {
    selectedEntries.forEach((entry) => handleDeleteEntry(entry.id));
    setSelectedEntries([]);
    setIsBulkDeleteModalOpen(false);
  };

  const handleCancelBulkDelete = () => {
    setIsBulkDeleteModalOpen(false);
  };

  const handleBulkEditOpen = () => {
    if (selectedEntries.length > 0) {
      handleBulkEdit(selectedEntries);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Active Redirect Entries</h2>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search by Stream Name or Destination Link"
        className="w-full mb-4 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <div className="flex justify-between mb-4">
        <button
          onClick={handleSelectAll}
          className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200"
        >
          {entries.length === selectedEntries.length ? 'Deselect All' : 'Select All'}
        </button>
        <div className="flex space-x-2">
          <button
            onClick={handleBulkEditOpen}
            className={`py-2 px-4 rounded-lg transition duration-200 ${
              selectedEntries.length === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-yellow-500 text-white hover:bg-yellow-600'
            }`}
            disabled={selectedEntries.length === 0}
          >
            Edit Selected
          </button>
          <button
            onClick={handleBulkDelete}
            className={`py-2 px-4 rounded-lg transition duration-200 ${
              selectedEntries.length === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-red-500 text-white hover:bg-red-600'
            }`}
            disabled={selectedEntries.length === 0}
          >
            Delete Selected
          </button>
        </div>
      </div>
      <ul>
        {entries.map((entry) => (
          <li key={entry.id} className="mb-4 p-4 bg-gray-50 rounded-lg flex items-center">
            <input
              type="checkbox"
              checked={selectedEntries.includes(entry)}
              onChange={() => handleSelectEntry(entry)}
              className="form-checkbox h-5 w-5 text-blue-600 mr-4"
            />
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
                onClick={() => confirmDelete(entry)}
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
          </li>
        ))}
      </ul>
      {entryToDelete && (
        <Modal
          title="Confirm Deletion"
          description={`Are you sure you want to delete the entry for ${entryToDelete.stream_name}? This action cannot be undone.`}
          confirmText="Delete"
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
      {isBulkDeleteModalOpen && (
        <Modal
          title="Confirm Bulk Deletion"
          description={`Are you sure you want to delete all selected entries? This action cannot be undone.`}
          confirmText="Delete All"
          onConfirm={handleConfirmBulkDelete}
          onCancel={handleCancelBulkDelete}
        />
      )}
    </div>
  );
};

export default EntryList;
