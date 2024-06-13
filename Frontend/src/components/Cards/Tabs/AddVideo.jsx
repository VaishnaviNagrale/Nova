import React, { useState, useEffect } from "react";
import axios from "axios";
import VideoCard from "../VideoCard";
import { ColorRing } from "react-loader-spinner";

function AddVideo() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/videos/getowner");
      setVideos(response.data.data.videos || []);
    } catch (error) {
      console.error("Error fetching videos:", error);
      setVideos([]);
    } finally {
      setLoading(false);
    }
  };

  const handleVideoUpload = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("videoFile", videoFile);
    formData.append("thumbnail", thumbnail);

    try {
      await axios.post("/api/videos", formData);
      alert("Video uploaded successfully");
      setTitle("");
      setDescription("");
      setVideoFile(null);
      setThumbnail(null);
      fetchVideos();
    } catch (error) {
      console.error("Error uploading video:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleVideoUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    if (thumbnail) {
      formData.append("thumbnail", thumbnail);
    }

    try {
      await axios.patch(`/api/videos/${selectedVideo._id}`, formData);
      alert("Video updated successfully");
      setTitle("");
      setDescription("");
      setVideoFile(null);
      setThumbnail(null);
      setSelectedVideo(null);
      fetchVideos();
    } catch (error) {
      console.error("Error updating video:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleVideoDelete = async (videoId) => {
    try {
      setLoading(true);
      await axios.delete(`/api/videos/${videoId}`);
      alert("Video deleted successfully");
      fetchVideos();
    } catch (error) {
      console.error("Error deleting video:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePublish = async (videoId) => {
    try {
      setLoading(true);
      await axios.patch(`/api/videos/toggle/publish/${videoId}`);
      alert("Video publish status toggled");
      fetchVideos();
    } catch (error) {
      console.error("Error toggling publish status:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-white">
      {loading && (
        <div className='flex justify-center items-center'>
          <ColorRing/>
        </div>
      )}
      <form
        onSubmit={selectedVideo ? handleVideoUpdate : handleVideoUpload}
        className="flex flex-col gap-4"
      >
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="input bg-gray-800 border border-gray-700 p-2 rounded"
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="textarea bg-gray-800 border border-gray-700 p-2 rounded h-24"
        ></textarea>
        {!selectedVideo && (
          <>
            <h4 className="text-lg font-semibold text-white">
              Add Video File Here
            </h4>
            <input
              type="file"
              accept="video/*"
              onChange={(e) => setVideoFile(e.target.files[0])}
              className="input bg-gray-800 border border-gray-700 p-2 rounded"
            />
          </>
        )}
        <h4 className="text-lg font-semibold text-white">
          {selectedVideo ? "Update Thumbnail" : "Add Thumbnail File Here"}
        </h4>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setThumbnail(e.target.files[0])}
          className="input bg-gray-800 border border-gray-700 p-2 rounded"
        />
        <button
          type="submit"
          className="btn bg-blue-500 text-white py-2 rounded"
        >
          {selectedVideo ? "Update Video" : "Upload"}
        </button>
      </form>
      {selectedVideo && (
        <button
          onClick={() => {
            setSelectedVideo(null);
            setTitle("");
            setDescription("");
            setThumbnail(null);
          }}
          className="btn bg-gray-500 text-white py-2 rounded mt-2"
        >
          Cancel Update
        </button>
      )}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold">My Videos</h2>
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {videos.map((video) => (
            <div key={video._id} className="bg-gray-800 p-4 rounded-lg shadow-md">
              <VideoCard {...video} />
              <div className="mt-4 flex justify-between">
                <button
                  onClick={() => handleTogglePublish(video._id)}
                  className={`btn ${video.isPublished ? "bg-blue-500" : "bg-green-500"} text-white py-1 px-2 rounded`}
                >
                  {video.isPublished ? "Unpublish" : "Publish"}
                </button>
                <button
                  onClick={() => {
                    setSelectedVideo(video);
                    setTitle(video.title);
                    setDescription(video.description);
                  }}
                  className="btn bg-yellow-500 text-white py-1 px-2 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleVideoDelete(video._id)}
                  className="btn bg-red-500 text-white py-1 px-2 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AddVideo;