import type { AnimatedChartLogoProps } from "@type/themeTypes";
import * as React from "react";

export const AnimatedChartLogo: React.FC<AnimatedChartLogoProps> = ({
  width = 120,
  height = 40,
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 120 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* <rect x="0" y="0" width="120" height="40" rx="10" fill="#F5F7FA" /> */}
    <g>
      {/* Bar chart animated */}
      <rect x="18" y="18" width="4" height="12" rx="2" fill="#6366F1">
        <animate
          attributeName="height"
          values="12;22;12"
          dur="1.2s"
          repeatCount="indefinite"
          keyTimes="0;0.5;1"
        />
        <animate
          attributeName="y"
          values="18;8;18"
          dur="1.2s"
          repeatCount="indefinite"
          keyTimes="0;0.5;1"
        />
      </rect>
      <rect x="25" y="12" width="4" height="18" rx="2" fill="#22D3EE">
        <animate
          attributeName="height"
          values="18;10;18"
          dur="1.2s"
          repeatCount="indefinite"
          keyTimes="0;0.5;1"
        />
        <animate
          attributeName="y"
          values="12;20;12"
          dur="1.2s"
          repeatCount="indefinite"
          keyTimes="0;0.5;1"
        />
      </rect>
      <rect x="32" y="8" width="4" height="22" rx="2" fill="#10B981">
        <animate
          attributeName="height"
          values="22;14;22"
          dur="1.2s"
          repeatCount="indefinite"
          keyTimes="0;0.5;1"
        />
        <animate
          attributeName="y"
          values="8;16;8"
          dur="1.2s"
          repeatCount="indefinite"
          keyTimes="0;0.5;1"
        />
      </rect>
      <rect x="39" y="20" width="4" height="10" rx="2" fill="#F59E42">
        <animate
          attributeName="height"
          values="10;18;10"
          dur="1.2s"
          repeatCount="indefinite"
          keyTimes="0;0.5;1"
        />
        <animate
          attributeName="y"
          values="20;12;20"
          dur="1.2s"
          repeatCount="indefinite"
          keyTimes="0;0.5;1"
        />
      </rect>
      {/* Line chart animated */}
      <polyline
        points="18,28 27,20 34,14 41,25"
        fill="none"
        stroke="#6366F1"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <animate
          attributeName="points"
          values="18,28 27,20 34,14 41,25;18,24 27,18 34,20 41,18;18,28 27,20 34,14 41,25"
          dur="1.2s"
          repeatCount="indefinite"
          keyTimes="0;0.5;1"
        />
      </polyline>
      {/* Pie chart static */}
      <circle cx="60" cy="20" r="8" fill="#E0E7FF" />
      <path d="M60 20 L60 12 A8 8 0 0 1 68 20 Z" fill="#6366F1" />
      <path d="M60 20 L68 20 A8 8 0 0 1 60 28 Z" fill="#22D3EE" />
      <path d="M60 20 L60 28 A8 8 0 0 1 52 20 Z" fill="#10B981" />
      {/* Dots for simplicity */}
      <circle cx="90" cy="20" r="3.5" fill="#6366F1">
        <animate
          attributeName="cy"
          values="20;16;20"
          dur="1.2s"
          repeatCount="indefinite"
          keyTimes="0;0.5;1"
        />
      </circle>
      <circle cx="100" cy="20" r="3.5" fill="#22D3EE">
        <animate
          attributeName="cy"
          values="20;24;20"
          dur="1.2s"
          repeatCount="indefinite"
          keyTimes="0;0.5;1"
        />
      </circle>
      <circle cx="110" cy="20" r="3.5" fill="#10B981">
        <animate
          attributeName="cy"
          values="20;16;20"
          dur="1.2s"
          repeatCount="indefinite"
          keyTimes="0;0.5;1"
        />
      </circle>
    </g>
    <text
      x="60"
      y="37"
      textAnchor="middle"
      fontFamily="Segoe UI, Arial, sans-serif"
      fontSize="10"
      fill="#6366F1"
      letterSpacing="1"
    >
      DataVise
    </text>
  </svg>
);
