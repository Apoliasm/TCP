"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchListings } from "@/lib/api/listings/queries";
import { FetchListingsParams } from "@/lib/api/listings/types";
export function useListings(params: FetchListingsParams = { query: "" }) {
  return useQuery({
    queryKey: ["listings", params], // 상태/페이지별로 캐시 분리
    queryFn: () => fetchListings(params),
  });
}
