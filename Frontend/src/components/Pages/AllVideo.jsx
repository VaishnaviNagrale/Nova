import React from 'react';
import VideoCard from '../Cards/VideoCard';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { ColorRing } from 'react-loader-spinner';
import { useSelector } from 'react-redux';

function AllVideo() {

  const { videos, isSearched } = useSelector((state) => state.search);

  const fetchData = async () => {
    const res = await axios.get('/api/v1/videos');
    return res.data;
  };

  const { data: videoData, isLoading, isError } = useQuery({
    queryKey: ['videos'],
    queryFn: fetchData,
    enabled: !isSearched, // disable API fetch when using YouTube results
  });

  const apiVideos = videoData?.data?.videos || [];
  const finalVideos = isSearched ? videos : apiVideos;

  if (!isSearched && isLoading) {
    return (
      <div className="flex justify-center items-center w-full h-screen">
        <ColorRing color="#dad7cd" height={80} width={80} />
      </div>
    );
  }

  if (!isSearched && isError) {
    return (
      <div className="flex justify-center items-center w-full h-screen">
        Please sign in to see all videos
      </div>
    );
  }

  return (
    <section className="mt-5">
      <div
        className="grid gap-1 max-md:max-w-full"
        style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))' }}
      >
        {finalVideos.length > 0 ? (
          finalVideos.map((video) => (
            <div key={video._id} className="w-full">
              <VideoCard {...video} />
            </div>
          ))
        ) : (
          <p className="flex justify-center items-center w-full min-h-screen text-3xl font-medium font-sans">
            No videos found
          </p>
        )}
      </div>
    </section>
  );
}

export default AllVideo;
