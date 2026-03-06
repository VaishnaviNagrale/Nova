import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  FaHome,
  FaHistory,
  FaVideo,
  FaFolder,
  FaUserFriends,
  FaQuestionCircle,
  FaCog,
  FaBars,
  FaTimes,
} from "react-icons/fa";

const navItems = [
  { path: "/home", icon: FaHome, label: "Home" },
  { path: "/history", icon: FaHistory, label: "History" },
  { path: "/my-content", icon: FaVideo, label: "My Content" },
  { path: "/collections", icon: FaFolder, label: "Playlists" },
  { path: "/subscribers", icon: FaUserFriends, label: "Subscriptions" },
  { path: "/support", icon: FaQuestionCircle, label: "Support" },
  { path: "/settings", icon: FaCog, label: "Settings" },
];

function Aside() {
  const navigate = useNavigate();
  const location = useLocation();
  const authStatus = useSelector((state) => state.auth.authStatus);

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNavigation = (path) => {
    navigate(path);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`
        hidden sm:flex flex-col
        h-screen bg-[#121212] text-white
        border-r border-gray-800
        transition-all duration-300 ease-in-out
        ${isCollapsed ? "w-[70px]" : "w-[240px]"}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-5 border-b border-gray-800">
          {!isCollapsed && (
            <span className="text-lg font-semibold tracking-wide">
              Dashboard
            </span>
          )}

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-gray-400 hover:text-white transition"
          >
            <FaBars size={20} />
          </button>
        </div>

        {/* Navigation */}
        <ul className="flex flex-col gap-1 mt-4 px-2">
          {navItems.map(({ path, icon: Icon, label, authRequired }) => {
            if (authRequired && !authStatus) return null;

            const isActive = location.pathname === path;

            return (
              <li key={path}>
                <button
                  onClick={() => handleNavigation(path)}
                  title={isCollapsed ? label : ""}
                  className={`
                  group relative w-full flex items-center
                  px-3 py-3 rounded-lg
                  transition-all duration-200
                  
                  ${
                    isActive
                      ? "bg-[#ae7aff] text-black"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  }

                  ${
                    isCollapsed
                      ? "flex-col justify-center gap-1"
                      : "flex-row gap-4"
                  }
                  `}
                >
                  <Icon
                    size={20}
                    className="transition-transform group-hover:scale-110"
                  />

                  {!isCollapsed && (
                    <span className="text-sm font-medium">{label}</span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>

        {/* Footer */}
        {!isCollapsed && (
          <div className="mt-auto p-4 text-xs text-gray-500 border-t border-gray-800">
            © 2026 StreamHub
          </div>
        )}
      </aside>

      {/* Mobile Menu Button */}
      <div className="sm:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setMobileOpen(true)}
          className="bg-[#121212] p-3 rounded-full text-white shadow-lg border border-gray-700"
        >
          <FaBars />
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div
          className="sm:hidden fixed inset-0 z-40 bg-black/60"
          onClick={() => setMobileOpen(false)}
        >
          <div
            className="absolute left-0 top-0 h-full w-[250px] bg-[#121212] text-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="flex justify-between items-center p-4 border-b border-gray-800">
              <span className="text-lg font-semibold">Menu</span>

              <button
                onClick={() => setMobileOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <FaTimes size={20} />
              </button>
            </div>

            {/* Drawer Nav */}
            <ul className="flex flex-col gap-1 px-3 py-4">
              {navItems.map(({ path, icon: Icon, label, authRequired }) => {
                if (authRequired && !authStatus) return null;

                const isActive = location.pathname === path;

                return (
                  <li key={path}>
                    <button
                      onClick={() => handleNavigation(path)}
                      className={`
                      w-full flex items-center gap-4 px-3 py-3
                      rounded-lg transition
                      ${
                        isActive
                          ? "bg-[#ae7aff] text-black"
                          : "text-gray-300 hover:bg-gray-800 hover:text-white"
                      }
                      `}
                    >
                      <Icon size={20} />
                      <span className="text-sm font-medium">{label}</span>
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