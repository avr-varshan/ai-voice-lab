"use client";

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import TopNav from '@/components/TopNav';
import FrostedCard from '@/components/FrostedCard';
import LavenderBlobs from '@/components/LavenderBlobs';
import { UserCircleIcon } from '@heroicons/react/24/outline';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/auth');
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
      <LavenderBlobs />
      
      <div className="relative z-10">
        <TopNav />
        
        <main className="max-w-2xl mx-auto px-4 pb-8">
          <FrostedCard>
            <div className="flex items-center space-x-4 mb-6">
              <UserCircleIcon className="h-12 w-12 text-purple-500" />
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Profile</h1>
                <p className="text-gray-600">Manage your account settings</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-800">
                    {session.user?.email}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name
                  </label>
                  <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-800">
                    {session.user?.name || 'Not set'}
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-200">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Usage Statistics</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <p className="text-sm text-purple-600 font-medium">TTS Generations</p>
                    <p className="text-2xl font-bold text-purple-800">-</p>
                    <p className="text-xs text-purple-600">This session</p>
                  </div>
                  <div className="p-4 bg-pink-50 rounded-lg">
                    <p className="text-sm text-pink-600 font-medium">Voice Conversions</p>
                    <p className="text-2xl font-bold text-pink-800">-</p>
                    <p className="text-xs text-pink-600">This session</p>
                  </div>
                </div>
              </div>
            </div>
          </FrostedCard>
        </main>
      </div>
    </div>
  );
}