"use client";

import { Home, Bell, Plus, User } from "lucide-react";
import { useRouter } from "next/navigation";

export function BottomNav() {
  const router = useRouter();
  const goListing = () => router.push("/listing");
  const goPosting = () => router.push("/listing/post");
  const goNotification = () => router.push("/notification");
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-white">
      <ul className="flex justify-around items-center h-14">
        <NavItem icon={<Home size={20} />} link={goListing} label="홈" />
        <NavItem icon={<Bell size={20} />} link={goNotification} label="알림" />
        <NavItem icon={<Plus size={20} />} link={goPosting} label="등록" />
        <NavItem
          icon={<User size={20} />}
          link={goListing}
          label="마이페이지"
        />
      </ul>
    </nav>
  );
}

function NavItem({
  icon,
  link,
  label,
}: {
  icon: React.ReactNode;
  link: () => void;
  label: string;
}) {
  return (
    <li
      className="flex flex-col items-center text-xs text-gray-600"
      onClick={link}
    >
      {icon}
      <span className="mt-1">{label}</span>
    </li>
  );
}
