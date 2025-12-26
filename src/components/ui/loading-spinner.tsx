
'use client';

import React from 'react';

export function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen overflow-hidden bg-background">
      <div className="loader">
        <svg height={0} width={0} viewBox="0 0 64 64" className="absolute">
          <defs className="s-xJBuHA073rTt" xmlns="http://www.w3.org/2000/svg">
            <linearGradient className="s-xJBuHA073rTt" gradientUnits="userSpaceOnUse" y2={2} x2={0} y1={62} x1={0} id="b">
              <stop className="s-xJBuHA073rTt" stopColor="#191970" />
              <stop className="s-xJBuHA073rTt" stopColor="#008080" offset={1} />
            </linearGradient>
            <linearGradient className="s-xJBuHA073rTt" gradientUnits="userSpaceOnUse" y2={0} x2={0} y1={64} x1={0} id="c">
              <stop className="s-xJBuHA073rTt" stopColor="#F0F0F0" />
              <stop className="s-xJBuHA073rTt" stopColor="#191970" offset={1} />
              <animateTransform repeatCount="indefinite" keySplines=".42,0,.58,1;.42,0,.58,1;.42,0,.58,1;.42,0,.58,1;.42,0,.58,1;.42,0,.58,1;.42,0,.58,1;.42,0,.58,1" keyTimes="0; 0.125; 0.25; 0.375; 0.5; 0.625; 0.75; 0.875; 1" dur="8s" values="0 32 32;-270 32 32;-270 32 32;-540 32 32;-540 32 32;-810 32 32;-810 32 32;-1080 32 32;-1080 32 32" type="rotate" attributeName="gradientTransform" />
            </linearGradient>
            <linearGradient className="s-xJBuHA073rTt" gradientUnits="userSpaceOnUse" y2={2} x2={0} y1={62} x1={0} id="d">
              <stop className="s-xJBuHA073rTt" stopColor="#008080" />
              <stop className="s-xJBuHA073rTt" stopColor="#191970" offset={1} />
            </linearGradient>
          </defs>
        </svg>
        <div className="text-4xl font-bold font-headline tracking-widest text-center">
            <span className="dash" style={{'--i': 1} as React.CSSProperties}>A</span>
            <span className="dash" style={{'--i': 2} as React.CSSProperties}>V</span>
            <span className="dash" style={{'--i': 3} as React.CSSProperties}>E</span>
            <span className="dash" style={{'--i': 4} as React.CSSProperties}>R</span>
            <span className="dash" style={{'--i': 5} as React.CSSProperties}>Z</span>
            <span className="dash" style={{'--i': 6} as React.CSSProperties}>O</span>
        </div>
      </div>
    </div>
  );
}
