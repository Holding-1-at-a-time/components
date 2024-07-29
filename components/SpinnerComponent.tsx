"use client";

export default function Spinner() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-800">
      <div className="relative spinner-3d">
        <div className="absolute inset-0 spinner-layer layer-1"></div>
        <div className="absolute inset-0 spinner-layer layer-2"></div>
        <div className="absolute inset-0 spinner-layer layer-3"></div>
      </div>
    </div>
  );
}

export function Spinner();