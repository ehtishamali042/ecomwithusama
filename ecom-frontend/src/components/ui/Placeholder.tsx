import React from "react";

interface PlaceholderProps {
  text?: string;
  icon?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}

export function Placeholder({
  text = "No records found.",
  icon,
  className = "",
  children,
}: PlaceholderProps) {
  return (
    <div
      className={`flex flex-col items-start justify-start py-2 text-left text-gray-500 text-sm font-normal ${className}`}
      style={{ minHeight: 32, marginLeft: 0 }}
    >
      {icon && <div className="mb-1 text-xl">{icon}</div>}
      <div className="mb-0.5">{text}</div>
      {children}
    </div>
  );
}
