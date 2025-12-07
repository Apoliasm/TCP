import {
  ListingItemResponseDto,
  FetchListingsParams,
  ListingStatus,
  ListingSummary,
  ResponseListingDto,
} from "./types";
export async function fetchListings(
  params: FetchListingsParams = {}
): Promise<ListingSummary[]> {
  const query = new URLSearchParams();

  //   if (params.status) query.set("status", params.status);
  //   if (params.page) query.set("page", String(params.page));
  //   if (params.size) query.set("size", String(params.size));

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/listings?${query.toString()}`,
    {
      // 필요하면 credentials, headers 등 추가
      cache: "no-store", // React Query가 캐싱하므로 fetch는 매번 fresh로
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch listings");
  }
  return res.json();
} // lib/api/listings.ts

export async function fetchListingById(
  id: number
): Promise<ResponseListingDto> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/listings/${id}`,
    {
      cache: "no-store", // 캐싱은 React Query가 관리
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch listing");
  }

  return res.json();
}
