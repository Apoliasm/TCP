export type ListingStatus = "ON_SALE" | "RESERVED" | "SOLD";

export type ListingSummary = {
  id: number;
  title: string;
  sellerId: number;
  status: ListingStatus;
  createdAt: string;
  updatedAt: string;
};

export type FetchListingsParams = {
  status?: ListingStatus;
  page?: number;
  size?: number;
};

// 일단 아이템 타입은 느슨하게 잡고, 나중에 실제 DTO에 맞게 수정하면 됨
export type ListingItemResponseDto = {
  id: number;
  // 아래는 예시 필드 (실제 DTO에 맞게 수정해줘)
  type?: "CARD" | "ACCESSORY" | "OTHER";
  price?: number | null;
  quantity?: number;
  note?: string | null;
  // cardInfo 등 추가 필드도 나중에 여기 반영
  [key: string]: unknown;
};

export type ResponseListingDto = {
  id: number;
  title: string;
  sellerId: number;
  status: ListingStatus;
  createdAt: string; // Date → string
  updatedAt: string;
  items: ListingItemResponseDto[];
};

// 사진 하나 + 그 밑에 묶인 아이템들
export type ItemType = "CARD" | "ACCESSORY" | "OTHER";

export interface CardItemDraft {
  // 아직 CardInfo 검색 안 쓴다고 치고, 나중에 확장
  type: ItemType; // 일단은 'CARD' 고정으로 써도 됨
  name: string; // 카드 이름(후에 cardInfoId로 대체 가능)
  detail: string; // 카드 설명/각종 옵션
  condition: string; // 상태 (EX, NM 등)
  quantity: number;
  pricePerUnit: number;

  // 백엔드 연동용 (생성 후)
  listingImageId?: number; // 서버에서 받은 값
}

export interface ImageGroupDraft {
  localId: string; // 프론트에서만 쓰는 임시 ID (uuid or index)
  file: File | null; // 업로드 전 로컬 파일
  previewUrl: string; // URL.createObjectURL(file) 결과
  listingImageId?: number; // 서버에 업로드 후 받은 ID
  order: number;

  items: CardItemDraft[];
}

export interface ListingDraft {
  title: string;
  images: ImageGroupDraft[];
}
