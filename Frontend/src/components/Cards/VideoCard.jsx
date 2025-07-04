import React, { useEffect, useRef, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const VideoCard = ({
  _id,
  videoFile,
  thumbnail,
  title,
  description,
  views,
  createdAt,
  owner,
  isYouTube
}) => {
  const videoRef = useRef(null);
  const navigate = useNavigate();

  const videoLink = isYouTube
    ? `https://www.youtube.com/watch?v=${_id}`
    : `/video/${_id}`;

  const formatDateDifference = useCallback((dateString) => {
    if (!dateString) return 'Unknown date';
    const now = new Date();
    const uploadedDate = new Date(dateString);
    const diff = Math.floor((now - uploadedDate) / 1000);

    const units = [
      { label: 'year', seconds: 31536000 },
      { label: 'month', seconds: 2592000 },
      { label: 'week', seconds: 604800 },
      { label: 'day', seconds: 86400 },
      { label: 'hour', seconds: 3600 },
      { label: 'minute', seconds: 60 },
    ];

    for (const unit of units) {
      const value = Math.floor(diff / unit.seconds);
      if (value > 0) return `${value} ${unit.label}${value > 1 ? 's' : ''} ago`;
    }

    return 'Just now';
  }, []);

  const formatViewsCount = useCallback((count) => {
    const num = Number(count);
    if (isNaN(num) || num < 0) return 'N/A';
    if (num >= 1e12) return `${(num / 1e12).toFixed(1)}T`;
    if (num >= 1e9) return `${(num / 1e9).toFixed(1)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K`;
    return num.toString();
  }, []);

  const handleVideoPlay = useCallback(() => {
    const videos = document.querySelectorAll('video');
    videos.forEach((video) => {
      if (video !== videoRef.current) video.pause();
    });
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!isYouTube && video) {
      video.addEventListener('play', handleVideoPlay);
      return () => video.removeEventListener('play', handleVideoPlay);
    }
  }, [handleVideoPlay, isYouTube]);

  const handleCardClick = () => {
    isYouTube ? window.open(videoLink, '_blank') : navigate(videoLink);
  };

  return (
    <div
      className="container w-11/12 rounded-lg shadow hover:shadow-lg transition duration-200 cursor-pointer overflow-hidden"
      onClick={handleCardClick}
    >
      <div className="text-white w-full">
        {!isYouTube ? (
          <video
            ref={videoRef}
            poster={thumbnail || 'default_thumbnail.jpg'}
            src={videoFile || 'default_video.mp4'}
            controls
            muted
            className="w-full aspect-video object-cover rounded-t-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <track kind="captions" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <iframe
            title={title}
            src={`https://www.youtube.com/embed/${_id}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
            className="w-full aspect-video object-cover rounded-t-2xl"
          />


        )}
      </div>

      <div className="grid p-3 grid-cols-[auto,1fr] gap-3 bg-[#111] rounded-b-2xl">
        {/* Avatar */}
        <img
          src={owner?.avatar || 'default_avatar.png'}
          alt={owner?.username || 'User Avatar'}
          className="w-10 h-10 object-cover rounded-full"
          loading="lazy"
        />

        {/* Video Info */}
        <div className="flex flex-col justify-start overflow-hidden">
          <h3
            className="text-white font-semibold text-base truncate"
            title={title}
          >
            {title || 'Untitled'}
          </h3>

          <span
            className="text-sm text-gray-400 truncate"
            title={owner?.username}
          >
            {owner?.username || (isYouTube ? 'YouTube Creator' : 'Unknown')}
          </span>

          <span className="text-sm text-gray-500 flex gap-1">
            {formatViewsCount(views)} views
            <span>•</span>
            {formatDateDifference(createdAt)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
