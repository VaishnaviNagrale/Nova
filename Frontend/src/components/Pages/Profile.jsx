import React, { useState, useEffect } from "react";
import { ColorRing } from "react-loader-spinner";
import { FaUser } from "react-icons/fa";
import apiClient from "../utils/apiClient";

function Profile() {
  const [user, setUser] = useState({});
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [avatarImage, setAvatarImage] = useState(null);
  const [coverImage, setCoverImage] = useState(null);

  const [avatarPreview, setAvatarPreview] = useState("");
  const [coverPreview, setCoverPreview] = useState("");

  const [loadingAvatar, setLoadingAvatar] = useState(false);
  const [loadingCover, setLoadingCover] = useState(false);

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const inputStyle =
    "w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-gray-200 focus:outline-none focus:border-blue-500";

  const primaryBtn =
    "px-5 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium";

  const successBtn =
    "px-5 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-sm font-medium";

  const warningBtn =
    "px-5 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg text-sm font-medium";

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await apiClient.get(`/api/v1/users/current-user`);

        setUser(res.data.data);
        setFullName(res.data.data.fullName);
        setEmail(res.data.data.email);

        setAvatarImage(res.data.data.avatar);
        setCoverImage(res.data.data.coverImage);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCurrentUser();
  }, []);

  // cleanup preview urls
  useEffect(() => {
    return () => {
      if (avatarPreview) URL.revokeObjectURL(avatarPreview);
      if (coverPreview) URL.revokeObjectURL(coverPreview);
    };
  }, [avatarPreview, coverPreview]);

  const handleUpdateAccount = async () => {
    try {
      setError("");
      setSuccess("");

      await apiClient.patch(`/api/v1/users/update-account`, {
        fullName,
        email,
      });

      setSuccess("Account updated successfully");
    } catch (err) {
      setError("Failed to update account");
    }
  };

  const handleChangePassword = async () => {
    try {
      setError("");
      setSuccess("");

      await apiClient.post(`/api/v1/users/change-password`, {
        oldPassword,
        newPassword,
      });

      setSuccess("Password updated successfully");

      setOldPassword("");
      setNewPassword("");
    } catch (err) {
      setError("Failed to change password");
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
      setError("");

      const formData = new FormData();
      formData.append("avatar", avatarImage);

      await apiClient.patch(`/api/v1/users/avatar`, formData);

      setSuccess("Avatar updated successfully");
    } catch (err) {
      setError("Error uploading avatar");
    } finally {
      setLoadingAvatar(false);
    }
  };

  const handleUploadCoverImage = async () => {
    try {
      setLoadingCover(true);
      setError("");

      const formData = new FormData();
      formData.append("coverImage", coverImage);

      await apiClient.patch(`/api/v1/users/cover-image`, formData);

      setSuccess("Cover image updated successfully");
    } catch (err) {
      setError("Error uploading cover image");
    } finally {
      setLoadingCover(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">

      <h1 className="text-3xl font-bold text-white">Profile Settings</h1>

      {success && (
        <div className="bg-green-900 text-green-300 px-4 py-2 rounded-lg">
          {success}
        </div>
      )}

      {error && (
        <div className="bg-red-900 text-red-300 px-4 py-2 rounded-lg">
          {error}
        </div>
      )}

      {/* PROFILE HEADER */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">

        <div className="relative">

          <img
            src={coverPreview || coverImage || "/default_cover.png"}
            className="w-full h-56 object-cover"
            alt="cover"
          />

          {loadingCover && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60">
              <ColorRing />
            </div>
          )}

          <div className="absolute -bottom-12 left-6 flex items-center gap-4">

            <div className="w-24 h-24 rounded-full border-4 border-gray-900 overflow-hidden bg-gray-700 flex items-center justify-center">

              {avatarPreview || avatarImage ? (
                <img
                  src={avatarPreview || avatarImage}
                  className="w-full h-full object-cover"
                  alt="avatar"
                />
              ) : (
                <FaUser className="text-3xl text-gray-300" />
              )}

            </div>

            <div>
              <p className="text-xl font-semibold text-white">
                {user?.fullName}
              </p>
              <p className="text-gray-400 text-sm">{user?.email}</p>
            </div>

          </div>

        </div>

        <div className="pt-16 p-6 flex gap-4">

          <label className="cursor-pointer bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg text-sm">
            Change Avatar
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarImageChange}
            />
          </label>

          <button
            className={primaryBtn}
            onClick={handleUploadAvatar}
          >
            Upload Avatar
          </button>

          <label className="cursor-pointer bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg text-sm">
            Change Cover
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleCoverImageChange}
            />
          </label>

          <button
            className={primaryBtn}
            onClick={handleUploadCoverImage}
          >
            Upload Cover
          </button>

        </div>

      </div>

      {/* ACCOUNT INFO */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4">

        <h2 className="text-lg font-semibold text-white">
          Account Information
        </h2>

        <div>
          <label className="text-gray-400 text-sm">Full Name</label>
          <input
            className={inputStyle}
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>

        <div>
          <label className="text-gray-400 text-sm">Email</label>
          <input
            className={inputStyle}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <button
          onClick={handleUpdateAccount}
          className={successBtn}
        >
          Update Account
        </button>

      </div>

      {/* PASSWORD */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4">

        <h2 className="text-lg font-semibold text-white">
          Security
        </h2>

        <div>
          <label className="text-gray-400 text-sm">Old Password</label>
          <input
            type="password"
            className={inputStyle}
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
        </div>

        <div>
          <label className="text-gray-400 text-sm">New Password</label>
          <input
            type="password"
            className={inputStyle}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>

        <button
          onClick={handleChangePassword}
          className={warningBtn}
        >
          Change Password
        </button>

      </div>

    </div>
  );
}

export default Profile;