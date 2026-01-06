import { ItemSearchInfo } from "@/features/listings/post/types/types";

import {
  FetchListingsParams,
  ListingResponse,
  ListingSummary,
  SearchQuery,
} from "./types";
export async function fetchListings(
  params: FetchListingsParams = { query: "" }
): Promise<ListingSummary[]> {
  const query = new URLSearchParams();

  //   if (params.status) query.set("status", params.status);
  //   if (params.page) query.set("page", String(params.page));
  //   if (params.size) query.set("size", String(params.size));
  if (params.query.length > 0) query.set("query", params.query);
  const res = await fetch(`/api/listings?${query.toString()}`, {
    // 필요하면 credentials, headers 등 추가
    cache: "no-store", // React Query가 캐싱하므로 fetch는 매번 fresh로
  });

  if (!res.ok) {
    throw new Error("Failed to fetch listings");
  }
  return res.json();
} // lib/api/listings.ts

export async function fetchListingById(id: number): Promise<ListingResponse> {
  const res = await fetch(`/api/listings/${id}`, {
    cache: "no-store", // 캐싱은 React Query가 관리
  });

  if (!res.ok) {
    throw new Error("Failed to fetch listing");
  }

  return res.json();
}

export async function searchItemByname({ query }: SearchQuery) {
  const queryString = new URLSearchParams();
  queryString.set("nameQuery", query);
  const res: ItemSearchInfo[] = await fetch(
    `/api/items/info?${queryString}`
  ).then((res) => res.json());

  return res;
}
