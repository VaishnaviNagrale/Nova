import React, { useState, useEffect } from 'react';
import axios from 'axios';

function MyContent() {
  const [channelProfile, setChannelProfile] = useState({});
  
  useEffect(() => {
    const fetchChannelProfile = async () => {
      try {
        const response = await axios.get('/api/users/current-user');
        const { username } = response.data.data;
        const res = await axios.get(`/api/users/c/${username}`);
        setChannelProfile(res.data.data);
      } catch (error) {
        console.error('Error fetching channel profile:', error);
      }
    };

    fetchChannelProfile();
  }, []);

  return (
<div className="max-w-4xl mx-auto p-6 bg-gray-900 rounded-lg shadow-md mt-6">
  <h1 className="text-3xl font-bold text-white mb-8">My Content</h1>
  <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
    <h2 className="text-2xl font-semibold text-white mb-4">Channel Profile</h2>
    <div className="grid grid-cols-2 gap-6">
      <div className="flex flex-col">
        <p className="text-gray-400">Full Name:</p>
        <p className="text-lg font-medium text-white">{channelProfile.fullName || 'Loading...'}</p>
      </div>
      <div className="flex flex-col">
        <p className="text-gray-400">Username:</p>
        <p className="text-lg font-medium text-white">{channelProfile.username || 'Loading...'}</p>
      </div>
      <div className="flex flex-col">
        <p className="text-gray-400">Email:</p>
        <p className="text-lg font-medium text-white">{channelProfile.email || 'Loading...'}</p>
      </div>
      <div className="flex flex-col">
        <p className="text-gray-400">Subscribed:</p>
        <p className="text-lg font-medium text-white">{channelProfile.isSubscribe ? 'Yes' : 'No'}</p>
      </div>
      <div className="flex flex-col">
        <p className="text-gray-400">Subscribers Count:</p>
        <p className="text-lg font-medium text-white">{channelProfile.subscriberCount || '0'}</p>
      </div>
      <div className="flex flex-col">
        <p className="text-gray-400">Channels Subscribed To Count:</p>
        <p className="text-lg font-medium text-white">{channelProfile.channelsSubscribedToCount || '0'}</p>
      </div>
      <div className="flex flex-col">
        <p className="text-gray-400">Avatar:</p>
        <img src={channelProfile.avatar || 'default_avatar.png'} alt="Avatar" className="w-16 h-16 rounded-full" />
      </div>
      <div className="flex flex-col">
        <p className="text-gray-400">Cover Image:</p>
        <img src={channelProfile.coverImage || 'default_cover_image.png'} alt="Cover Image" className="w-full rounded-lg" />
      </div>
    </div>
  </div>
</div>


  );
}

export default MyContent;