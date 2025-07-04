import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Logout from './Logout';
import Search from './Search';

function Header() {
  const navigate = useNavigate();
  const authStatus = useSelector((state) => state.auth.status);

  return (
    <header className="w-full border-b border-gray-700 bg-black text-white px-4 py-2">
      <div className="flex items-center justify-between max-md:flex-wrap max-md:gap-2">

        {/* Logo */}
        <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/f8e9f7ed166074f1b63f89c6d1a258945ffa6a02a0a5635fe2466e73d82e2a5f?apiKey=2a71bb6c876b4ac2af76de651fbd6a28&"
            alt="Logo"
            loading="lazy"
            className="w-12 h-12 object-cover"
          />
        </div>

        {/* Search Bar */}
        <div className="flex flex-1 mx-4 max-w-xl w-full">
          <Search />
        </div>

        {/* Auth Buttons / Logout */}
        <div className="flex items-center gap-4">
          {authStatus ? (
            <Logout />
          ) : (
            <ul className="flex items-center gap-2 text-sm">
              <li>
                <button
                  onClick={() => navigate('/login')}
                  className="px-4 py-2 rounded-lg text-white hover:bg-gray-700 hover:ring-2 hover:ring-blue-800 transition"
                >
                  Login
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/signup')}
                  className="px-4 py-2 rounded-lg text-white hover:bg-gray-700 hover:ring-2 hover:ring-blue-800 transition"
                >
                  Signup
                </button>
              </li>
            </ul>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;