import { ItemSearchInfo } from "@/features/listings/post/types/types";
import { BASE_URL } from "../url";
import {
  FetchListingsParams,
  ListingResponse,
  ListingSummary,
  SearchQuery,
} from "./types";
export async function fetchListings(
  params: FetchListingsParams = {}
): Promise<ListingSummary[]> {
  const query = new URLSearchParams();

  //   if (params.status) query.set("status", params.status);
  //   if (params.page) query.set("page", String(params.page));
  //   if (params.size) query.set("size", String(params.size));

  const res = await fetch(`${BASE_URL}/listings?${query.toString()}`, {
    // 필요하면 credentials, headers 등 추가
    cache: "no-store", // React Query가 캐싱하므로 fetch는 매번 fresh로
  });

  if (!res.ok) {
    throw new Error("Failed to fetch listings");
  }
  return res.json();
} // lib/api/listings.ts

export async function fetchListingById(id: number): Promise<ListingResponse> {
  const res = await fetch(`${BASE_URL}/listings/${id}`, {
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
    `${BASE_URL}/items/info?${queryString}`
  ).then((res) => res.json());

  return res;
}
