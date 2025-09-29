"use client";

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import TopNav from '@/components/TopNav';
import TextToSpeechCard from '@/components/TextToSpeechCard';
import VoiceConversionCard from '@/components/VoiceConversionCard';
import Toast, { ToastProps } from '@/components/Toast';
import LavenderBlobs from '@/components/LavenderBlobs';

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/auth');
    }
  }, [session, status, router]);

  const addToast = (type: 'success' | 'error', message: string) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, type, message, onClose: removeToast }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

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
        
        <main className="max-w-6xl mx-auto px-4 pb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <TextToSpeechCard onToast={addToast} />
            <VoiceConversionCard onToast={addToast} />
          </div>
        </main>
      </div>

      {/* Toast notifications */}
      {toasts.map(toast => (
        <Toast key={toast.id} {...toast} />
      ))}
    </div>
  );
}