import { StatusBadge } from "@/shared/ui/StatusBadge";
import { ItemTags } from "./ItemTags";
import Link from "next/link";

type ListingCardProps = {
  listing: import("@/lib/api/listings/types").ListingSummary;
};
export function ListingCard({ listing }: ListingCardProps) {
  const created = new Date(listing.createdAt);
  const createdText = created.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  return (
    <Link
      href={`/listing/${listing.id}`}
      className="flex items-center gap-4 border rounded p-3 hover:bg-gray-50 transition"
    >
      {/* 썸네일 */}
      <div className="w-20 h-20 bg-gray-100 flex items-center justify-center text-xs text-gray-400">
        {listing.thumbnailURL ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`/api${listing.thumbnailURL}`}
            alt={listing.title}
            className="w-full h-full object-cover rounded"
          />
        ) : (
          "이미지 없음"
        )}
      </div>

      {/* 텍스트 영역 */}
      <div className="flex flex-col flex-1 gap-3">
        <div className="flex items-center gap-2 mb-1">
          <StatusBadge status={listing.status} />
          <h2 className="font-semibold truncate">{listing.title}</h2>
        </div>
        <div>
          <ItemTags items={listing.items}></ItemTags>
        </div>
      </div>
    </Link>
  );
}
