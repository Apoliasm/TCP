// hooks/useListingDraft.ts
import { useCallback, useEffect, useState } from "react";
import type { ImageGroupDraft, ListingDraft } from "../types/types";
import { useListingGroups } from "./useListingGroups";
import { ListingStatus } from "@/lib/api/listings/types";

export function useListingDraft(initial: ListingDraft) {
  const [title, setTitle] = useState<string>("");
  const [status, setStatus] = useState<ListingStatus>(ListingStatus.ON_SALE);
  const [memo, setMemo] = useState("");
  const [groups, dispatchGroups] = useListingGroups();
  const [userId, setUserId] = useState(1);
  /** ----------------------- 유효성 검사 & 리셋 ----------------------- */
  const isValid = title.trim().length > 0 && groups.length > 0;

  // //새 아이템 추가됐을 때 draft에 추가
  return {
    title,
    userId,
    groups,
    memo,
    status,

    // 기본 정보
    setTitle,
    dispatchGroups,

    // 그룹 컬렉션 조작
    // 기타
    isValid,
  };
}
