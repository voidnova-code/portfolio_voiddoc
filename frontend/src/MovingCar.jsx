import React from 'react';
import './MovingCar.css';

export default function MovingCar() {
  return (
    <div className="moving-car-container">
      {/* Dashed road line */}
      <div className="road-line"></div>
      
      {/* The animated car */}
      <div className="moving-car">
        <svg viewBox="0 0 512 512" fill="white" width="100" height="100">
          <path d="M499.99 176h-59.87l-16.64-41.6C406.38 91.63 365.57 64 319.4 64H163.6C117.43 64 76.62 91.63 59.52 134.4L42.88 176H12.01C5.2 176 0 181.2 0 188v144c0 13.25 10.74 24 24 24h25.86c7.98 44.56 46.92 80 94.14 80s86.16-35.44 94.14-80h235.72c7.98 44.56 46.92 80 94.14 80s86.16-35.44 94.14-80H500c13.25 0 24-10.75 24-24V200c0-13.25-10.75-24-24-24zm-355.85 24c16.27-40.59 55.05-68 99.46-68h155.8c44.41 0 83.19 27.41 99.46 68h-354.72zM144 400c-26.47 0-48-21.53-48-48s21.53-48 48-48 48 21.53 48 48-21.53 48-48 48zm320 0c-26.47 0-48-21.53-48-48s21.53-48 48-48 48 21.53 48 48-21.53 48-48 48z"/>
        </svg>
      </div>
    </div>
  );
}
