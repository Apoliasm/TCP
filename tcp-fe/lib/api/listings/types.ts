export enum ListingStatus {
  ON_SALE = "ON_SALE",
  RESERVED = "RESERVED",
  SOLD = "SOLD",
}

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

/**
 * 상세 조회에서 내려오는 "아이템 한 개" 타입
 * (백엔드 응답 예시 기준)
 */
export type ListingImageItemResponseDto = {
  id: number;
  listingId: number;
  listingImageId: number;
  infoId: number;
  detail: string;
  condition: string;
  quantity: number;
  pricePerUnit: number;
  createdAt: string;
  updatedAt: string;
};

/**
 * 상세 조회에서 내려오는 "이미지 한 장 + 그 밑의 items" 타입
 */
export type ListingImageResponseDto = {
  id?: number;
  order: number;
};

/**
 * /listings/:id 상세 조회 응답
 */
export type ListingResponseDto = {
  id: number;
  title: string;
  sellerId: number;
  status: ListingStatus;
  createdAt: string;
  updatedAt: string;
  images: ListingImageResponseDto[];
};

/**
 * --- 프론트 작성 폼용 Draft 타입 (기존 그대로 사용) ---
 */

// 사진 하나 + 그 밑에 묶인 아이템들
export enum ListingItemType {
  CARD = "CARD",
  ACCESSORY = "ACCESSORY",
  OTHER = "OTHER",
}

export interface CardInfoResponseDto {
  id: number; // ListingItem id
  listingId: number;
  listingImageId: number;
  infoId: number;

  detail: string; // 설명
  condition: string; // 상태(EX, NM 등)
  quantity: number; // 수량
  pricePerUnit: number; // 가격

  // 날짜는 받아오되, createdAt / updatedAt은 프론트에서 쓰지 않아도 됨
  createdAt?: string;
  updatedAt?: string;
}

export type CreateListingItemRequest = {
  listingImageId?: number;
  type: ListingItemType;
  // cardInfo / accessoryInfo는 나중에 붙일 예정이니 일단 생략
  detail?: string;
  condition?: string;
  quantity: number;
  pricePerUnit: number;
};

export type CreateListingRequest = {
  title: string;
  sellerId: number;
  status?: ListingStatus;
  items: CreateListingItemRequest[];
  images: ListingImageResponseDto[];
  // images 필드는 선택사항이라 지금은 생략하거나 추후 이미지 업로드 붙일 때 추가
};
