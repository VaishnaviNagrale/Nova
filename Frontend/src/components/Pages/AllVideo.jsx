import React from 'react';
import VideoCard from "../Cards/VideoCard";
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { ColorRing } from 'react-loader-spinner';

function AllVideo() {
  const fetchData = async () => {
    const res = await axios.get("/api/videos");
    return res.data;
  }

  const{data : videoData,isLoading,isError,error}=useQuery({
    queryKey:["videos"],
    queryFn:fetchData
  });

  const videos = videoData?.data?.videos || [] ;
  console.log("videos", videos);
  

  if (isLoading) {
    return <div className="flex justify-center items-center w-full h-screen"><ColorRing color="#dad7cd" height={80} width={80}/></div>;
  }

  if (isError) {
    return <div className="flex justify-center items-center w-full h-screen">Please sign In to see all videos</div>;
  }

  return (
    <section className="mt-5">
      <div className="grid gap-1  max-md:max-w-full" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))' }}>
        {videos.length > 0 ? (
          videos.map((video) => (
            <div key={video._id} className="w-full">
              <VideoCard {...video} />
            </div>
          ))
        ) : (
          <p className='flex justify-center items-center w-full min-h-screen text-3xl font-medium font-sans '>No video found</p>
        )}
      </div>
    </section>
  );
}

export default AllVideo;
