import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  FaHome,
  FaThumbsUp,
  FaHistory,
  FaVideo,
  FaFolder,
  FaPersonBooth,
  FaQuestionCircle,
  FaCogs,
} from 'react-icons/fa';

function Aside() {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };
  const authStatus = useSelector((state) => state.auth.authStatus);

  const navItems = [
    { path: '/home', icon: FaHome, label: 'Home' },
    { path: '/liked-videos', icon: FaThumbsUp, label: 'Liked Videos' },
    { path: '/history', icon: FaHistory, label: 'History' },
    { path: '/my-content', icon: FaVideo, label: 'My Content' },
    { path: '/collections', icon: FaFolder, label: 'Collections' },
    { path: '/subscribers', icon: FaPersonBooth, label: 'Subscribers'},
    { path: '/support', icon: FaQuestionCircle, label: 'Support' },
    { path: '/settings', icon: FaCogs, label: 'Settings' },
  ];

  return (
    <aside className="group inset-x-0 bottom-0 z-40 w-full shrink-0 border-t border-white bg-[#121212] px-2 py-2 sm:absolute sm:inset-y-0 sm:max-w-[70px] sm:border-r sm:border-t-0 sm:py-6 sm:hover:max-w-[250px] lg:sticky lg:max-w-[250px]">
      <ul className="flex justify-around gap-y-2 sm:sticky sm:top-[106px] sm:min-h-[calc(100vh-130px)] sm:flex-col">
        {navItems.map(
          ({ path, icon: Icon, label, authRequired }) =>
            (!authRequired || (authRequired && authStatus)) && (
              <li key={path} className={authRequired ? 'hidden sm:block' : ''}>
                <button
                  className="flex flex-col items-center justify-center border-white py-1 focus:text-[#ae7aff] sm:w-full sm:flex-row sm:border sm:p-1.5 sm:hover:bg-[#ae7aff] sm:hover:text-black sm:focus:border-[#ae7aff] sm:focus:bg-[#ae7aff] sm:focus:text-black sm:group-hover:justify-start sm:group-hover:px-4 lg:justify-start lg:px-4"
                  onClick={() => handleNavigation(path)}
                >
                  <span className="inline-block w-5 shrink-0 sm:group-hover:mr-4 lg:mr-4">
                    <Icon size={20} />
                  </span>
                  <span className="block sm:hidden sm:group-hover:inline lg:inline">{label}</span>
                </button>
              </li>
            )
        )}
      </ul>
    </aside>
  );
}

export default Aside;