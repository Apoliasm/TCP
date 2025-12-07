"use server";
import ListingDetailPage from "@/features/listings/detail/listingDetailPage";

type Props = { params: { id: string } };
// app/listings/[id]/page.tsx
export default function ListingPostPageRoute({ params }: Props) {
  return <ListingDetailPage id={Number(params.id)} />;
}
