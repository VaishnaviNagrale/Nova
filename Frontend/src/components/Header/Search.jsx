import React, { useState, useEffect } from 'react';
import { IoSearchOutline } from 'react-icons/io5';
import { useDispatch } from 'react-redux';
import { setSearchResults } from '../../store/searchSlice';
import useDebounce from '../utils/UseDebounce';

function Search() {
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const debouncedQuery = useDebounce(searchQuery, 200);

  const apiKey = import.meta.env.VITE_APP_YOUTUBE_API_KEY;


  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
      try {
        const res = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
            debouncedQuery
          )}&type=video&maxResults=5&key=${apiKey}`
        );
        const data = await res.json();
        setSuggestions(data.items || []);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      }
    };

    fetchSuggestions();
  }, [debouncedQuery, apiKey]);

  // Perform full search
  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      const searchRes = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
          searchQuery
        )}&type=video&maxResults=10&key=${apiKey}`
      );
      const searchData = await searchRes.json();
      const items = searchData.items || [];

      const videoIds = items.map((item) => item.id.videoId).join(',');
      const channelIds = [...new Set(items.map((item) => item.snippet.channelId))].join(',');

      // Fetch video stats
      const statsRes = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoIds}&key=${apiKey}`
      );
      const statsData = await statsRes.json();
      const statsMap = Object.fromEntries(statsData.items.map((item) => [item.id, item.statistics]));

      // Fetch channel avatars
      const channelRes = await fetch(
        `https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${channelIds}&key=${apiKey}`
      );
      const channelData = await channelRes.json();
      const channelMap = Object.fromEntries(
        channelData.items.map((channel) => [
          channel.id,
          {
            title: channel.snippet.title,
            avatar: channel.snippet.thumbnails.default.url,
          },
        ])
      );

      // Normalize and dispatch
      const normalizedResults = items.map((item) => ({
        _id: item.id.videoId,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails.medium.url,
        description: item.snippet.description,
        views: statsMap[item.id.videoId]?.viewCount || 'N/A',
        createdAt: item.snippet.publishedAt,
        isYouTube: true,
        owner: {
          username: item.snippet.channelTitle,
          avatar: channelMap[item.snippet.channelId]?.avatar || '',
        },
      }));

      dispatch(setSearchResults(normalizedResults));
      setSuggestions([]);
    } catch (error) {
      console.error('Search failed:', error);
    }

    setSearchQuery('');
  };

  const handleSuggestionClick = (title) => {
    setSearchQuery(title);
    setSuggestions([]);
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      <form
        onSubmit={handleSearchSubmit}
        className="flex w-full border border-gray-700 rounded-full bg-black shadow-lg overflow-hidden transition hover:border-blue-800 focus-within:border-blue-800"
      >
        <input
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-grow px-4 py-2 text-white bg-transparent rounded-l-full focus:outline-none"
          aria-label="Search"
        />
        <button
          type="submit"
          className="px-4 py-2 rounded-r-full bg-gray-800 hover:bg-blue-800 transition"
          aria-label="Submit search"
        >
          <IoSearchOutline className="text-white text-2xl" />
        </button>
      </form>

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <ul className="absolute z-10 mt-1 w-full max-h-60 overflow-y-auto rounded-lg bg-black border border-gray-700 text-white shadow-lg">
          {suggestions.map((item) => (
            <li
              key={item.id.videoId}
              className="px-4 py-2 hover:bg-gray-800 cursor-pointer"
              onClick={() => handleSuggestionClick(item.snippet.title)}
            >
              <div className="flex items-center">
                <img
                  src={item.snippet.thumbnails.default.url}
                  alt={item.snippet.title}
                  className="w-10 h-10 rounded mr-3"
                />
                <div>
                  <h3 className="text-sm font-semibold">{item.snippet.title}</h3>
                  <p className="text-xs text-gray-400">
                    {item.snippet.channelTitle}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Search;