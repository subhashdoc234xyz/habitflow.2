import { GlassCard } from '../components/GlassCard';
import { SecondaryButton } from '../components/SecondaryButton';

interface SettingsProps {
  onLogout?: () => void;
}

export function SettingsPage({ onLogout }: SettingsProps) {
  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto pb-12">
      <div className="mb-2">
        <h1 className="heading-1 mb-1">Settings</h1>
      </div>

      <GlassCard>
        <h3 className="heading-2 mb-6">Profile</h3>
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 p-1">
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-2xl font-bold text-violet-600">
              A
            </div>
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-gray-900 text-lg">Alex Doe</h4>
            <p className="text-gray-500">alex.doe@example.com</p>
          </div>
          <SecondaryButton>Edit Profile</SecondaryButton>
        </div>
      </GlassCard>

      <GlassCard>
        <h3 className="heading-2 mb-6">Notifications</h3>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-bold text-gray-800">Daily Reminders</h4>
              <p className="text-sm text-gray-500">Get notified to complete your habits</p>
            </div>
            <div className="w-12 h-6 bg-violet-500 rounded-full relative cursor-pointer shadow-inner">
              <div className="absolute right-1 top-1 bottom-1 w-4 bg-white rounded-full shadow-sm"></div>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-bold text-gray-800">Weekly Digest</h4>
              <p className="text-sm text-gray-500">Summary of your performance</p>
            </div>
            <div className="w-12 h-6 bg-gray-300 rounded-full relative cursor-pointer shadow-inner">
              <div className="absolute left-1 top-1 bottom-1 w-4 bg-white rounded-full shadow-sm"></div>
            </div>
          </div>
        </div>
      </GlassCard>

      <GlassCard className="border-red-200">
        <h3 className="heading-2 mb-6 text-red-600">Danger Zone</h3>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-bold text-gray-800">Log Out</h4>
              <p className="text-sm text-gray-500">Sign out of your account on this device</p>
            </div>
            <SecondaryButton onClick={onLogout}>Log out</SecondaryButton>
          </div>
          <div className="flex items-center justify-between mt-4">
            <div>
              <h4 className="font-bold text-gray-800">Delete Account</h4>
              <p className="text-sm text-gray-500">Permanently delete your account and all data</p>
            </div>
            <button className="px-4 py-2 bg-red-50 text-red-600 font-bold rounded-lg border border-red-200 hover:bg-red-100 transition-colors">
              Delete Account
            </button>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
