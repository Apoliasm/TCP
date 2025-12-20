// hooks/useListingDraft.ts
import { useCallback, useEffect, useState } from "react";
import type { ImageGroupDraft, ListingDraft } from "../types/types";
import { useListingGroups } from "./useListingGroups";

export function useListingDraft(initial: ListingDraft) {
  const [title, setTitle] = useState<string>("");
  const [groups, dispatchGroups] = useListingGroups();

  /** ----------------------- 유효성 검사 & 리셋 ----------------------- */
  const isValid = title.trim().length > 0 && groups.length > 0;

  // //새 아이템 추가됐을 때 draft에 추가
  return {
    title,
    groups,

    // 기본 정보
    setTitle,
    dispatchGroups,

    // 그룹 컬렉션 조작
    // 기타
    isValid,
  };
}
