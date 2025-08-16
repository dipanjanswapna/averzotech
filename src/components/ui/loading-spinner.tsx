
'use client';

import React from 'react';

export function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 overflow-hidden">
        <div className="relative w-full flex justify-center">
            <div className="animate-drive relative">
                <div className="w-24 h-12 bg-blue-500 rounded-t-lg"></div>
                <div className="w-12 h-10 bg-blue-400 absolute left-24 top-2 rounded-t-lg"></div>
                <div className="absolute top-12 left-2 flex gap-12">
                    <div className="w-8 h-8 bg-black rounded-full border-4 border-white animate-spin-wheel"></div>
                    <div className="w-8 h-8 bg-black rounded-full border-4 border-white animate-spin-wheel"></div>
                </div>
            </div>
        </div>
        <p className="text-white mt-8 text-lg font-semibold">Loading...</p>
    </div>
  );
}
