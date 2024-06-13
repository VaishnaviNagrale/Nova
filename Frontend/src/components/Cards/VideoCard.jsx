import React, { useEffect, useRef, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const VideoCard = ({_id,videoFile, thumbnail, title, description, views, createdAt, owner }) => {
  const videoRef = useRef(null);
  const navigate = useNavigate();
  // console.log(owner?.avatar);

  const formatDateDifference = useMemo(() => {
    return (dateString) => {
      const now = new Date();
      const uploadedDate = new Date(dateString);
      const diffInSeconds = Math.floor((now - uploadedDate) / 1000);
      const years = Math.floor(diffInSeconds / 31536000);
      if (years > 0) {
        return `${years} year${years > 1 ? 's' : ''} ago`;
      }
      const months = Math.floor(diffInSeconds / 2592000);
      if (months > 0) {
        return `${months} month${months > 1 ? 's' : ''} ago`;
      }
      const weeks = Math.floor(diffInSeconds / 604800);
      if (weeks > 0) {
        return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
      }
      const days = Math.floor(diffInSeconds / 86400);
      if (days > 0) {
        return `${days} day${days > 1 ? 's' : ''} ago`;
      }
      const hours = Math.floor(diffInSeconds / 3600);
      if (hours > 0) {
        return `${hours} hour${hours > 1 ? 's' : ''} ago`;
      }
      const minutes = Math.floor(diffInSeconds / 60);
      if (minutes > 0) {
        return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
      }
      return 'Just now';
    };
  }, []);

  const handleVideoPlay = useCallback(() => {
    const videos = document.querySelectorAll('video');
    videos.forEach((video) => {
      if (video !== videoRef.current) {
        video.pause();
      }
    });
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    video.addEventListener('play', handleVideoPlay);
    return () => {
      video.removeEventListener('play', handleVideoPlay);
    };
  }, [handleVideoPlay]);

  const formattedDate = formatDateDifference(createdAt);

  const handleVideoClick = () => {
    navigate(`/video/${_id}`);
  };

  return (
    <div className="container grid w-11/12 rounded-lg" onClick={handleVideoClick}>
      <div className="text-white max-w-full w-full">
        <video
          ref={videoRef}
          poster={thumbnail || 'default_thumbnail.jpg'}
          src={videoFile || 'default_video.mp4'}
          controls
          className="w-full aspect-video object-cover rounded-2xl"
          onClick={(e) => e.stopPropagation()}
          muted={false}
        >
          <track kind="captions" />
          Your browser does not support the video tag.
        </video>
      </div>
      <div className="grid p-2 grid-cols-[auto,1fr]">
        <div className="w-fit p-1.5 h-fit">
          <img
            loading="lazy"
            src={owner?.avatar || 'default_avatar.png'}
            alt="Avatar"
            className="w-10 h-10 object-cover rounded-full max-md:w-8 max-md:h-8"
          />
        </div>
        <div className="flex flex-col justify-end">
          <div className="flex-1 text-ellipsis overflow-hidden font-semibold">{title || 'Untitled'}</div>
          <div className="text-gray-500">{owner?.username || 'Unknown'}</div>
          <div className="flex items-center gap-1 text-gray-500">
            <div>{views} views</div>
            <div>•</div>
            <div>{formattedDate}</div>
          </div>
          {/* <p className="text-gray-500">{description || 'No description'}</p> */}
        </div>
      </div>
    </div>
  );
};

export default VideoCard;