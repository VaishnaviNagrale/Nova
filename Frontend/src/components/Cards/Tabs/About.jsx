import React from 'react';

function About({ channelDetails }) {
  return (
    <div className="text-white">
      <p className="text-gray-400 mb-2"><strong>Email:</strong> {channelDetails.email}</p>
      <p className="text-gray-400 mb-2"><strong>Joined:</strong> {new Date(channelDetails.createdAt).toLocaleDateString()}</p>
      <p className="text-gray-400">{channelDetails.bio || 'No bio available.'}</p>
    </div>
  );
}

export default About;
