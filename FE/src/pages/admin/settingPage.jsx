import React, { useState } from "react";
import {
  UserOutlined,
  LockOutlined,
  BellOutlined,
  GlobalOutlined,
  PictureOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import SidebarAdmin from "../../components/sidebaradmin";

const SettingPage = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [profile, setProfile] = useState({
    name: "Admin Name",
    email: "admin@example.com",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    phone: "+1 234 567 890",
    role: "Super Admin",
  });

  const [password, setPassword] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [preferences, setPreferences] = useState({
    theme: "Light",
    language: "English",
    notifications: {
      email: true,
      push: true,
      orders: true,
      news: false,
    },
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
    <div className="flex min-h-screen bg-[#f8f9ff]">
      <SidebarAdmin />

      <div className="flex-1 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
          <p className="text-gray-500 mt-1">
            Manage your account settings and preferences
          </p>
        </div>

        {/* Settings Navigation */}
        <div className="bg-white rounded-2xl shadow-sm mb-6">
          <div className="border-b border-gray-100">
            <div className="flex space-x-8 p-4">
              {[
                { id: "profile", icon: <UserOutlined />, label: "Profile" },
                { id: "security", icon: <LockOutlined />, label: "Security" },
                {
                  id: "notifications",
                  icon: <BellOutlined />,
                  label: "Notifications",
                },
                {
                  id: "preferences",
                  icon: <GlobalOutlined />,
                  label: "Preferences",
                },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-colors
                    ${
                      activeTab === tab.id
                        ? "bg-pink-50 text-pink-500"
                        : "text-gray-500 hover:bg-gray-50"
                    }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">
            {/* Profile Settings */}
            {activeTab === "profile" && (
              <div className="space-y-6">
                <div className="flex items-center space-x-6">
                  <div className="relative">
                    <img
                      src={profile.avatar}
                      alt="Profile"
                      className="w-24 h-24 rounded-2xl object-cover"
                    />
                    <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg border border-gray-200 hover:bg-gray-50">
                      <PictureOutlined className="text-gray-500" />
                    </button>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {profile.name}
                    </h3>
                    <p className="text-gray-500">{profile.role}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={profile.name}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={profile.email}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={profile.phone}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Role
                    </label>
                    <input
                      type="text"
                      disabled
                      value={profile.role}
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Security Settings */}
            {activeTab === "security" && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-800">
                  Change Password
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Password
                    </label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={password.currentPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      name="newPassword"
                      value={password.newPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={password.confirmPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Settings */}
            {activeTab === "notifications" && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-800">
                  Notification Preferences
                </h3>
                <div className="space-y-4">
                  {Object.entries(preferences.notifications).map(
                    ([key, value]) => (
                      <div
                        key={key}
                        className="flex items-center justify-between py-3"
                      >
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 capitalize">
                            {key} Notifications
                          </h4>
                          <p className="text-sm text-gray-500">
                            Receive notifications about {key}
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={value}
                            onChange={() =>
                              setPreferences({
                                ...preferences,
                                notifications: {
                                  ...preferences.notifications,
                                  [key]: !value,
                                },
                              })
                            }
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
                        </label>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

            {/* Preferences Settings */}
            {activeTab === "preferences" && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-800">
                  System Preferences
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Theme
                    </label>
                    <select
                      name="theme"
                      value={preferences.theme}
                      onChange={handlePreferencesChange}
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                    >
                      <option>Light</option>
                      <option>Dark</option>
                      <option>System</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Language
                    </label>
                    <select
                      name="language"
                      value={preferences.language}
                      onChange={handlePreferencesChange}
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                    >
                      <option>English</option>
                      <option>Spanish</option>
                      <option>French</option>
                      <option>German</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="mt-8 flex justify-end">
              <button
                onClick={
                  activeTab === "profile"
                    ? handleProfileSave
                    : activeTab === "security"
                    ? handlePasswordSave
                    : activeTab === "notifications"
                    ? handlePreferencesSave
                    : handlePreferencesSave
                }
                className="flex items-center space-x-2 px-6 py-2 bg-pink-500 text-white rounded-xl hover:bg-pink-600 transition-colors"
              >
                <SaveOutlined />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingPage;
