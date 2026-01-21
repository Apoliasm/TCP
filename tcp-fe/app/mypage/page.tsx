import { UserPage } from "@/features/user/UserPage";
import { FeaturePageLayout } from "@/shared/ui/FeaturePageLayout";
export default function ListingsPageRoute() {
  return (
    <FeaturePageLayout title="마이페이지">
      <UserPage />
    </FeaturePageLayout>
  );
}
