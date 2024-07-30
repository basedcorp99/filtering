'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdvancedOptions from './AdvancedOptions';
import AddEntryForm from './AddEntryForm';
import EntryList from './EntryList';
import EditEntryDialog from './EditEntryDialog';
import ScriptCodeDialog from './ScriptCodeDialog';
import Spinner from './Spinner';
import Modal from './Modal';
import { validateUrl } from '@lib/validation';


const Home = () => {
  const [entries, setEntries] = useState([]);
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [editStreamName, setEditStreamName] = useState('');
  const [editSafeLink, setEditSafeLink] = useState('');
  const [editMoneyLink, setEditMoneyLink] = useState('');
  const [editUtm, setEditUtm] = useState(false);
  const [editTtclid, setEditTtclid] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [currentEntry, setCurrentEntry] = useState(null);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedEntries, setSelectedEntries] = useState([]);

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const response = await axios.get('/api/entries');
      setEntries(response.data);
      setFilteredEntries(response.data);
    } catch (error) {
      console.error('Failed to fetch entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddEntry = async ({ streamName, safeLink, moneyLink, utm, ttclid }) => {
    if (!streamName) {
      setError('Stream Name is required');
      return;
    }

    try {
      await axios.post('/api/entries', { streamName, safeLink, moneyLink, utm, ttclid });
      fetchEntries();
      setError('');
    } catch (error) {
      setError(error.response?.data?.error || 'An error occurred');
    }
  };

  const handleEditEntry = async () => {
    if (editSafeLink && !validateUrl(editSafeLink)) {
      setError('Invalid Safe URL.');
      return;
    }
    if (editMoneyLink && !validateUrl(editMoneyLink)) {
      setError('Invalid Money URL.');
      return;
    }

    try {
      await axios.put(`/api/entries/${currentEntry.id}`, {
        stream_name: currentEntry.stream_name,
        safe_link: editSafeLink,
        money_link: editMoneyLink,
        money_active: currentEntry.money_active,
        utm: editUtm,
        ttclid: editTtclid,
      });
      axios.delete(`${process.env.NEXT_PUBLIC_AWS_ENDPOINT}/script/${currentEntry.stream_name}`);
    } catch (error) {
      setError(error.response?.data?.error || 'An error occurred');
    }
    fetchEntries();
    handleCloseEditDialog();
  };

  const handleBulkEdit = (entries) => {
    setSelectedEntries(entries);
    if (entries.length === 1) {
      const entry = entries[0];
      setCurrentEntry(entry);
      setEditStreamName(entry.stream_name);
      setEditSafeLink(entry.safe_link);
      setEditMoneyLink(entry.money_link);
      setEditUtm(entry.utm);
      setEditTtclid(entry.ttclid);
      setOpenEditDialog(true);
    } else {
      setEditStreamName('');
      setEditSafeLink('');
      setEditMoneyLink('');
      setEditUtm(false);
      setEditTtclid(false);
      setOpenEditDialog(true);
    }
  };

  const handleBulkSave = async () => {
    try {
      await Promise.all(
        selectedEntries.map((entry) =>
          axios.put(`/api/entries/${entry.id}`, {
            stream_name: entry.stream_name,
            safe_link: editSafeLink || entry.safe_link,
            money_link: editMoneyLink || entry.money_link,
            utm: editUtm,
            ttclid: editTtclid,
          })
        )
      );
      // Invalidate AWS without awaiting
      selectedEntries.forEach((entry) => {
        axios.delete(`${process.env.NEXT_PUBLIC_AWS_ENDPOINT}/script/${entry.stream_name}`).catch(err => {
          console.error(`Failed to clear cache on AWS for ${entry.stream_name}:`, err);
        });
    });
      fetchEntries();
      handleCloseEditDialog();
    } catch (error) {
      setError(error.response?.data?.error || 'An error occurred');
    }
  };

  const handleDeleteEntry = async (id) => {
    try {
      await axios.delete(`/api/entries/${id}`);
      fetchEntries();
    } catch (error) {
      console.error('Failed to delete entry:', error);
    }
  };

  const handleOpenDialog = (entry) => {
    setCurrentEntry(entry);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentEntry(null);
  };

  const handleOpenEditDialog = (entry) => {
    setCurrentEntry(entry);
    setEditStreamName(entry.stream_name);
    setEditSafeLink(entry.safe_link);
    setEditMoneyLink(entry.money_link);
    setEditUtm(entry.utm);
    setEditTtclid(entry.ttclid);
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setCurrentEntry(null);
    setSelectedEntries([]);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query) {
      const filtered = entries.filter((entry) =>
        entry.stream_name.toLowerCase().includes(query.toLowerCase()) ||
        entry.safe_link.toLowerCase().includes(query.toLowerCase()) ||
        entry.money_link.toLowerCase().includes(query.toLowerCase())
    );
      setFilteredEntries(filtered);
    } else {
      setFilteredEntries(entries);
    }
  };

  const handleClearCache = async () => {
    try {
      await axios.post('/api/clear-cache');
      axios.delete(`${process.env.NEXT_PUBLIC_AWS_ENDPOINT}/cache/clear`);
    } catch (error) {
      console.error('Failed to clear cache:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-4xl mx-auto px-6">
        <AddEntryForm onAddEntry={handleAddEntry} error={error} />
        {loading ? (
          <Spinner />
        ) : (
          <EntryList
            entries={filteredEntries}
            searchQuery={searchQuery}
            handleSearch={handleSearch}
            handleOpenEditDialog={handleOpenEditDialog}
            handleDeleteEntry={handleDeleteEntry}
            handleOpenDialog={handleOpenDialog}
            handleBulkEdit={handleBulkEdit}
            handleRefreshEntries={fetchEntries}
          />
        )}
      <AdvancedOptions handleClearCache={handleClearCache} />
      {currentEntry && openDialog && (
          <ScriptCodeDialog currentEntry={currentEntry} handleCloseDialog={handleCloseDialog} />
        )}
        {openEditDialog && (
          <EditEntryDialog
            editStreamName={editStreamName}
            editSafeLink={editSafeLink}
            editMoneyLink={editMoneyLink}
            editUtm={editUtm}
            editTtclid={editTtclid}
            setEditSafeLink={setEditSafeLink}
            setEditMoneyLink={setEditMoneyLink}
            setEditUtm={setEditUtm}
            setEditTtclid={setEditTtclid}
            handleEditEntry={selectedEntries.length > 1 ? handleBulkSave : handleEditEntry}
            handleCloseEditDialog={handleCloseEditDialog}
          />
        )}
        {error && (
          <Modal
            title="Error"
            description={error}
            confirmText="OK"
            onConfirm={() => setError('')}
            onCancel={() => setError('')}
          />
        )}
      </div>
    </div>
  );
};

export default Home;
