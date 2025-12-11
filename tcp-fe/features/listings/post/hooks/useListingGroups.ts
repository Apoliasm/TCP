// hooks/useListingGroups.ts
import { useCallback, useEffect } from "react";
import { postListingImage } from "@/lib/api/listings/mutations"; // 실제 경로에 맞게 수정
import type {
  ListingDraft,
  ImageGroupDraft,
  ListingItemDraft,
} from "../types/types";
import { useGroupEditorState } from "./useGroupEditorState";
import { initItemDraft } from "../utils/const";

type SetDraft = React.Dispatch<React.SetStateAction<ListingDraft>>;

export function useListingGroups(setDraft: SetDraft) {
  const addGroup = (group: ImageGroupDraft) => {
    setDraft((prev) => ({
      ...prev,
      images: [...prev.images, group],
    }));
  };

  const updateGroup = (group: ImageGroupDraft) => {
    setDraft((prev) => ({
      ...prev,
      images: prev.images.map((image) => {
        return image.localId === group.localId ? group : image;
      }),
    }));
  };

  const removeGroup = (group: ImageGroupDraft) => {
    setDraft((prev) => ({
      ...prev,
      images: prev.images.filter((image) => {
        return image.localId !== group.localId;
      }),
    }));
  };

  return {
    addGroup,
    updateGroup,
    removeGroup,
  };
}
