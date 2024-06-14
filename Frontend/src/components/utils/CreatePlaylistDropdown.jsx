import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
const SERVER_URL = import.meta.env.VITE_APP_SERVER_URL;

function CreatePlaylistDropdown({ videoId }) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [userPlaylists, setUserPlaylists] = useState([]);
  const [selectedPlaylists, setSelectedPlaylists] = useState({});

  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${SERVER_URL}/users/current-user`);
        const userId = res.data.data._id;
        const response = await axios.get(`${SERVER_URL}/playlists/user/${userId}`);
        setUserPlaylists(response.data.data);
      } catch (error) {
        console.error('Error fetching user playlists:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const createPlaylist = async () => {
    try {
      const response = await axios.post(`${SERVER_URL}/playlists`, { name, description });
      setSuccessMessage(response.data.message);
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000); // Clear success message after 3 seconds
      setName('');
      setDescription('');
      setError(null);
      setUserPlaylists([...userPlaylists, response.data.data]); // Add new playlist to the state
    } catch (error) {
      setError(error.response.data.message);
      setTimeout(() => {
        setError('');
      }, 3000); // Clear error message after 3 seconds
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === 'name') {
      setName(value);
    } else if (name === 'description') {
      setDescription(value);
    }
  };

  const handleAddRemoveVideoToPlaylist = async (playlistId, isChecked) => {
    try {
      const url = isChecked
        ? `${SERVER_URL}/playlists/add/${videoId}/${playlistId}`
        : `${SERVER_URL}/playlists/remove/${videoId}/${playlistId}`;
      await axios.patch(url);
      setSuccessMessage(isChecked ? 'Video added to playlist successfully' : 'Video removed from playlist successfully');
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000); // Clear success message after 3 seconds
    } catch (error) {
      setError(isChecked ? 'Error adding video to playlist' : 'Error removing video from playlist');
      setTimeout(() => {
        setError('');
      }, 3000); // Clear error message after 3 seconds
    }
  };

  const handleCheckboxChange = (playlistId, isChecked) => {
    setSelectedPlaylists({
      ...selectedPlaylists,
      [playlistId]: isChecked
    });
    handleAddRemoveVideoToPlaylist(playlistId, isChecked);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="bg-gray-900 text-white px-4 py-2 rounded-md focus:outline-none"
      >
        Create Playlist
      </button>
      {isOpen && (
        <div className="absolute top-full right-0 mt-1 w-64 bg-gray-800 border border-gray-600 shadow-lg rounded-md">
          <div className="p-4">
            <input
              type="text"
              name="name"
              value={name}
              onChange={handleInputChange}
              placeholder="Playlist Name"
              className="w-full border rounded-md px-3 py-2 mb-2 focus:outline-none focus:border-blue-500"
            />
            <textarea
              name="description"
              value={description}
              onChange={handleInputChange}
              placeholder="Playlist Description"
              className="w-full border rounded-md px-3 py-2 mb-2 focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={createPlaylist}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none"
            >
              Create
            </button>
            {error && <p className="mt-2 text-red-600">{error}</p>}
            {successMessage && <p className="mt-2 text-green-600">{successMessage}</p>}
            <div className="mt-4">
              <h2 className="text-white text-lg font-semibold mb-2">Your Playlists</h2>
              <ul>
                {userPlaylists.map((playlist) => (
                  <li key={playlist._id} className="flex items-center justify-between py-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedPlaylists[playlist._id] || false}
                        onChange={(e) => handleCheckboxChange(playlist._id, e.target.checked)}
                        className="mr-2"
                      />
                      {playlist.name}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CreatePlaylistDropdown;