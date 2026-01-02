// hooks/useListingGroups.ts
import { useCallback, useEffect, useReducer } from "react";
import { postListingImage } from "@/lib/api/listings/mutations"; // 실제 경로에 맞게 수정
import type {
  ListingDraft,
  ImageGroupDraft,
  ListingItemDraft,
  GroupEditDispatch,
} from "../types/types";

const reducer = (state: ImageGroupDraft[], action: GroupEditDispatch) => {
  let inputGroup: ImageGroupDraft;
  let localId: string = "";
  switch (action.action) {
    case "ADD":
      inputGroup = action.item;
      return [...state, inputGroup];
    case "UPDATE":
      inputGroup = action.item;
      return state.map((draft) => {
        return draft.localImageId === inputGroup.localImageId
          ? inputGroup
          : draft;
      });
    case "REMOVE":
      inputGroup = action.item;
      return state.filter((draft) => {
        return draft.localImageId !== inputGroup.localImageId;
      });
    case "RESET":
      return [];
    default:
      return state;
  }
};
export function useListingGroups() {
  return useReducer(reducer, []);
}
