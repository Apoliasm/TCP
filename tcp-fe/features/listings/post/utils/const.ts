import { ListingItemType } from "@/lib/api/listings/types";
import { ListingItemDraft, Rarity } from "../types/types";

export const defaultStatus = "거의 새 것";

export const initItemDraft: ListingItemDraft = {
  localId: crypto.randomUUID(),
  type: ListingItemType.CARD,
  cardName: "",
  detail: "",
  condition: defaultStatus,
  listingImageId: -1,
  quantity: 1,
  pricePerUnit: 0,
  rarity: Rarity.N,
};
