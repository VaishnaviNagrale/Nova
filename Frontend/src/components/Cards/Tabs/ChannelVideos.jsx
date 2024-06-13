import React from 'react';
import VideoCard from '../VideoCard';

function ChannelVideos({ videos }) {

  return (
    <section className="mt-5">
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
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

export default ChannelVideos;
