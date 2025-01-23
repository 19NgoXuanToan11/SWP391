import React, { useState } from "react";
import SidebarAdmin from "../../components/sidebaradmin";

const SettingPage = () => {
  const [profile, setProfile] = useState({
    name: "Admin Name",
    email: "admin@example.com",
  });

  const [password, setPassword] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [preferences, setPreferences] = useState({
    theme: "Light",
    language: "English",
  });

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPassword({ ...password, [e.target.name]: e.target.value });
  };

  const handlePreferencesChange = (e) => {
    setPreferences({ ...preferences, [e.target.name]: e.target.value });
  };

  const handleProfileSave = () => {
    alert("Profile updated successfully!");
  };

  const handlePasswordSave = () => {
    if (password.newPassword !== password.confirmPassword) {
      alert("New password and confirmation do not match!");
      return;
    }
    alert("Password updated successfully!");
  };

  const handlePreferencesSave = () => {
    alert("Preferences saved successfully!");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <SidebarAdmin />

      <div className="p-6 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold mb-6">Admin Settings</h1>
        <div className="space-y-8">
          {/* Profile Settings */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Profile Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium">Name</label>
                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleProfileChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium">Email</label>
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleProfileChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
                />
              </div>
              <button
                onClick={handleProfileSave}
                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
              >
                Save Changes
              </button>
            </div>
          </div>

          {/* Password Settings */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Password Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium">
                  Current Password
                </label>
                <input
                  type="password"
                  name="currentPassword"
                  value={password.currentPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium">New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={password.newPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={password.confirmPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
                />
              </div>
              <button
                onClick={handlePasswordSave}
                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
              >
                Update Password
              </button>
            </div>
          </div>

          {/* Site Preferences */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Site Preferences</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium">Theme</label>
                <select
                  name="theme"
                  value={preferences.theme}
                  onChange={handlePreferencesChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
                >
                  <option>Light</option>
                  <option>Dark</option>
                  <option>System Default</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 font-medium">Language</label>
                <select
                  name="language"
                  value={preferences.language}
                  onChange={handlePreferencesChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
                >
                  <option>English</option>
                  <option>Spanish</option>
                  <option>French</option>
                </select>
              </div>
              <button
                onClick={handlePreferencesSave}
                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingPage;
