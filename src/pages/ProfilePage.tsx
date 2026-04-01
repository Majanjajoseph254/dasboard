import React, { useState, useEffect } from 'react';
import { User, Save } from 'lucide-react';
import { getProfile, saveProfile } from '../services/profile';
import type { Session, Profile } from '../types';
import Input from '../components/Input';
import Textarea from '../components/Textarea';
import Button from '../components/Button';
import Toast from '../components/Toast';

interface ProfilePageProps {
  session: Session;
}

const emptyProfile = (session: Session): Profile => ({
  userId: session.userId,
  name: session.name,
  email: session.email,
  phone: '',
  bio: '',
  role: '',
  department: '',
  avatarInitials: session.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2),
  updatedAt: '',
});

export default function ProfilePage({ session }: ProfilePageProps) {
  const [form, setForm] = useState<Profile>(() => {
    return getProfile(session.userId) ?? emptyProfile(session);
  });
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const existing = getProfile(session.userId);
    if (existing) setForm(existing);
  }, [session.userId]);

  const set = (field: keyof Profile) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setToast({ msg: 'Name is required.', type: 'error' });
      return;
    }
    setSaving(true);
    await new Promise((r) => setTimeout(r, 300));
    const updated: Profile = {
      ...form,
      avatarInitials: form.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2),
    };
    saveProfile(updated);
    setForm(updated);
    setSaving(false);
    setToast({ msg: 'Profile saved successfully!', type: 'success' });
  };

  const initials = form.avatarInitials || 'U';

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50">
          <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <User className="h-6 w-6 text-gray-500" />
          My Profile
        </h1>
        <p className="text-gray-500 text-sm mt-1">Manage your personal information.</p>
      </div>

      {/* Avatar */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-center gap-5">
        <div className="h-16 w-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
          {initials}
        </div>
        <div>
          <p className="text-base font-semibold text-gray-900">{form.name || 'Your Name'}</p>
          <p className="text-sm text-gray-500">{form.email}</p>
          {form.role && <p className="text-xs text-gray-400 mt-0.5">{form.role}</p>}
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Input
            label="Full name"
            value={form.name}
            onChange={set('name')}
            placeholder="Jane Smith"
          />
          <Input
            label="Email address"
            type="email"
            value={form.email}
            onChange={set('email')}
            placeholder="you@example.com"
          />
          <Input
            label="Phone number"
            type="tel"
            value={form.phone}
            onChange={set('phone')}
            placeholder="+1 555 000 0000"
          />
          <Input
            label="Role / Title"
            value={form.role}
            onChange={set('role')}
            placeholder="e.g. Project Manager"
          />
          <Input
            label="Department"
            value={form.department}
            onChange={set('department')}
            placeholder="e.g. Engineering"
          />
        </div>
        <Textarea
          label="Bio"
          value={form.bio}
          onChange={set('bio')}
          placeholder="Tell us a little about yourself…"
        />
        {form.updatedAt && (
          <p className="text-xs text-gray-400">
            Last updated: {new Date(form.updatedAt).toLocaleString()}
          </p>
        )}
        <div className="flex justify-end">
          <Button type="submit" loading={saving}>
            <Save className="h-4 w-4" />
            Save Profile
          </Button>
        </div>
      </form>
    </div>
  );
}
