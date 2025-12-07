import ListingDetailPage from "@/features/listings/detail/listingDetailPage";

type Props = { params: Promise<{ id: string }> };
// app/listings/[id]/page.tsx
export default async function ListingPostPageRoute({ params }: Props) {
  const { id } = await params;
  return <ListingDetailPage id={Number(id)} />;
}
