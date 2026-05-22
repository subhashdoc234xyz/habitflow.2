import { useState } from 'react';
import { User, Bell, Shield, Download, LogOut, Moon, Sun } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import useAuthStore from '../store/authStore';
import useHabitStore from '../store/habitStore';
import useTodoStore from '../store/todoStore';
import useGoalStore from '../store/goalStore';

export default function SettingsPage() {
  const { user, profile, updateProfile, logout } = useAuthStore();
  const { habits, habitLogs } = useHabitStore();
  const { todos } = useTodoStore();
  const { goals, milestones } = useGoalStore();
  const [name, setName] = useState(profile?.name || '');
  const [saving, setSaving] = useState(false);

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      await updateProfile({ name });
      toast.success('Profile updated!');
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleExportData = () => {
    const data = {
      profile,
      habits,
      habitLogs,
      todos,
      goals,
      milestones,
      exportDate: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `habitflow-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Data exported!');
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This cannot be undone.')) {
      toast.error('Account deletion is not yet implemented in this demo.');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold font-display text-[var(--text-primary)]">Settings</h1>
        <p className="text-sm text-[var(--text-muted)]">Manage your account and preferences</p>
      </div>

      {/* Profile */}
      <Card hover={false}>
        <div className="flex items-center gap-3 mb-4">
          <User size={20} className="text-accent-light" />
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">Profile</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-accent transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Email</label>
            <input
              type="email"
              value={user?.email || ''}
              disabled
              className="w-full px-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg text-[var(--text-muted)] cursor-not-allowed"
            />
          </div>
          <Button onClick={handleSaveProfile} loading={saving} size="sm">
            Save Profile
          </Button>
        </div>
      </Card>

      {/* Data */}
      <Card hover={false}>
        <div className="flex items-center gap-3 mb-4">
          <Download size={20} className="text-accent-light" />
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">Data</h2>
        </div>
        <p className="text-sm text-[var(--text-secondary)] mb-3">Export all your data as JSON</p>
        <Button onClick={handleExportData} variant="secondary" size="sm">
          <Download size={14} /> Export Data
        </Button>
      </Card>

      {/* Account */}
      <Card hover={false}>
        <div className="flex items-center gap-3 mb-4">
          <Shield size={20} className="text-red-400" />
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">Account</h2>
        </div>
        <div className="space-y-3">
          <Button onClick={logout} variant="secondary" size="sm" className="w-full">
            <LogOut size={14} /> Sign Out
          </Button>
          <Button onClick={handleDeleteAccount} variant="danger" size="sm" className="w-full">
            Delete Account
          </Button>
        </div>
      </Card>
    </div>
  );
}
