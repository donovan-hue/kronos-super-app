import React from 'react';

function SkeletonBlock({ className = '' }) {
  return (
    <div
      className={`animate-pulse bg-white/10 rounded-lg ${className}`}
      aria-hidden="true"
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="p-4 rounded-2xl border border-white/10 bg-white/5 space-y-3">
      <div className="flex items-center gap-3">
        <SkeletonBlock className="w-10 h-10 rounded-full" />
        <div className="flex-1 space-y-2">
          <SkeletonBlock className="h-3 w-1/3" />
          <SkeletonBlock className="h-3 w-1/4" />
        </div>
      </div>
      <SkeletonBlock className="h-32 w-full" />
      <div className="flex gap-4">
        <SkeletonBlock className="h-3 w-16" />
        <SkeletonBlock className="h-3 w-16" />
      </div>
    </div>
  );
}

export function SkeletonList({ count = 4 }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export function SkeletonWalletCard() {
  return (
    <div className="p-6 rounded-3xl border border-white/10 bg-gradient-to-br from-purple-900/30 to-blue-900/20 space-y-4">
      <div className="flex justify-between">
        <SkeletonBlock className="h-4 w-20" />
        <SkeletonBlock className="h-4 w-12" />
      </div>
      <SkeletonBlock className="h-8 w-40" />
      <div className="flex gap-3">
        <SkeletonBlock className="h-10 flex-1 rounded-xl" />
        <SkeletonBlock className="h-10 flex-1 rounded-xl" />
      </div>
    </div>
  );
}

export default SkeletonBlock;
