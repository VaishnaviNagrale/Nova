import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  FaHome,
  FaHistory,
  FaVideo,
  FaFolder,
  FaPersonBooth,
  FaQuestionCircle,
  FaCogs,
  FaBars,
  FaTimes,
} from 'react-icons/fa';

const navItems = [
  { path: '/home', icon: FaHome, label: 'Home' },
  { path: '/history', icon: FaHistory, label: 'History' },
  { path: '/my-content', icon: FaVideo, label: 'My Content' },
  { path: '/collections', icon: FaFolder, label: 'Playlists' },
  { path: '/subscribers', icon: FaPersonBooth, label: 'Subscriptions' },
  { path: '/support', icon: FaQuestionCircle, label: 'Support' },
  { path: '/settings', icon: FaCogs, label: 'Settings' },
];

function Aside() {
  const navigate = useNavigate();
  const authStatus = useSelector((state) => state.auth.authStatus);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNavigation = (path) => {
    navigate(path);
    setMobileOpen(false); // close drawer on mobile after click
  };

  return (
    <>
      {/* Sidebar for Desktop/Tablet */}
      <aside
        className={`z-40 sm:block h-screen bg-[#121212] text-white border-r border-gray-700 transition-all duration-300
        ${isCollapsed ? 'w-[70px]' : 'w-[250px]'}`}
      >
        {/* Toggle button */}
        <div className="flex justify-start px-5 py-6">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-white hover:text-[#ae7aff]"
          >
            <FaBars size={24} className="cursor-pointer" />
          </button>
        </div>

        {/* Navigation */}
        <ul className="flex flex-col gap-2 px-2">
          {navItems.map(({ path, icon: Icon, label, authRequired }) => {
            if (authRequired && !authStatus) return null;
            return (
              <li key={path}>
                <button
                  onClick={() => handleNavigation(path)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-[#ae7aff] hover:text-black
                  transition text-sm ${isCollapsed ? 'flex-col justify-center gap-1' : 'flex-row justify-start'}`}
                >
                  <Icon size={20} />
                  <span className={`${isCollapsed ? 'text-[10px]' : 'inline'}`}>
                    {label}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </aside>

      {/* Mobile Menu Button */}
      <div className="sm:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setMobileOpen(true)}
          className="bg-[#121212] p-2 rounded-full text-white shadow"
        >
          <FaBars />
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="sm:hidden fixed inset-0 z-40 bg-black bg-opacity-60">
          <div className="absolute left-0 top-0 h-full w-[250px] bg-[#121212] text-white shadow-lg">
            <div className="flex justify-between items-center p-4">
              <span className="text-lg font-semibold">Menu</span>
              <button onClick={() => setMobileOpen(false)} className="text-white">
                <FaTimes size={20} />
              </button>
            </div>
            <ul className="flex flex-col gap-2 px-2">
              {navItems.map(({ path, icon: Icon, label, authRequired }) => {
                if (authRequired && !authStatus) return null;
                return (
                  <li key={path}>
                    <button
                      onClick={() => handleNavigation(path)}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-[#ae7aff] hover:text-black transition text-sm"
                    >
                      <Icon size={20} />
                      <span>{label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}

export default Aside;