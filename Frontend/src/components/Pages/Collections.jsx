import React, { useState, useEffect } from 'react';
import VideoCard from '../Cards/VideoCard';
import axios from 'axios';

function Collections() {
  const [playlists, setPlaylists] = useState([]);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [editPlaylist, setEditPlaylist] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const res = await axios.get('/api/users/current-user');
        const userId = res.data.data._id;
        const response = await axios.get(`/api/playlists/user/${userId}`);
        setPlaylists(response.data.data);
      } catch (error) {
        setError('Error fetching playlists');
      }
    };

    fetchPlaylists();
  }, []);

  const handleDeletePlaylist = async (playlistId) => {
    try {
      await axios.delete(`/api/playlists/${playlistId}`);
      setPlaylists(playlists.filter(playlist => playlist._id !== playlistId));
      setSuccessMessage('Playlist deleted successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setError('Error deleting playlist');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleEditPlaylist = (playlist) => {
    setEditPlaylist(playlist._id);
    setName(playlist.name);
    setDescription(playlist.description);
  };

  const handleUpdatePlaylist = async () => {
    try {
      const updatedPlaylist = await axios.patch(`/api/playlists/${editPlaylist}`, { name, description });
      setPlaylists(playlists.map(p => (p._id === editPlaylist ? updatedPlaylist.data.data : p)));
      setEditPlaylist(null);
      setName('');
      setDescription('');
      setSuccessMessage('Playlist updated successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setError('Error updating playlist');
      setTimeout(() => setError(''), 3000);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Your Collections</h1>
      {error && <p className="text-red-600">{error}</p>}
      {successMessage && <p className="text-green-600">{successMessage}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {playlists.map(playlist => (
          <div key={playlist._id} className="bg-gray-800 p-4 rounded-lg shadow-md">
            {editPlaylist === playlist._id ? (
              <div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Playlist Name"
                  className="w-full p-2 mb-2 rounded-md bg-gray-700 text-white"
                />
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Playlist Description"
                  className="w-full p-2 mb-2 rounded-md bg-gray-700 text-white"
                />
                <button
                  onClick={handleUpdatePlaylist}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2 hover:bg-blue-600"
                >
                  Update
                </button>
                <button
                  onClick={() => setEditPlaylist(null)}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-semibold mb-2">PlayList : {playlist.name}</h2>
                <p className="mb-4">{playlist.description}</p>
                <button
                  onClick={() => handleEditPlaylist(playlist)}
                  className="bg-yellow-500 text-white px-4 py-2 rounded-md mr-2 hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeletePlaylist(playlist._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                >
                  Delete
                </button>
                <div className="mt-4">
                  <h3 className="text-lg font-semibold">Videos</h3>
                  {playlist.videos && playlist.videos.length > 0 ? (
                    <ul className="mt-2">
                      {playlist.videos.map(video => (
                        <div key={video._id} className="w-full">
                        <VideoCard {...video} />
                      </div>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-400">No videos in this playlist</p>
                  )}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Collections;
