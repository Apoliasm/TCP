// hooks/useListingGroups.ts
import { useCallback, useEffect, useReducer } from "react";
import { postListingImage } from "@/lib/api/listings/mutations"; // 실제 경로에 맞게 수정
import type {
  ListingDraft,
  ImageGroupDraft,
  ListingItemDraft,
  GroupEditDisPatch,
} from "../types/types";

const reducer = (state: ImageGroupDraft[], action: GroupEditDisPatch) => {
  let inputItem = action.item;
  switch (action.action) {
    case "ADD":
      return [...state, inputItem];
    case "UPDATE":
      return state.map((draft) => {
        return draft.localId === inputItem.localId ? inputItem : draft;
      });
    case "REMOVE":
      return state.filter((draft) => {
        return draft.localId !== inputItem.localId;
      });
  }
};
export function useListingGroups() {
  return useReducer(reducer, []);
}
