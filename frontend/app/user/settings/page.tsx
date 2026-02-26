"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type SettingsState = {
  emailNotifications: boolean;
  bookingReminders: boolean;
  marketingUpdates: boolean;
  profileVisibility: "public" | "private";
};

const defaultSettings: SettingsState = {
  emailNotifications: true,
  bookingReminders: true,
  marketingUpdates: false,
  profileVisibility: "public",
};

export default function UserSettingsPage() {
  const [settings, setSettings] = useState<SettingsState>(defaultSettings);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("tutorix_user_settings");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSettings({ ...defaultSettings, ...parsed });
      } catch {
        setSettings(defaultSettings);
      }
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem("tutorix_user_settings", JSON.stringify(settings));
    setMessage("Settings saved successfully.");
    setTimeout(() => setMessage(""), 2000);
  };

  return (
    <div className="space-y-6 py-6">
      <div>
        <h1 className="text-3xl font-bold text-blue-600">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your account preferences and app behavior.</p>
      </div>

      {message && (
        <div className="rounded-md bg-green-100 px-4 py-3 text-sm text-green-700">{message}</div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Account</h2>
          <div className="space-y-3 text-sm">
            <Link href="/user/profile" className="block rounded-md border border-gray-200 px-4 py-2 hover:bg-gray-50">
              Edit Profile
            </Link>
            <Link href="/user/bookings" className="block rounded-md border border-gray-200 px-4 py-2 hover:bg-gray-50">
              View My Bookings
            </Link>
            <Link href="/user/saved" className="block rounded-md border border-gray-200 px-4 py-2 hover:bg-gray-50">
              Manage Saved Tutors
            </Link>
          </div>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Notifications</h2>
          <div className="space-y-4 text-sm">
            <label className="flex items-center justify-between">
              <span>Email Notifications</span>
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={(e) => setSettings((prev) => ({ ...prev, emailNotifications: e.target.checked }))}
              />
            </label>
            <label className="flex items-center justify-between">
              <span>Booking Reminders</span>
              <input
                type="checkbox"
                checked={settings.bookingReminders}
                onChange={(e) => setSettings((prev) => ({ ...prev, bookingReminders: e.target.checked }))}
              />
            </label>
            <label className="flex items-center justify-between">
              <span>Marketing Updates</span>
              <input
                type="checkbox"
                checked={settings.marketingUpdates}
                onChange={(e) => setSettings((prev) => ({ ...prev, marketingUpdates: e.target.checked }))}
              />
            </label>
          </div>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm lg:col-span-2">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Privacy</h2>
          <div className="space-y-2 text-sm">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="profileVisibility"
                value="public"
                checked={settings.profileVisibility === "public"}
                onChange={() => setSettings((prev) => ({ ...prev, profileVisibility: "public" }))}
              />
              Public profile visibility
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="profileVisibility"
                value="private"
                checked={settings.profileVisibility === "private"}
                onChange={() => setSettings((prev) => ({ ...prev, profileVisibility: "private" }))}
              />
              Private profile visibility
            </label>
          </div>
        </section>
      </div>

      <button
        onClick={handleSave}
        className="rounded-md bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700"
      >
        Save Settings
      </button>
    </div>
  );
}
