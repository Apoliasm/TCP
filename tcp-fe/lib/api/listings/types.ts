import {
  ImageGroup,
  ImageGroupDraft,
  Listing,
  ListingDraft,
  ListingItem,
  ListingItemDraft,
  Rarity,
} from "@/features/listings/post/types/types";

export enum ListingStatus {
  ON_SALE = "ON_SALE",
  RESERVED = "RESERVED",
  SOLD = "SOLD",
}

export type ListingSummary = {
  id: number;
  title: string;
  userId: number;
  userNickName: string;
  status: ListingStatus;
  createdAt: string;
  updatedAt: string;
  thumbnailURL: string;
  items: ItemSummary[];
};

export type ItemSummary = Pick<ListingItemResponse, "name" | "id">;
export type FetchListingsParams = {
  status?: ListingStatus;
  page?: number;
  size?: number;
};

export interface ListingResponse extends Listing {
  id: 3;
  userId: 1;
  createdAt: string;
  updatedAt: string;
  images: ImageGroupResponse[];
}

export interface ListingItemResponse extends ListingItem {
  id: number;
  listingId: number;
}
export interface ImageGroupResponse {
  id: number;
  listingId: number;
  url: string;
  order: number;
  items: ListingItemResponse[];
}
// 사진 하나 + 그 밑에 묶인 아이템들
export enum ListingItemType {
  CARD = "CARD",
  ACCESSORY = "ACCESSORY",
  OTHER = "OTHER",
}

export interface ItemSearchResponse {
  id: number;
  name: string;
}

export type SearchQuery = {
  query: string;
};
