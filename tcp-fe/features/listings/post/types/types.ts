// types.ts (일부)

import { ListingItemType, ListingStatus } from "@/lib/api/listings/types";

export interface ImageGroupDraft extends ImageGroup {
  localImageId: string;
}

export interface Image {
  order: number;
  id: number;
}

export interface ImageGroup {
  file: File | null;
  imageId: number;
  previewUrl: string;
  items: ListingItemDraft[];
  order: number;
}

export interface Listing {
  title: string;
  memo: string | null;
  status: ListingStatus;
  userId: number;
}
export interface ListingDraft extends Listing {
  // 필요하면 status 등도 여기로 확장 가능
  groups: ImageGroupDraft[];
}

export interface ListingRequest extends Listing {
  items: ListingItem[];
  images: Image[];
}

export interface ListingItem {
  listingImageId: number | null;
  name: string;
  itemId: number | null;
  pricePerUnit: number;
  unit: number;
  detailText: string;
  quantity: number;
}
export interface ListingItemDraft extends ListingItem {
  localImageId: string | null;
}

export type ItemSearchInfo = {
  name: string;
  id: number;
};

// as const를 붙임으로 RARITY의 key에 대한 강한 확신을 가짐
// N가 string이 아닌 반드시 그 value 값이 되도록
// value 값을 리터럴 값으로 만듦
//값으로부터 정확한 타입을 얻기 위해 사용하는 as const
export const RARITY = {
  N: "노말",
  R: "레어",
  SR: "슈퍼 레어",
  UR: "울트라 레어",
  UL: "얼티메이트 레어",
  SE: "시크릿 레어",
  QCSE: "쿼센시크",
  Prismatic: "프리즈마틱",
  Other: "Other",
};
/**
 * typeof RARITY
→ { N: 'N'; R: 'R'; ... }

keyof typeof RARITY
→ 'N' | 'R' | 'SR' | 'UR'

typeof RARITY[keyof typeof RARITY]
→ 'N' | 'R' | 'SR' | 'UR'
 */

export type Rarity = keyof typeof RARITY;

export type EditorStep = 1 | 2 | 3 | 4 | 5;

type EditAction = "ADD" | "UPDATE" | "REMOVE";
export type ItemEditAction = EditAction;
export interface GroupEditorState {
  itemDraft: ListingItemDraft;
  imageLocalId: string | null;
  imageId: number | null;
  editAction: ItemEditAction;
}

export interface EditorStepPropsActions {
  onChange: (partial: Partial<ListingItemDraft>) => void;
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
