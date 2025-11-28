"use client";

interface OrDividerProps {
  label?: string;
}

export default function OrDivider({ label = "OR" }: OrDividerProps) {
  return (
    <div className="my-12 w-full flex items-center justify-center">
      <div className="flex items-center w-full max-w-md group cursor-default">
        <span className="flex-grow h-px bg-gradient-to-r from-transparent via-pink-300 to-transparent transition-all duration-300 group-hover:via-pink-500"></span>

        <span className="mx-4 px-4 py-1 text-sm font-semibold text-pink-600 bg-white rounded-full shadow-md border border-pink-200 transition-all duration-300 group-hover:shadow-pink-200">
          {label}
        </span>

        <span className="flex-grow h-px bg-gradient-to-r from-transparent via-pink-300 to-transparent transition-all duration-300 group-hover:via-pink-500"></span>
      </div>
    </div>
  );
}

