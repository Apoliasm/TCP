"use client";

import Link from "next/link";
import { ReactNode } from "react";
import UserInfoButton from "./UserInfoButton";
import { Bell } from "lucide-react";

import { useUser } from "../hooks/useUser";

interface AppHeaderProps {
  title?: string;
  alertComp?: ReactNode;
  userComp?: ReactNode; // 우측 액션 버튼들(검색, 글쓰기 버튼 등)
}

export function AppHeader({
  title = "TCP",
  alertComp = <Bell></Bell>,
}: AppHeaderProps) {
  const { data, isLoading, error } = useUser();
  if (isLoading || error || !data) {
    return <header className="w-full h-12 bg-slate-50 border-slate-300 shadow-sm" aria-hidden="true" />;
  }
  const profileImageUrl: string = data.profileImageUrl ?? "";
  const userComp = <UserInfoButton imageUrl={profileImageUrl} />;
  return (
    <header className="w-full h-12 bg-slate-50 border-slate-300 shadow-sm" role="banner">
      <nav className="w-11/12 mx-auto h-14 flex items-center justify-between px-4" aria-label="메인 네비게이션">
        {/* Left: Logo or Title */}
        <Link href="/listing" className="text-xl font-semibold text-slate-900">
          {title}
        </Link>

        {/* Right actions */}
        <div className="flex items-center justify-center gap-5" role="group" aria-label="알림 및 마이페이지">
          <Link href="/notification" className="justify-center px-1 " aria-label="알림">
            {alertComp}
          </Link>
          <Link href="/mypage" className="justify-center px-1" aria-label="마이페이지">
            {userComp}
          </Link>
        </div>
      </nav>
    </header>
  );
}
