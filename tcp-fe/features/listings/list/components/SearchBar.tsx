"use client";

import { useState } from "react";

type HomeTopSearchBarProps = {
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
  className?: string;
};

export function SearchBar({
  value,
  placeholder = "검색어를 입력하세요",
  onChange,
  className = "",
}: HomeTopSearchBarProps) {
  const isControlled = value != null;

  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
        {/* search icon */}
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5 text-slate-500 shrink-0"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M21 21l-4.3-4.3" />
          <circle cx="11" cy="11" r="7" />
        </svg>

        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") onChange(value);
          }}
          placeholder={placeholder}
          className="w-full bg-transparent text-slate-900 placeholder:text-slate-400 outline-none"
          inputMode="search"
          autoComplete="off"
        />

        {value.length > 0 && (
          <button
            type="button"
            onClick={() => onChange("")}
            aria-label="검색어 지우기"
            className="rounded-full p-1 text-slate-500 hover:bg-slate-100"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
