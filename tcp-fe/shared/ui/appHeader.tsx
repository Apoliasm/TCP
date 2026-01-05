"use client";

import Link from "next/link";
import { ReactNode } from "react";
import UserInfoButton from "./UserInfoButton";

interface AppHeaderProps {
  title?: string;
  right?: ReactNode; // 우측 액션 버튼들(검색, 글쓰기 버튼 등)
}

export function AppHeader({
  title = "TCP",
  right = <UserInfoButton />,
}: AppHeaderProps) {
  return (
    <header className="w-full bg-white border-slate-200">
      <div className="max-w-5xl mx-auto h-14 flex items-center justify-between px-4">
        {/* Left: Logo or Title */}
        <Link href="/" className="text-xl font-semibold text-slate-900">
          {title}
        </Link>

        {/* Right actions */}
        <div className="flex items-center gap-3">{right}</div>
      </div>
    </header>
  );
}
