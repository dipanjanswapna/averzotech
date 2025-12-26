
'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen overflow-hidden bg-background">
        <div className="flex items-center justify-center space-x-2">
            <div className="letter-a">A</div>
            <div className="letter-v">V</div>
            <div className="letter-e">E</div>
            <div className="letter-r">R</div>
            <div className="letter-z">Z</div>
            <div className="letter-o">O</div>
        </div>
    </div>
  );
}
