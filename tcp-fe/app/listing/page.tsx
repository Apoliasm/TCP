import ListingsPage from "@/features/listings/list/listingsPage";
import { FeaturePageLayout } from "@/shared/ui/FeaturePageLayout";
export default function ListingsPageRoute() {
  return (
    <FeaturePageLayout title="전체 게시글">
      <ListingsPage />
    </FeaturePageLayout>
  );
}
