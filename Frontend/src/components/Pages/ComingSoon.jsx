import React from "react";

export default function ComingSoon() {
  return (
    <div className="flex items-center justify-center text-white">
      <div className="text-center max-w-xl">
        
        <h1 className="text-5xl font-bold mb-6">
          🚧 Coming Soon
        </h1>

        <p className="text-gray-400 text-lg mb-8">
          We're working hard to bring this feature to you.
          Stay tuned — something awesome is on the way.
        </p>

        <div className="flex justify-center gap-4">
          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 bg-white text-black rounded-lg font-medium hover:bg-gray-200 transition"
          >
            Go Back
          </button>

          <a
            href="/"
            className="px-6 py-3 border border-gray-600 rounded-lg font-medium hover:bg-gray-800 transition"
          >
            Home
          </a>
        </div>

      </div>
    </div>
  );
}