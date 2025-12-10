"use client";

import { useListings } from "./hooks/useListings";
export default function ListingsPage() {
  // 일단은 '전체' 상태, page=1 고정
  const { data, isLoading, error } = useListings({ page: 1, size: 20 });

  if (isLoading) return <div className="p-8">로딩 중...</div>;
  if (error) return <div className="p-8">판매글을 불러오지 못했습니다.</div>;

  return (
    <main className="p-8 space-y-4">
      {data && data.length > 0 ? (
        data.map((listing) => (
          <ListingCard key={listing.id} listing={listing} />
        ))
      ) : (
        <div>등록된 판매글이 없습니다.</div>
      )}
    </main>
  );
}

type ListingCardProps = {
  listing: import("@/lib/api/listings/types").ListingSummary;
};

function ListingCard({ listing }: ListingCardProps) {
  const created = new Date(listing.createdAt);
  const createdText = created.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  return (
    <a
      href={`/listing/${listing.id}`}
      className="flex items-center gap-4 border rounded p-3 hover:bg-gray-50 transition"
    >
      {/* 썸네일 */}
      <div className="w-20 h-20 bg-gray-100 flex items-center justify-center text-xs text-gray-400">
        {listing.mainThumbnailUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={listing.mainThumbnailUrl}
            alt={listing.title}
            className="w-full h-full object-cover rounded"
          />
        ) : (
          "이미지 없음"
        )}
      </div>

      {/* 텍스트 영역 */}
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <StatusBadge status={listing.status} />
          <h2 className="font-semibold truncate">{listing.title}</h2>
        </div>
        <div className="text-sm text-gray-500">
          아이템 {listing.totalItemCount}개 · 등록 {createdText}
        </div>
      </div>
    </a>
  );
}

function StatusBadge({ status }: { status: "ON_SALE" | "RESERVED" | "SOLD" }) {
  const label =
    status === "ON_SALE"
      ? "판매중"
      : status === "RESERVED"
      ? "예약중"
      : "판매완료";

  const style =
    status === "ON_SALE"
      ? "bg-green-100 text-green-700"
      : status === "RESERVED"
      ? "bg-yellow-100 text-yellow-700"
      : "bg-gray-200 text-gray-600";

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-xs rounded ${style}`}
    >
      {label}
    </span>
  );
}
