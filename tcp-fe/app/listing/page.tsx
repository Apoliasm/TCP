import ListingsPage from "@/features/listings/list/listingsPage";
import { FeaturePageLayout } from "@/shared/ui/featurePageLayout";
export default function ListingsPageRoute() {
  return (
    <FeaturePageLayout title="전체 게시물">
      <ListingsPage />
    </FeaturePageLayout>
  );
}
