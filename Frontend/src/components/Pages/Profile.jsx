import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ColorRing } from 'react-loader-spinner';
const SERVER_URL = import.meta.env.VITE_APP_SERVER_URL;

function Profile() {
  const [user, setUser] = useState({});
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [avatarImage, setAvatarImage] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [coverPreview, setCoverPreview] = useState('');
  const [loadingAvatar, setLoadingAvatar] = useState(false);
  const [loadingCover, setLoadingCover] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await axios.get(`${SERVER_URL}/users/current-user`);
        setUser(res.data.data);
        setFullName(res.data.data.fullName);
        setEmail(res.data.data.email);
        setAvatarImage(res.data.data.avatar);
        setCoverImage(res.data.data.coverImage);
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchCurrentUser();
  }, []);

  const handleUpdateAccount = async () => {
    try {
      const res = await axios.patch(`${SERVER_URL}/users/update-account`, { fullName, email });
      console.log(res.data.message);
    } catch (error) {
      console.error('Error updating account:', error);
    }
  };

  const handleChangePassword = async () => {
    try {
      const res = await axios.post(`${SERVER_URL}/users/change-password`, { oldPassword, newPassword });
      console.log(res.data.message);
    } catch (error) {
      console.error('Error changing password:', error);
    }
  };

  const handleAvatarImageChange = (e) => {
    const file = e.target.files[0];
    setAvatarImage(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];
    setCoverImage(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  const handleUploadAvatar = async () => {
    try {
      setLoadingAvatar(true);
      const formData = new FormData();
      formData.append('avatar', avatarImage);
      const res = await axios.patch(`${SERVER_URL}/users/avatar`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(res.data.message);
    } catch (error) {
      console.error('Error uploading avatar:', error);
      setError('Error uploading avatar');
    } finally {
      setLoadingAvatar(false);
    }
  };

  const handleUploadCoverImage = async () => {
    try {
      setLoadingCover(true);
      const formData = new FormData();
      formData.append('coverImage', coverImage);
      const res = await axios.patch(`${SERVER_URL}/users/cover-image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(res.data.message);
    } catch (error) {
      console.error('Error uploading cover image:', error);
      setError('Error uploading cover image');
    } finally {
      setLoadingCover(false);
    }
  };

  return (
    <div className="w-3/4 mx-auto p-6 bg-gray-800 rounded-lg shadow-md mt-6">
      <h2 className="text-3xl font-bold text-center text-white mb-6">User Profile</h2>
      <div className="flex flex-col md:flex-row justify-between">
        <div className="w-full md:w-1/3 mb-6 md:mb-0 md:mr-6">
          <h3 className="text-xl font-semibold text-white mb-4">Profile Picture</h3>
          <div className="relative">
            {loadingAvatar && (
              <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-75 rounded-lg">
                <ColorRing color="#FFFFFF" />
              </div>
            )}
            <img
              loading="lazy"
              src={avatarPreview || avatarImage || 'default_avatar.png'}
              alt="Avatar"
              className="w-32 h-32 shrink-0 self-stretch aspect-square rounded-full mb-4 shadow-md object-cover"
            />
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleAvatarImageChange}
            className="block w-full text-sm text-gray-300 border border-gray-600 rounded-lg cursor-pointer bg-gray-700 focus:outline-none focus:border-gray-500"
          />
          <button
            onClick={handleUploadAvatar}
            className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700"
          >
            Upload Avatar
          </button>
        </div>
        <div className="w-full md:w-2/3">
        <h3 className="text-xl font-semibold text-white mb-4">Account Details</h3>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="block w-full px-4 py-2 text-gray-300 bg-gray-700 border border-gray-600 rounded-lg focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="block w-full px-4 py-2 text-gray-300 bg-gray-700 border border-gray-600 rounded-lg focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          />
        </div>
        <button
          onClick={handleUpdateAccount}
          className="mb-6 px-4 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700"
        >
          Update Account
        </button>
  
        <h3 className="text-xl font-semibold text-white mb-4">Change Password</h3>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-1">Old Password</label>
          <input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className="block w-full px-4 py-2 text-gray-300 bg-gray-700 border border-gray-600 rounded-lg focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-1">New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="block w-full px-4 py-2 text-gray-300 bg-gray-700 border border-gray-600 rounded-lg focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          />
        </div>
        <button
          onClick={handleChangePassword}
          className="px-4 py-2 bg-yellow-600 text-white rounded-lg shadow-md hover:bg-yellow-700"
        >
          Change Password
        </button>
      </div>
      </div>
      <div className="mt-8">
        <h3 className="text-xl font-semibold text-white mb-4">Cover Image</h3>
        <div className="relative">
          {loadingCover && (
            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-75 rounded-lg">
              <ColorRing color="#FFFFFF" />
            </div>
          )}
          <img
            loading="lazy"
            src={coverPreview || coverImage || 'default_cover.png'}
            alt="Cover Image"
            className="w-full h-48 rounded-lg object-cover mb-4 shadow-md"
          />
        </div>
        <input
          type="file"
          accept="image/*"
          onChange={handleCoverImageChange}
          className="block w-full text-sm text-gray-300 border border-gray-600 rounded-lg cursor-pointer bg-gray-700 focus:outline-none focus:border-gray-500"
        />
        <button
          onClick={handleUploadCoverImage}
          className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700"
        >
          Upload Cover Image
        </button>
      </div>
    </div>
  );
}

export default Profile;
