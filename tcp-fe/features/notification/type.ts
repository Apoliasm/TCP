export type NotificationType = "SYSTEM" | "TRADE" | "PRICE" | "CHAT";
export type Notification = {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  createdAt: string; // ISO
  isRead: boolean;
  link?: string; // 알림 클릭 시 이동할 경로
};
