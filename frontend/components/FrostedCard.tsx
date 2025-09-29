"use client";

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface FrostedCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export default function FrostedCard({ children, className, hover = true }: FrostedCardProps) {
  return (
    <div
      className={cn(
        "bg-white/65 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20",
        hover && "transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-xl hover:bg-white/70",
        className
      )}
    >
      {children}
    </div>
  );
}