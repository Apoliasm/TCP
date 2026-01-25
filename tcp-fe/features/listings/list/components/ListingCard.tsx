import { StatusBadge } from "@/shared/ui/StatusBadge";
import { ItemTags } from "./ItemTags";
import Link from "next/link";

type ListingCardProps = {
  listing: import("@/lib/api/listings/types").ListingSummary;
};
export function ListingCard({ listing }: ListingCardProps) {
  const created = new Date(listing.createdAt);

  return (
    <article className="border rounded overflow-hidden hover:bg-gray-50 transition">
      <Link
        href={`/listing/${listing.id}`}
        className="flex items-center gap-4 p-3"
      >
        {/* 썸네일 */}
        <figure className="flex w-1/4 max-w-20 h-20 bg-gray-100 flex items-center justify-center text-xs text-gray-400 shrink-0 m-0">
          {listing.thumbnailURL ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={`/api${listing.thumbnailURL}`}
              alt={listing.title}
              className="w-full h-full object-cover rounded"
            />
          ) : (
            <span className="text-gray-400">이미지 없음</span>
          )}
        </figure>

        {/* 텍스트 영역 */}
        <div className="flex flex-col flex-1 gap-3 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <StatusBadge status={listing.status} />
            <h2 className="font-semibold truncate">{listing.title}</h2>
          </div>
          <div>
            <ItemTags items={listing.tags}></ItemTags>
          </div>
        </div>
      </Link>
    </article>
  );
};
