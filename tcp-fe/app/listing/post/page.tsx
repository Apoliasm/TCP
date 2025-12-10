import { ListingPostPage } from "@/features/listings/post/listingPostPage";
import { FeaturePageLayout } from "@/shared/ui/featurePageLayout";

export default function ListingPostPageRoute() {
  return (
    <FeaturePageLayout title="게시물 작성">
      <ListingPostPage />
    </FeaturePageLayout>
  );
}
