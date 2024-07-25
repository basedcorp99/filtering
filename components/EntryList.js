import React, { useState, useEffect } from 'react';
import { useMediaQuery } from 'react-responsive';
import moment from 'moment';  // Ensure you have moment.js installed
import Modal from './Modal';
import axios from 'axios';

const EntryList = ({
  entries,
  searchQuery,
  handleSearch,
  handleOpenEditDialog,
  handleDeleteEntry,
  handleOpenDialog,
  handleBulkEdit,
  handleRefreshEntries, // Add this prop for refreshing entries
}) => {
  const [entryToDelete, setEntryToDelete] = useState(null);
  const [selectedEntries, setSelectedEntries] = useState([]);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [selectMode, setSelectMode] = useState(false);
  const [longPressEntry, setLongPressEntry] = useState(null);
  const isLargeScreen = useMediaQuery({ query: '(min-width: 1024px)' });

  useEffect(() => {
    if (isLargeScreen) return;

    let touchTimeout;

    const handleTouchStart = (event) => {
      const entryElement = event.target.closest('li');
      if (entryElement) {
        const entryId = entryElement.dataset.entryId;
        touchTimeout = setTimeout(() => {
          setSelectMode(true);
          setLongPressEntry(entries.find((entry) => entry.id === parseInt(entryId)));
        }, 250); // 250ms threshold for long press
      }
    };

    const handleTouchEnd = () => {
      clearTimeout(touchTimeout);
    };

    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isLargeScreen, entries]);

  useEffect(() => {
    if (longPressEntry) {
      handleSelectEntry(longPressEntry);
      setLongPressEntry(null);
    }
  }, [longPressEntry]);

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
    const allSelected = entries.length === selectedEntries.length;
    setSelectedEntries(allSelected ? [] : entries);
    if (!isLargeScreen) {
      setSelectMode(!allSelected);  // Ensure select mode is enabled when selecting all
    }
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

  useEffect(() => {
    if (selectedEntries.length === 0) {
      setSelectMode(false);
    }
  }, [selectedEntries]);

  const handleClickEntry = (entry) => {
    if (selectMode) {
      handleSelectEntry(entry);
    }
  };

  const handleCheckboxChange = (entry) => {
    handleSelectEntry(entry);
  };

  const handleToggleIsMoney = async (entry, isChecked) => {
    try {
      const updatedEntry = { ...entry, money_active: isChecked };
      await axios.put(`/api/entries/${entry.id}`, updatedEntry);
      await axios.delete(`${NEXT_PUBLIC_AWS_ENDPOINT}/script/${entry.id}`);
      handleRefreshEntries(); // Refresh entries to reflect the change
    } catch (error) {
      console.error('Error updating money_active status:', error);
    }
  };

  const isExpiringSoon = (lastAccess) => {
    const now = moment();
    const lastAccessTime = moment(lastAccess);
    const hoursDifference = moment.duration(now.diff(lastAccessTime)).asHours();
    return hoursDifference >= 24 && hoursDifference <= 36; // Entry is expiring in the next 12 hours
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Active Redirect Entries</h2>
        <button
          onClick={handleRefreshEntries}
          className="bg-gray-200 text-gray-700 py-1 px-3 rounded-lg hover:bg-gray-300 transition duration-200"
        >
          Refresh
        </button>
      </div>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search by Stream Name or Destination Link"
        className="w-full mb-4 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <div className="flex justify-between mb-4 flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2">
        <button
          onClick={handleSelectAll}
          className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200"
        >
          {entries.length === selectedEntries.length ? 'Deselect All' : 'Select All'}
        </button>
        <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2">
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
          <li
            key={entry.id}
            data-entry-id={entry.id}
            className={`select-none mb-4 p-4 rounded-lg flex flex-col lg:flex-row items-start lg:items-center ${
              !isLargeScreen && selectMode && selectedEntries.includes(entry) ? 'bg-blue-100' : 'bg-gray-50'
            }`}
            onClick={() => handleClickEntry(entry)}
          >
            {isLargeScreen && (
              <input
                type="checkbox"
                checked={selectedEntries.includes(entry)}
                onChange={() => handleCheckboxChange(entry)}
                className="mr-6 w-6 h-6 lg:w-6 lg:h-6"
              />
            )}
            <div className="flex-grow lg:mr-4">
              <p className="font-semibold text-gray-800 break-words">{entry.stream_name}</p>
              <p className="text-gray-600 break-all">Safe URL: {entry.safe_link}</p>
              <p className="text-gray-600 break-all">Money URL: {entry.money_link}</p>
              <p className="text-gray-600">UTM: {entry.utm ? 'Yes' : 'No'}, TTCLID: {entry.ttclid ? 'Yes' : 'No'}</p>
              {isExpiringSoon(entry.last_access) && (
                <p className="text-red-500 font-bold">Expiring in less than 12 hours!</p>
              )}
            </div>
            <div className="flex flex-col lg:flex-row space-x-0 lg:space-x-2 space-y-2 lg:space-y-0 mt-4 lg:mt-0 w-full lg:w-auto">
            <div className="bg-gray-100 p-2 rounded-lg flex items-center justify-between">
              <span>Money:</span>
              <label className="switch ml-2">
                <input type="checkbox" checked={entry.money_active} onChange={(e) => handleToggleIsMoney(entry, e.target.checked)} />
                <span className="slider"></span>
              </label>
            </div>
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
