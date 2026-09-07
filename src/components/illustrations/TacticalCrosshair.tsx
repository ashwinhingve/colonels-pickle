/**
 * Tactical crosshair reticle overlay for military aesthetic.
 * Centered HUD-style targeting grid with crosshairs, reticle circles, and center dot.
 */

import React from 'react';

export interface TacticalCrosshairProps {
  className?: string;
  size?: number; 
  opacity?: number; 
  color?: string; 
}

export function TacticalCrosshair({
  className = '',
  size = 300,
  opacity = 0.08,
  color = '#E4B94B',
}: TacticalCrosshairProps) {
  const center = size / 2;
  const crosshairSize = size * 0.15;
  const reticleRadius = size * 0.25;
  const innerDotRadius = size * 0.015;

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      className={`pointer-events-none ${className}`}
      style={{ opacity, width: '100%', height: '100%' }}
      aria-hidden="true"
    >
      <circle
        cx={center}
        cy={center}
        r={reticleRadius}
        fill="none"
        stroke={color}
        strokeWidth={size * 0.008}
      />

      <line
        x1={center - crosshairSize}
        y1={center}
        x2={center - size * 0.08}
        y2={center}
        stroke={color}
        strokeWidth={size * 0.006}
      />
      <line
        x1={center + size * 0.08}
        y1={center}
        x2={center + crosshairSize}
        y2={center}
        stroke={color}
        strokeWidth={size * 0.006}
      />
      <line
        x1={center}
        y1={center - crosshairSize}
        x2={center}
        y2={center - size * 0.08}
        stroke={color}
        strokeWidth={size * 0.006}
      />
      <line
        x1={center}
        y1={center + size * 0.08}
        x2={center}
        y2={center + crosshairSize}
        stroke={color}
        strokeWidth={size * 0.006}
      />

      <circle
        cx={center}
        cy={center}
        r={reticleRadius * 0.5}
        fill="none"
        stroke={color}
        strokeWidth={size * 0.006}
      />
      <circle
        cx={center}
        cy={center}
        r={reticleRadius * 0.25}
        fill="none"
        stroke={color}
        strokeWidth={size * 0.006}
      />

      {[0, 90, 180, 270].map((angle) => {
        const rad = (angle * Math.PI) / 180;
        const x = center + Math.cos(rad) * reticleRadius;
        const y = center + Math.sin(rad) * reticleRadius;
        const bracketSize = size * 0.04;
        const cosA = Math.cos(rad);
        const sinA = Math.sin(rad);

        return (
          <g key={angle}>
            <line
              x1={x - cosA * bracketSize}
              y1={y - sinA * bracketSize}
              x2={x - cosA * bracketSize + sinA * bracketSize * 0.5}
              y2={y - sinA * bracketSize + cosA * bracketSize * 0.5}
              stroke={color}
              strokeWidth={size * 0.007}
            />
            <line
              x1={x - cosA * bracketSize}
              y1={y - sinA * bracketSize}
              x2={x - cosA * bracketSize - sinA * bracketSize * 0.5}
              y2={y - sinA * bracketSize - cosA * bracketSize * 0.5}
              stroke={color}
              strokeWidth={size * 0.007}
            />
          </g>
        );
      })}

      <circle cx={center} cy={center} r={innerDotRadius} fill={color} />
    </svg>
  );
}

export default TacticalCrosshair;
