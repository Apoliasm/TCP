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

  if (isLoading) return <p className="p-8" role="status">로딩 중...</p>;
  if (error) return <p className="p-8" role="alert">판매글을 불러오지 못했습니다.</p>;

  const onChange = (value: string) => setQuery(value);

  const isSearching = fetchQuery.trim().length > 0;
  const totalCount = data?.length ?? 0;

  return (
    <div className="p-4 sm:px-8 space-y-4">
      <search>
        <SearchBar onChange={onChange} value={query} />
      </search>

      {/* ✅ 검색 결과 요약 */}

      <section className="space-y-4">
        {isSearching && (
          <p className="text-sm text-slate-600">
            <span className="font-medium text-slate-900">
              '{fetchQuery.trim()}'
            </span>
            에 대한 검색 결과{" "}
            <span className="font-semibold text-slate-900">{totalCount}</span>건
          </p>
        )}
        {data && data.length > 0 ? (
          <ul className="list-none p-0 m-0 space-y-4">
            {data.map((listing) => (
              <li key={listing.id}>
                <ListingCard listing={listing} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-slate-500">등록된 판매글이 없습니다.</p>
        )}
      </section>
    </div>
  );
}
