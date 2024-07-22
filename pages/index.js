import { useState, useEffect } from 'react';
import axios from 'axios';
import AddEntryForm from '../components/AddEntryForm';
import EntryList from '../components/EntryList';
import EditEntryDialog from '../components/EditEntryDialog';
import ScriptCodeDialog from '../components/ScriptCodeDialog';

const Home = () => {
  const [entries, setEntries] = useState([]);
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [editStreamName, setEditStreamName] = useState('');
  const [editDestinationLink, setEditDestinationLink] = useState('');
  const [editUtm, setEditUtm] = useState(false);
  const [editTtclid, setEditTtclid] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [currentEntry, setCurrentEntry] = useState(null);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    const response = await axios.get('/api/entries');
    setEntries(response.data);
    setFilteredEntries(response.data);
  };

  const handleAddEntry = async ({ streamName, destinationLink, utm, ttclid }) => {
    if (!streamName) {
      setError('Stream Name is required');
      return;
    }

    try {
      await axios.post('/api/entries', { streamName, destinationLink, utm, ttclid });
      fetchEntries();
      setError('');
    } catch (error) {
      setError(error.response?.data?.error || 'An error occurred');
    }
  };

  const handleEditEntry = async () => {
    if (!editStreamName) {
      setError('Stream Name is required');
      return;
    }

    try {
      await axios.put(`/api/entries/${currentEntry.id}`, {
        destinationLink: editDestinationLink,
        utm: editUtm,
        ttclid: editTtclid
      });
      fetchEntries();
      handleCloseEditDialog();
    } catch (error) {
      setError(error.response?.data?.error || 'An error occurred');
    }
  };

  const handleDeleteEntry = async (id) => {
    await axios.delete(`/api/entries/${id}`);
    fetchEntries();
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
    setEditDestinationLink(entry.destination_link);
    setEditUtm(entry.utm);
    setEditTtclid(entry.ttclid);
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setCurrentEntry(null);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query) {
      const filtered = entries.filter((entry) =>
        entry.stream_name.toLowerCase().includes(query.toLowerCase()) ||
        entry.destination_link.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredEntries(filtered);
    } else {
      setFilteredEntries(entries);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-4xl mx-auto px-6">
        <AddEntryForm onAddEntry={handleAddEntry} error={error} />
        <EntryList
          entries={filteredEntries}
          searchQuery={searchQuery}
          handleSearch={handleSearch}
          handleOpenEditDialog={handleOpenEditDialog}
          handleDeleteEntry={handleDeleteEntry}
          handleOpenDialog={handleOpenDialog}
        />
        {currentEntry && openDialog && (
          <ScriptCodeDialog currentEntry={currentEntry} handleCloseDialog={handleCloseDialog} />
        )}
        {currentEntry && openEditDialog && (
          <EditEntryDialog
            editStreamName={editStreamName}
            editDestinationLink={editDestinationLink}
            editUtm={editUtm}
            editTtclid={editTtclid}
            setEditDestinationLink={setEditDestinationLink}
            setEditUtm={setEditUtm}
            setEditTtclid={setEditTtclid}
            handleEditEntry={handleEditEntry}
            handleCloseEditDialog={handleCloseEditDialog}
          />
        )}
      </div>
    </div>
  );
};

export default Home;
