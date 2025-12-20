// types.ts (일부)

import { ListingItemType, ListingStatus } from "@/lib/api/listings/types";

export interface ImageGroupDraft {
  localId: string;
  file: File | null;
  previewUrl: string;
  imageUrl?: string | undefined;
  listingImageId: number;
  order: number;
  items: ListingItemDraft[];
}

export interface ListingDraft {
  title: string;
  // 필요하면 status 등도 여기로 확장 가능
  groups: ImageGroupDraft[];
}

export type ListingItemDraft = {
  localId: string; // 프론트용 임시 ID
  type: ListingItemType; // 'CARD' | 'ACCESSORY' | 'OTHER'
  cardName: string; // CARD일 때 카드 이름 검색용
  listingImageId: number;
  infoId?: number;
  detail: string; // 품목에 대한 자세한 설명
  condition: string; // 상태 설명 (ex. NM, 사용감 있음 등)
  quantity: number; // 갯수
  pricePerUnit: number; // 한 개당 가격
  rarity?: Rarity;
};

export type ItemSearchInfo = {
  name: string;
  type: ListingItemType;
  id: number;
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

export type EditorStep = 1 | 2 | 3 | 4 | 5;

type EditAction = "ADD" | "UPDATE" | "REMOVE";
export type ItemEditAction = EditAction;
export interface GroupEditorState {
  itemDraft: ListingItemDraft;
  step: EditorStep;
  imageLocalId: string | null;
  editAction: ItemEditAction;
}

export interface EditorStepPropsActions {
  onChange: (partial: Partial<ListingItemDraft>) => void;
  onPrev: () => void;
  onNext: () => void;
}

export interface EditorStepPropsValue {
  itemDraft: ListingItemDraft;
  editAction: ItemEditAction;
}

type GroupEditAction = EditAction;
export type GroupEditDisPatch = {
  action: GroupEditAction;
  item: ImageGroupDraft;
};
