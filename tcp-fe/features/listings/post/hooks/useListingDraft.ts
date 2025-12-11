// hooks/useListingDraft.ts
import { useCallback, useEffect, useState } from "react";
import type { ListingDraft } from "../types/types";
import { useListingGroups } from "./useListingGroups";

export function useListingDraft(initial: ListingDraft) {
  const [draft, setDraft] = useState<ListingDraft>(initial);

  /** ----------------------- 기본 정보 (title, content) ----------------------- */

  const setTitle = useCallback(
    (title: string) =>
      setDraft((prev) => ({
        ...prev,
        title,
      })),
    []
  );

  const setContent = useCallback(
    (content: string) =>
      setDraft((prev) => ({
        ...prev,
        content,
      })),
    []
  );

  /** ----------------------- 그룹(이미지) + 에디터 ----------------------- */

  const { addGroup, updateGroup, removeGroup } = useListingGroups(setDraft);

  /** ----------------------- 유효성 검사 & 리셋 ----------------------- */

  const isValid = draft.title.trim().length > 0 && draft.images.length > 0;

  const reset = useCallback(() => {
    setDraft({
      title: "",
      images: [],
    });
  }, []);

  /** ----------------------- 에디터 상태 → 상위 draft 반영 ----------------------- */
  // useEffect(() => {
  //   const { selectedImageId, items } = groupEditor.state;

  //   // 아직 어떤 이미지도 선택되지 않았다면 무시
  //   if (!selectedImageId) return;

  //   if (
  //     draft.images.findIndex((image) => image.localId === selectedImageId) !==
  //     -1
  //   ) {
  //     return;
  //   }

  //   // 현재 선택된 이미지 그룹의 items만 교체
  //   setDraft((prev) => ({
  //     ...prev,
  //     images: prev.images.map((img) =>
  //       img.localId === selectedImageId ? { ...img, items: [...items] } : img
  //     ),
  //   }));
  //   console.log("groupedidot");
  // }, [groupEditor.state.selectedImageId]);
  // // selectedImageId가 바뀔 때 == 이미지 새로 추가 (이미 있는거라면 return;)

  // useEffect(() => {
  //   console.log("itemad");
  //   const { selectedImageId, items } = groupEditor.state;
  //   let currentImage = draft.images.find(
  //     (image) => image.localId === selectedImageId
  //   );
  //   console.log()
  //   console.log(currentImage);
  //   if (!currentImage) return;
  //   setDraft((prev) => ({
  //     ...prev,
  //     images: prev.images.map((image) => {
  //       if (image.localId === selectedImageId) {
  //         return image;
  //       } else {
  //         return { ...image, items: [...groupEditor.state.items] };
  //       }
  //     }),
  //   }));
  // }, [groupEditor.state.items]);
  // //새 아이템 추가됐을 때 draft에 추가
  return {
    draft,

    // 기본 정보
    setTitle,

    // 그룹 컬렉션 조작
    addGroup,
    updateGroup,
    removeGroup,
    // 기타
    isValid,
    reset,
  };
}
