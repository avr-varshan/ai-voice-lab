"use client";

import { useSession, signOut } from 'next-auth/react';
import { ArrowRightOnRectangleIcon, UserCircleIcon } from '@heroicons/react/24/outline';

export default function TopNav() {
  const { data: session } = useSession();

  return (
    <nav className="w-full p-4 mb-8">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-600 bg-clip-text text-transparent">
            Voice Lab
          </h1>
        </div>

        {/* User section */}
        {session?.user && (
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-gray-700">
              <UserCircleIcon className="h-5 w-5 text-purple-500" />
              <span className="text-sm font-medium">
                {session.user.name || session.user.email}
              </span>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: '/auth' })}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-purple-100 text-purple-700 hover:bg-purple-200 transition-colors duration-150"
            >
              <ArrowRightOnRectangleIcon className="h-4 w-4" />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}