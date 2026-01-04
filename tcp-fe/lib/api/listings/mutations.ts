// lib/api/listings/api.ts

import { ListingStatus } from "./types";
import {
  Image,
  ImageGroupDraft,
  ListingDraft,
  ListingItem,
  ListingItemDraft,
  ListingRequest,
} from "@/features/listings/post/types/types";
import { DraftModeProvider } from "next/dist/server/async-storage/draft-mode-provider";

function mapDraftToCreateListingRequest(
  draft: ListingDraft,
  sellerId: number
): ListingRequest {
  const items: ListingItem[] = draft.groups.flatMap((group) =>
    group.items.map((itemDraft) => {
      const { localImageId, ...rest } = itemDraft;
      return { ...rest };
    })
  );
  console.log(draft.groups);
  const images: Image[] = draft.groups
    .filter((img) => img.imageId != null)
    .map((img) => ({
      id: img.imageId, // 실제 Dto에 맞게 필드명 조정
      order: img.order,
    }));

  console.log({
    title: draft.title,
    sellerId,
    status: ListingStatus.ON_SALE,
    items,
    images,
  });
  return {
    title: draft.title,
    userId: 1,
    status: ListingStatus.ON_SALE,
    memo: "",
    items,
    images,
  };
}

export async function createListingFromDraft(
  draft: ListingDraft,
  options: { sellerId: number; status?: string } // ListingStatus 써도 됨
) {
  const payload = mapDraftToCreateListingRequest(draft, options.sellerId);
  console.log(payload);
  if (options.status) {
    (payload as any).status = options.status;
  }

  const res = await fetch(`/api/listings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    let message = "게시글 등록에 실패했습니다.";
    try {
      const data = await res.json();
      if (data?.message) message = data.message;
    } catch (_) {
      // ignore
    }
    throw new Error(message);
  }

  return res.json(); // 필요하면 타입 붙여서 ListingResponseDto 등으로
}

export async function postListingImage(order: number, file: File) {
  const formData = new FormData();
  formData.append("order", String(order));
  formData.append("file", file);

  const res = await fetch(`/api/listing-images`, {
    method: "POST",
    body: formData,
    // ⚠️ Content-Type 은 직접 지정하지 않는다!
  });

  if (!res.ok) {
    throw new Error(`failed to upload listing image: ${res.status}`);
  }

  // 백엔드 응답 스펙에 맞게 타입은 한 번 정의해두면 좋음
  const data: { id: number; url?: string; order?: number } = await res.json();
  return data;
}
