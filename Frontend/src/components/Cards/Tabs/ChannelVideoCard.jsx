import React from "react";
import axios from "axios";
const SERVER_URL = import.meta.env.VITE_APP_SERVER_URL;

function ChannelVideoCard({ video , isOwner}) {
  const handleDelete = async () => {
    try {
      await axios.delete(`${SERVER_URL}/channel/videos/${video._id}`);
      alert("Video deleted successfully");
    } catch (error) {
      console.error("Error deleting video:", error);
    }
  };

  const handleTogglePublish = async () => {
    try {
      await axios.patch(`${SERVER_URL}/channel/videos/toggle/publish/${video._id}`);
      alert("Video publish status toggled");
    } catch (error) {
      console.error("Error toggling publish status:", error);
    }
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-md">
      <img src={video.thumbnail} alt={video.title} className="w-full h-40 object-cover rounded" />
      <h2 className="mt-2 font-bold text-lg">{video.title}</h2>
      <p className="text-sm text-gray-400">{video.description}</p>
      {isOwner && (
        <div className="mt-4 flex justify-between">
          <button onClick={handleTogglePublish} className="btn bg-blue-500 text-white py-1 px-2 rounded">
            {video.isPublished ? "Unpublish" : "Publish"}
          </button>
          <button onClick={handleDelete} className="btn bg-red-500 text-white py-1 px-2 rounded">
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

export default ChannelVideoCard;