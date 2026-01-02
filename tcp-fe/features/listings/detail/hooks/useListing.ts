// hooks/useListing.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchListingById } from "@/lib/api/listings/queries";
import { ListingDetailResponse } from "../types/types";

export function useListing(id: number) {
  return useQuery<ListingDetailResponse>({
    queryKey: ["listing", id], // id별로 캐시 분리
    queryFn: () => fetchListingById(id),
    enabled: !!id, // id가 있을 때만 요청
  });
}
