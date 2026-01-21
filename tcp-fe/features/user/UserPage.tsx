"use client";

import { ListingCard } from "../listings/list/components/ListingCard";
import { useQuery } from "@tanstack/react-query";
import { fetchUserInfo } from "@/lib/api/user/query";
import { ItemTags } from "../listings/list/components/ItemTags";

export function UserPage() {
  const { data } = useQuery({
    queryKey: ["listings"],
    queryFn: () => fetchUserInfo(1),
    staleTime: Infinity,
  });


  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="space-y-4">
        <h2 className="text-lg font-bold mb-4">내 판매글</h2>
        {
          data &&
          <div className="grid grid-cols-1 gap-4 h-[240px] overflow-y-auto py-2">
            {data.listings.map((listing) => {
              return <ListingCard key={listing.id} listing={listing} />
            })}
          </div>

        }
      </div>
      <div>
        <h2 className="text-lg font-bold mb-4">구독중인 물품</h2>
        <p className="text-sm text-gray-500 mb-4"> 구독중인 물품을 판매하는 게시물이 올라오면 알림을 받을 수 있습니다.</p>
        {
          data &&
          <ItemTags items={data.subscribedItems} />
        }

      </div>
    </div>
  );
}
