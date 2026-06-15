"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Save, Shield, User as UserIcon } from "lucide-react";

export default function SettingsPage() {
  const { user } = useUser();
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSiteSettings = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    
    // TODO: Implement site settings saving
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setMessage({ type: 'success', text: 'Settings saved successfully!' });
    setSaving(false);
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold text-white">Settings</h1>
        <p className="mt-1 text-matte-400">Manage your platform settings</p>
      </div>

      {/* Account Info */}
      <section className="rounded-lg border border-matte-800 bg-matte-900 p-6">
        <div className="flex items-center gap-3 border-b border-matte-800 pb-4">
          <UserIcon size={20} className="text-matte-400" />
          <h2 className="font-display text-xl font-semibold text-white">Account Information</h2>
        </div>
        <div className="mt-4 space-y-3">
          <div>
            <label className="text-sm text-matte-400">Email</label>
            <p className="text-white">{user?.primaryEmailAddress?.emailAddress || 'Not set'}</p>
          </div>
          <div>
            <label className="text-sm text-matte-400">User ID</label>
            <p className="text-xs text-matte-500 font-mono">{user?.id || 'Not set'}</p>
          </div>
        </div>
      </section>

      {/* Site Settings Form */}
      <section className="rounded-lg border border-matte-800 bg-matte-900 p-6">
        <div className="flex items-center gap-3 border-b border-matte-800 pb-4">
          <Shield size={20} className="text-matte-400" />
          <h2 className="font-display text-xl font-semibold text-white">Site Settings</h2>
        </div>
        
        <form onSubmit={handleSiteSettings} className="mt-4 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-matte-300">Site Name</label>
            <input
              type="text"
              defaultValue="Haapu TV"
              className="w-full rounded-lg border border-matte-800 bg-matte-950 px-4 py-2 text-white focus:border-crimson-DEFAULT focus:outline-none"
            />
          </div>
          
          <div>
            <label className="mb-1 block text-sm font-medium text-matte-300">Contact Email</label>
            <input
              type="email"
              defaultValue="info@haapu.tv"
              className="w-full rounded-lg border border-matte-800 bg-matte-950 px-4 py-2 text-white focus:border-crimson-DEFAULT focus:outline-none"
            />
          </div>
          
          {message && (
            <div className={`rounded-lg p-3 text-sm ${
              message.type === 'success' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
            }`}>
              {message.text}
            </div>
          )}
          
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-crimson-DEFAULT px-4 py-2 text-white transition-colors hover:bg-crimson-dark disabled:opacity-50"
          >
            <Save size={16} />
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </form>
      </section>
    </div>
  );
}