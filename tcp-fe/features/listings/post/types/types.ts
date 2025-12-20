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

export type ListingItemDraft =
  | ListingItemCard
  | ListingItemAccessory
  | ListingItemOther;

export interface ListingItemCommon {
  localId: string; // 프론트용 임시 ID
  listingImageId: number;
  infoId?: number;
  detail: string; // 품목에 대한 자세한 설명
  condition: string; // 상태 설명 (ex. NM, 사용감 있음 등)
  quantity: number; // 갯수
  pricePerUnit: number; // 한 개당 가격
  name: string;
}

export interface ListingItemCard extends ListingItemCommon {
  type: ListingItemType.CARD;
  cardCode: string;
  rarity: Rarity;
}

export interface ListingItemAccessory extends ListingItemCommon {
  type: ListingItemType.ACCESSORY;
}
export interface ListingItemOther extends ListingItemCommon {
  type: ListingItemType.OTHER;
}

export type ItemSearchInfo = {
  name: string;
  type: ListingItemType;
  id: number;
  code?: string;
  rarity?: Rarity;
};

// as const를 붙임으로 RARITY의 key에 대한 강한 확신을 가짐
// N가 string이 아닌 반드시 그 value 값이 되도록
// value 값을 리터럴 값으로 만듦
//값으로부터 정확한 타입을 얻기 위해 사용하는 as const
export const RARITY = {
  N: "N",
  R: "R",
  SR: "SR",
  UR: "UR",
  UL: "UL",
  Prismatic: "Prismatic",
  UPR: "UPR",
  NPR: "NPR",
  Other: "Other",
} as const;
/**
 * typeof RARITY
→ { N: 'N'; R: 'R'; ... }

keyof typeof RARITY
→ 'N' | 'R' | 'SR' | 'UR'

typeof RARITY[keyof typeof RARITY]
→ 'N' | 'R' | 'SR' | 'UR'
 */
export type Rarity = (typeof RARITY)[keyof typeof RARITY];

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

type GroupEditAction = EditAction | "RESET";
export type GroupEditDispatch =
  | { action: "ADD"; item: ImageGroupDraft }
  | { action: "UPDATE"; item: ImageGroupDraft }
  | { action: "REMOVE"; item: ImageGroupDraft }
  | { action: "RESET" };
