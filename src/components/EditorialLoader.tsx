import React from 'react';
import './EditorialLoader.css';

export const EditorialLoader: React.FC = () => {
  // 7 columns x 6 rows = 42 dots
  const totalDots = 7 * 6;

  return (
    <div className="editorial-loader-container">
      <div className="editorial-loader-content">
        <div className="editorial-loader-grid">
          {Array.from({ length: totalDots }).map((_, i) => {
            // Delay is based purely on the index (0..41) 
            // spreading the wave linearly over ~2 seconds
            const delay = i * 0.05;
            return (
              <div
                key={i}
                className="editorial-loader-dot"
                style={{ animationDelay: `${delay}s` }}
              />
            );
          })}
        </div>
        <div className="editorial-loader-text">Loading</div>
      </div>
    </div>
  );
};
