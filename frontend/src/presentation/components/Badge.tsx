import React from "react";

export type BadgeColor = "gray" | "indigo" | "green" | "yellow";

const colorClasses: Record<BadgeColor, string> = {
  gray: "bg-gray-100 text-gray-800",
  indigo: "bg-indigo-100 text-indigo-800",
  green: "bg-green-100 text-green-800",
  yellow: "bg-yellow-100 text-yellow-800",
};

interface BadgeProps {
  color?: BadgeColor;
  children: React.ReactNode;
  className?: string;
}

export default function Badge({
  color = "gray",
  children,
  className = "",
}: BadgeProps) {
  return (
    <span
      className={`ml-2 px-2 py-0.5 rounded text-xs font-semibold align-middle ${colorClasses[color]} ${className}`}
    >
      {children}
    </span>
  );
}
