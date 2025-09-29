"use client";

import { useState, useEffect } from 'react';
import { XMarkIcon, CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';

export interface ToastProps {
  id: string;
  type: 'success' | 'error';
  message: string;
  onClose: (id: string) => void;
}

export default function Toast({ id, type, message, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onClose(id), 300);
    }, 4000);

    return () => clearTimeout(timer);
  }, [id, onClose]);

  const bgColor = type === 'success' 
    ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
    : 'bg-orange-50 border-orange-200 text-orange-800';

  const Icon = type === 'success' ? CheckCircleIcon : ExclamationCircleIcon;
  const iconColor = type === 'success' ? 'text-emerald-500' : 'text-orange-500';

  return (
    <div
      className={`fixed bottom-4 right-4 max-w-sm w-full transform transition-all duration-300 z-50 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
      }`}
    >
      <div className={`rounded-lg border p-4 shadow-lg backdrop-blur-sm ${bgColor}`}>
        <div className="flex items-start">
          <Icon className={`h-5 w-5 ${iconColor} mt-0.5 mr-3 flex-shrink-0`} />
          <div className="flex-1">
            <p className="text-sm font-medium">{message}</p>
          </div>
          <button
            onClick={() => {
              setIsVisible(false);
              setTimeout(() => onClose(id), 300);
            }}
            className="ml-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}