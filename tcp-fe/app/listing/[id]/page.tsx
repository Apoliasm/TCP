"use server";

import ListingDetailPage from "@/features/listings/detail/components/listingDetailPage";
import { useParams, useRouter } from "next/navigation";

type Props = { params: { id: string } };
// app/listings/[id]/page.tsx
export default function ListingPostPageRoute({ params }: Props) {
  return <ListingDetailPage id={Number(params.id)} />;
}
