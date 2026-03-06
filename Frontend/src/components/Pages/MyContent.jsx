import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../utils/apiClient";
import { FaUser, FaUsers, FaEnvelope } from "react-icons/fa";

function MyContent() {
  const [channelProfile, setChannelProfile] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChannelProfile = async () => {
      try {
        const response = await apiClient.get(`/api/v1/users/current-user`);
        const { username } = response.data.data;
        const res = await apiClient.get(`/api/v1/users/c/${username}`);
        setChannelProfile(res.data.data);
      } catch (error) {
        console.error("Error fetching channel profile:", error);
      }
    };

    fetchChannelProfile();
  }, []);

  const handleChannelClick = () => {
    if (!channelProfile?._id) return;
    navigate(`/channel/${channelProfile._id}`);
  };

  return (
    <div className="max-w-5xl mx-auto p-6 mt-8">
      
      {/* Page Title */}
      <h1 className="text-3xl font-bold text-white mb-8">
        Creator Dashboard
      </h1>

      {/* Main Card */}
      <div className="bg-gray-900 rounded-xl shadow-lg border border-gray-800 overflow-hidden">

        {/* Cover */}
          {channelProfile.coverImage ? (
            <img
              src={channelProfile.coverImage}
              alt="coverImage"
              className="h-40 bg-gradient-to-r from-blue-600 to-purple-600 object-cover w-full"
            />
          ) : (
            <div className="w-28 h-28 rounded-full bg-gray-700 flex items-center justify-center border-4 border-gray-900">
              <FaUser className="text-white text-3xl" />
            </div>
          )}

        {/* Profile Section */}
        <div className="p-6 -mt-16 flex flex-col items-center text-center">

          {/* Avatar */}
          {channelProfile.avatar ? (
            <img
              src={channelProfile.avatar}
              alt="avatar"
              className="w-28 h-28 rounded-full object-cover border-4 border-gray-900 shadow-md"
            />
          ) : (
            <div className="w-28 h-28 rounded-full bg-gray-700 flex items-center justify-center border-4 border-gray-900">
              <FaUser className="text-white text-3xl" />
            </div>
          )}

          {/* Name */}
          <h2 className="text-xl font-semibold text-white mt-4">
            {channelProfile.fullName || "Loading..."}
          </h2>

          {/* Username */}
          <p className="text-gray-400">
            {channelProfile.username ? `@${channelProfile.username}` : ""}
          </p>

          {/* Channel Button */}
          <button
            onClick={handleChannelClick}
            className="mt-4 px-5 py-2 bg-blue-600 hover:bg-blue-700 transition rounded-full text-white font-medium shadow"
          >
            View Channel
          </button>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-3 gap-6 p-6 border-t border-gray-800">

          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <FaUsers className="mx-auto text-blue-400 text-xl mb-2" />
            <p className="text-gray-400 text-sm">Subscribers</p>
            <p className="text-lg font-semibold text-white">
              {channelProfile.subscriberCount || 0}
            </p>
          </div>

          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <FaUsers className="mx-auto text-purple-400 text-xl mb-2" />
            <p className="text-gray-400 text-sm">Subscribed To</p>
            <p className="text-lg font-semibold text-white">
              {channelProfile.channelsSubscribedToCount || 0}
            </p>
          </div>

          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <FaEnvelope className="mx-auto text-green-400 text-xl mb-2" />
            <p className="text-gray-400 text-sm">Email</p>
            <p className="text-sm text-white break-all">
              {channelProfile.email || "Loading..."}
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}

export default MyContent;