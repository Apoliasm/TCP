"use client";
import { useListings } from "./hooks/useListings";
import { ItemTags } from "./components/ItemTags";
import { StatusBadge } from "@/shared/ui/StatusBadge";
import { useEffect, useState } from "react";
import { SearchBar } from "./components/SearchBar";
import { useDebouncedValue } from "./hooks/useDebouncedValue";

type ListingCardProps = {
  listing: import("@/lib/api/listings/types").ListingSummary;
};
export default function ListingsPage() {
  const [query, setQuery] = useState("");
  const fetchQuery = useDebouncedValue(query, 1000);

  const { data, isLoading, error } = useListings({
    page: 1,
    size: 20,
    query: fetchQuery.trim(),
  });

  if (isLoading) return <div className="p-8">로딩 중...</div>;
  if (error) return <div className="p-8">판매글을 불러오지 못했습니다.</div>;

  const onChange = (value: string) => setQuery(value);

  const isSearching = fetchQuery.trim().length > 0;
  const totalCount = data?.length ?? 0;

  return (
    <main className="p-8 space-y-4">
      <SearchBar onChange={onChange} value={query} />

      {/* ✅ 검색 결과 요약 */}
      {isSearching && (
        <div className="text-sm text-slate-600">
          <span className="font-medium text-slate-900">
            '{fetchQuery.trim()}'
          </span>
          에 대한 검색 결과{" "}
          <span className="font-semibold text-slate-900">{totalCount}</span>건
        </div>
      )}

      {data && data.length > 0 ? (
        data.map((listing) => (
          <ListingCard key={listing.id} listing={listing} />
        ))
      ) : (
        <div className="text-slate-500">등록된 판매글이 없습니다.</div>
      )}
    </main>
  );
}

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
    </a>
  );
}
