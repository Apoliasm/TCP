import NotificationsPage from "@/features/notification/NotificationsPage";
import { FeaturePageLayout } from "@/shared/ui/FeaturePageLayout";

export default function NotificationRoutePage() {
  return (
    <FeaturePageLayout title="알림 목록">
      <NotificationsPage />
    </FeaturePageLayout>
  );
}
