"use client";
import { useListings } from "./hooks/useListings";
import { useState } from "react";
import { SearchBar } from "./components/SearchBar";
import { useDebouncedValue } from "./hooks/useDebouncedValue";
import { ListingCard } from "./components/ListingCard";

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
