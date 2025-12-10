import { useState, useCallback } from "react";
import {
  ListingDraft,
  ImageGroupDraft,
  ListingItemDraft,
} from "@/features/listings/post/types/types";
import { postListingImage } from "@/lib/api/listings/mutations";
/**
 * 새 게시글 작성 상태를 관리하는 훅
 * - ListingPostPage에서만 사용
 * - 하위 컴포넌트에는 draft + setter/핸들러 함수들을 props로 내려주기
 */
export function useListingPostForm(initial?: Partial<ListingDraft>) {
  const [draft, setDraft] = useState<ListingDraft>({
    title: initial?.title ?? "",
    images: initial?.images ?? [],
  });

  // --- 기본 정보 ---

  const setTitle = useCallback((title: string) => {
    setDraft((prev) => ({ ...prev, title }));
  }, []);

  const setContent = useCallback((content: string) => {
    setDraft((prev) => ({ ...prev, content }));
  }, []);

  // --- 이미지 그룹 ---

  /**
   * 백엔드에 이미지 업로드 후, 해당 이미지의 listingImageId를 기록하는 용도
   * - Submit 단계에서: 각 ImageGroup에 대해 /listing-images 호출 후 여기로 반영
   */
  const setImageListingId = useCallback(
    (localId: string, listingImageId: number) => {
      setDraft((prev) => ({
        ...prev,
        images: prev.images.map((img) =>
          img.localId === localId ? { ...img, listingImageId } : img
        ),
      }));
    },
    []
  );

  const addImage = useCallback(
    async (file: File) => {
      const localId = crypto.randomUUID();
      const previewUrl = URL.createObjectURL(file);

      let newOrder = 0;

      // 1) 먼저 draft에 로컬 이미지 추가
      setDraft((prev) => {
        newOrder = prev.images.length; // 현재 길이가 새 이미지 order
        return {
          ...prev,
          images: [
            ...prev.images,
            {
              localId,
              file,
              previewUrl,
              order: newOrder,
              items: [],
            },
          ],
        };
      });

      // 2) 서버에 업로드 (실패해도 화면은 그대로 두고 log만)
      try {
        const { id } = await postListingImage(newOrder, file);
        setImageListingId(localId, id);
      } catch (err) {
        console.error("이미지 업로드 실패", err);
        // TODO: toast로 "이미지 업로드 실패" 정도 띄울 수 있음
      }
    },
    [setImageListingId]
  );

  const updateImage = useCallback(
    (localId: string, partial: Partial<ImageGroupDraft>) => {
      setDraft((prev) => ({
        ...prev,
        images: prev.images.map((img) =>
          img.localId === localId ? { ...img, ...partial } : img
        ),
      }));
    },
    []
  );

  const removeImage = useCallback((localId: string) => {
    setDraft((prev) => ({
      ...prev,
      images: prev.images
        .filter((img) => img.localId !== localId)
        .map((img, index) => ({ ...img, order: index })), // order 재정렬
    }));
  }, []);

  // --- 아이템 (카드) ---

  const addItemToImage = useCallback(
    (localId: string, newItem: ListingItemDraft) => {
      setDraft((prev) => ({
        ...prev,
        images: prev.images.map((img) =>
          img.localId === localId
            ? { ...img, items: [...img.items, newItem] }
            : img
        ),
      }));
    },
    []
  );

  const updateItemInImage = useCallback(
    (localId: string, index: number, partial: Partial<ListingItemDraft>) => {
      setDraft((prev) => ({
        ...prev,
        images: prev.images.map((img) =>
          img.localId === localId
            ? {
                ...img,
                items: img.items.map((item, i) =>
                  i === index ? { ...item, ...partial } : item
                ),
              }
            : img
        ),
      }));
    },
    []
  );

  const removeItemFromImage = useCallback((localId: string, index: number) => {
    setDraft((prev) => ({
      ...prev,
      images: prev.images.map((img) =>
        img.localId === localId
          ? {
              ...img,
              items: img.items.filter((_, i) => i !== index),
            }
          : img
      ),
    }));
  }, []);

  // --- 유효성 검사 & 리셋 ---

  const isValid = draft.title.trim().length > 0 && draft.images.length > 0;

  const reset = useCallback(() => {
    setDraft({
      title: "",
      images: [],
    });
  }, []);

  return {
    draft,
    // 기본 정보
    setTitle,
    setContent,
    // 이미지
    addImage,
    updateImage,
    removeImage,
    setImageListingId,
    // 아이템
    addItemToImage,
    updateItemInImage,
    removeItemFromImage,
    // 기타
    isValid,
    reset,
  };
}
