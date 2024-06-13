import React,{useEffect, useRef, useMemo, useCallback} from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { ColorRing } from 'react-loader-spinner';
import VideoCard from '../Cards/VideoCard';
import CreatePlaylistDropdown from '../utils/CreatePlaylistDropdown';

function VideoDetail() {
  const { videoId } = useParams();
  const videoRef = useRef(null);

  // Fetch video details
  const fetchDataVideoDetails = async () => {
    const res = await axios.get(`/api/videos/${videoId}`);
    return res.data;
  };
  const {
    data: videoDetailsData,
    isLoading: isLoadingVideoDetails,
    isError: isErrorVideoDetails,
    error: errorVideoDetails
  } = useQuery({
    queryKey: ['videoDetails', videoId],
    queryFn: fetchDataVideoDetails,
    enabled: !!videoId,  // only run the query if videoId is not null or undefined
  });

  // Fetch all videos
  const fetchDataAllVideos = async () => {
    const res = await axios.get('/api/videos');
    return res.data;
  };
  const {
    data: videoData,
    isLoading: isLoadingAllVideos,
    isError: isErrorAllVideos,
    error: errorAllVideos
  } = useQuery({
    queryKey: ['videos'],
    queryFn: fetchDataAllVideos,
  });

  // Fetch all comments
    const fetchDataAllComments = async () => {
    const res = await axios.get(`/api/comments/${videoId}`);
    return res.data;
    };
    const {
    data: commentData,
    isLoading: isLoadingAllComments,
    isError: isErrorAllComments,
    error: errorAllComments
    } = useQuery({
    queryKey: ['comments', videoId],
    queryFn: fetchDataAllComments,
    enabled: !!videoId,
    });

  const videos = videoData?.data?.videos || [];
  const videoDetails = videoDetailsData?.data || {};
  const comments = commentData?.data?.comments || [];
  // console.log('comments', comments);
//   console.log('videoDetails', videoDetails);

  if (isLoadingVideoDetails || isLoadingAllVideos) {
    return (
      <div className="flex justify-center items-center w-full h-screen">
        <ColorRing color="#dad7cd" height={80} width={80} />
      </div>
    );
  }
  if (isErrorVideoDetails || isErrorAllVideos) {
    const errorMessage = errorVideoDetails?.message || errorAllVideos?.message || 'An error occurred';
    return (
      <div className="flex justify-center items-center w-full h-screen">
        Error: {errorMessage}
      </div>
    );
  }
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
  const formattedDate = formatDateDifference(videoDetails.createdAt);
  // console.log(videoDetails.owner[0].owner);
  return (
    <section className="w-full pb-[70px] sm:ml-[70px] sm:pb-0">
      <div className="flex w-full flex-wrap gap-4 p-4 lg:flex-nowrap">
        <div className="col-span-12 w-full">
          <div className="relative mb-4 w-full pt-[56%]">
            <div className="absolute inset-0">
            <video
          ref={videoRef}
          poster={videoDetails.thumbnail || 'default_thumbnail.jpg'}
          src={videoDetails.videoFile || 'default_video.mp4'}
          controls
          className="w-full aspect-video object-cover rounded-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <track kind="captions" />
          Your browser does not support the video tag.
        </video>
            </div>
          </div>
          <div className="group mb-4 w-full rounded-lg border p-4 duration-200 hover:bg-white/5 focus:bg-white/5" role="button" tabIndex="0">
            <div className="flex flex-wrap gap-y-2">
              <div className="w-full md:w-1/2 lg:w-full xl:w-1/2">
                <h1 className="text-lg font-bold">{videoDetails.title}</h1>
                <p className="flex text-sm text-gray-200">
                   {formattedDate} • {videoDetails.views} views
                </p>
              </div>
              <CreatePlaylistDropdown videoId={videoId}/>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <Link to={`/channel/${videoDetails.owner[0].owner?._id}`}>
                <div className="flex items-center gap-x-4">
                  <div className="mt-2 h-12 w-12 shrink-0">
                    <img src={videoDetails.owner[0].owner?.avatar} alt={videoDetails.owner[0].owner?.fullname} className="h-full w-full rounded-full" />
                  </div>
                  <div className="block">
                    <p className="text-gray-200">{videoDetails.owner[0].owner?.username}</p>
                  </div>
                </div>
              </Link>
              <div className="block">
                <button className="group/btn mr-1 flex w-full items-center gap-x-2 bg-[#ae7aff] px-3 py-2 text-center font-bold text-black shadow-[5px_5px_0px_0px_#4f4e4e] transition-all duration-150 ease-in-out active:translate-x-[5px] active:translate-y-[5px] active:shadow-[0px_0px_0px_0px_#4f4e4e] sm:w-auto">
                  <span className="inline-block w-5">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
                    </svg>
                  </span>
                  <span className="group-focus/btn:hidden">Subscribe</span>
                  <span className="hidden group-focus/btn:block">Subscribed</span>
                </button>
              </div>
            </div>
            <hr className="my-4 border-white" />
            <div className="h-5 overflow-hidden group-focus:h-auto">
              <p className="text-sm">{videoDetails.description}</p>
            </div>
          </div>
          <button className="peer w-full rounded-lg border p-4 text-left duration-200 hover:bg-white/5 focus:bg-white/5 sm:hidden">
            <h6 className="font-semibold">{comments.totalComments} Comments...</h6>
          </button>
          <div className="fixed inset-x-0 top-full z-[60] h-[calc(100%-69px)] overflow-auto rounded-lg border bg-[#121212] p-4 duration-200 hover:top-[67px] peer-focus:top-[67px] sm:static sm:h-auto sm:max-h-[500px] lg:max-h-none">
  <div className="block">
    <h6 className="mb-4 font-semibold">{comments.totalComments} Comments</h6>
    <input type="text" className="w-full rounded-lg border bg-transparent px-2 py-1 placeholder-white" placeholder="Add a Comment" />
  </div>
  <hr className="my-4 border-white" />
  <div>
    {comments.map((comment, index) => (
      <div key={index}>
        <div className="flex gap-x-4">
          <div className="mt-2 h-11 w-11 shrink-0">
            <img src={comment.owner?.avatar} alt={comment.owner?.username} className="h-full w-full rounded-full" />
          </div>
          <div className="block">
            <p className="flex items-center text-gray-200">{comment.owner?.username} · <span className="text-sm">{comment.createdAt}</span></p>
            <p className="text-sm text-gray-200">@{comment.owner?.username}</p>
            <p className="mt-3 text-sm">{comment.content}</p>
          </div>
        </div>
        <hr className="my-4 border-white" />
      </div>
    ))}
  </div>
</div>

        </div>
        <div className="col-span-12 flex w-full shrink-0 flex-col gap-3 lg:w-[350px] xl:w-[400px]">
          {videos.length > 0 ? (
            videos.map((video) => (
              <div key={video._id} className="w-full">
                <VideoCard {...video} />
              </div>
            ))
          ) : (
            <p className="flex justify-center items-center w-full min-h-screen text-3xl font-medium font-sans">No video found</p>
          )}
        </div>
      </div>
    </section>
  );
}

export default VideoDetail;
