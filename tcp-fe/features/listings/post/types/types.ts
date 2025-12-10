// types.ts (일부)

import { ListingItemType, ListingStatus } from "@/lib/api/listings/types";

export interface ImageGroupDraft {
  localId: string;
  file: File | null;
  previewUrl: string;
  listingImageId?: number;
  order: number;
  items: ListingItemDraft[];
}

export interface ListingDraft {
  title: string;
  // 필요하면 status 등도 여기로 확장 가능
  images: ImageGroupDraft[];
}

export type ListingItemDraft = {
  localItemId: string; // 프론트용 임시 ID
  type: ListingItemType; // 'CARD' | 'ACCESSORY' | 'OTHER'
  cardName: string; // CARD일 때 카드 이름 검색용
  detail: string; // 품목에 대한 자세한 설명
  condition: string; // 상태 설명 (ex. NM, 사용감 있음 등)
  quantity: number; // 갯수
  pricePerUnit: number; // 한 개당 가격
  rarity?: Rarity;
};

export type ItemInfoDraft = {
  name: string;
  type: ListingItemType;
  code?: string;
  rarity?: Rarity;
};
export enum Rarity {
  N,
  R,
  SR,
  UR,
  UL,
  Prismatic,
  UPR,
  NPR,
  Other,
}
