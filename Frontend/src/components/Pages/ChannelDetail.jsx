import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import ChannelVideos from "../Cards/Tabs/ChannelVideos";
import About from "../Cards/Tabs/About";
import AddVideo from "../Cards/Tabs/AddVideo";

function ChannelDetail() {
  const { channelId } = useParams();
  const [channelDetails, setChannelDetails] = useState(null);
  const [channelVideos, setChannelVideos] = useState([]);
  const [channelStats, setChannelStats] = useState(null);
  const [activeTab, setActiveTab] = useState("Videos");
  const [currUser, setCurrUser] = useState(null);
  const [channelOwner, setChannelOwner] = useState(null);

  // console.log("Channel ID:", channelId);

  useEffect(() => {
    const validation = async () => {
      const response = await axios.get('/api/users/current-user');
      const { _id } = response.data.data;
      setCurrUser(_id);
    };
    const fetchChannelDetails = async () => {
      try {
        const res = await axios.get(`/api/channel/${channelId}`);
        setChannelDetails(res.data.data);
        setChannelOwner(res.data.data._id);
      } catch (error) {
        console.error("Error fetching channel details:", error);
      }
    };
    const fetchChannelStats = async () => {
      try {
        const res = await axios.get(`/api/channel/${channelId}/stats`);
        setChannelStats(res.data.data);
        // console.log("Channel stats:", res.data.data);
      } catch (error) {
        console.error("Error fetching channel stats:", error);
      }
    };
    const fetchChannelVideos = async () => {
      try {
        const res = await axios.get(`/api/channel/${channelId}/videos`);
        setChannelVideos(res.data.data);
        // console.log("Channel videos:", res.data.data);
      } catch (error) {
        console.error("Error fetching channel videos:", error);
      }
    };
    validation();
    fetchChannelDetails();
    fetchChannelStats();
    fetchChannelVideos();
  }, [channelId]);

  if (!channelDetails) {
    return <div>Loading...</div>;
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "Videos":
        return <ChannelVideos videos={channelVideos} />;
      case "About":
        return <About channelDetails={channelDetails} />;
      case "Add Video":
        return currUser === channelOwner ? <AddVideo /> : null;
        default:
          return null;
    }
  };

  return (
    <section className="w-full pb-[70px] sm:ml-[70px] sm:pb-0 lg:ml-0 bg-[#121212] text-white">
      {/* Channel details */}
      <div className="relative min-h-[150px] w-full pt-[16.28%] bg-gradient-to-r from-blue-900 to-gray-800">
        {/* Cover photo */}
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={channelDetails.coverImage}
            alt="cover-photo"
            className="w-full h-full object-cover opacity-70"
          />
        </div>
      </div>
      {/* Channel info */}
      <div className="px-4 pb-4">
        {/* Channel header */}
        <div className="flex flex-wrap gap-4 pb-4 pt-6 items-center">
          {/* Channel image */}
          <span className="relative -mt-12 inline-block h-28 w-28 shrink-0 overflow-hidden rounded-full border-4 border-gray-800 shadow-lg">
            <img
              src={channelDetails.avatar}
              alt="Channel"
              className="h-full w-full object-cover"
            />
          </span>
          {/* Channel details */}
          <div className="mr-auto inline-block">
            <h1 className="font-bold text-2xl">{channelDetails.fullName}</h1>
            <p className="text-sm text-gray-400">@{channelDetails.username}</p>
            {channelStats && (
              <div className="flex space-x-4 text-sm text-gray-400">
                <p>{channelStats.subscribers} subscribers  |</p>
                <p>{channelStats.totalViews} views  |</p>
                <p>{channelStats.totalVideos} videos</p>
              </div>
            )}
          </div>
        </div>
        {/* Navigation tabs */}
        <div className="flex gap-4 border-b border-gray-700">
          {["Videos", "About", "Add Video"].map((tab) => (
            (tab === "Add Video" && currUser === channelOwner) ? (
              <button
                key={tab}
                className={`py-2 px-4 transition-colors duration-300 ${
                  activeTab === tab
                    ? "border-b-2 border-white text-white"
                    : "text-gray-400 hover:text-white"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ) : (
              (tab !== "Add Video" && (
                <button
                  key={tab}
                  className={`py-2 px-4 transition-colors duration-300 ${
                    activeTab === tab
                      ? "border-b-2 border-white text-white"
                      : "text-gray-400 hover:text-white"
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))
            )
          ))}
        </div>
      </div>
      {/* Tab Content */}
      <div className="px-4 py-4">{renderTabContent()}</div>
    </section>
  );  
}

export default ChannelDetail;
