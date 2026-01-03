// hooks/useListing.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchListingById } from "@/lib/api/listings/queries";
import { ListingResponse } from "@/lib/api/listings/types";

export function useListing(id: number) {
  return useQuery<ListingResponse>({
    queryKey: ["listing", id], // id별로 캐시 분리
    queryFn: () => fetchListingById(id),
    enabled: !!id, // id가 있을 때만 요청
  });
}
