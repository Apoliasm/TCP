import ListingDetailPage from "@/features/listings/detail/listingDetailPage";
import { FeaturePageLayout } from "@/shared/ui/FeaturePageLayout";

type Props = { params: Promise<{ id: string }> };
// app/listings/[id]/page.tsx
export default async function ListingPostPageRoute({ params }: Props) {
  const { id } = await params;
  return (
    <FeaturePageLayout title={`게시물 상세보기`}>
      <ListingDetailPage id={Number(id)} />
    </FeaturePageLayout>
  );
}
