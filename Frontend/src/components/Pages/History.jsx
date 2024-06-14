import React, { useState, useEffect } from 'react';
import axios from 'axios';
import VideoCard from '../Cards/VideoCard';
const SERVER_URL = import.meta.env.VITE_APP_SERVER_URL;

function History() {
  const [watchHistory, setWatchHistory] = useState([]);

  useEffect(() => {
    const fetchWatchHistory = async () => {
      try {
        const res = await axios.get(`${SERVER_URL}/users/history`);
        setWatchHistory(res.data.data);
      } catch (error) {
        console.error('Error fetching watch history:', error);
      }
    };

    fetchWatchHistory();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-white mb-8">Watch History</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2">
        {watchHistory.length > 0 ? (
          watchHistory.map((video) => (
            <div key={video._id} className="w-full">
              <VideoCard {...video} />
            </div>
          ))
        ) : (
          <p className="text-lg text-white">No videos in watch history.</p>
        )}
      </div>
    </div>
  );
}

export default History;
