import { createListingFromDraft } from "@/lib/api/listings/mutations";
import { useState } from "react";
import { ListingDraft } from "../types/types";
import { ListingStatus } from "@/lib/api/listings/types";

export function useListingSubmit() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (
    listingDraft: ListingDraft,
    isValid: boolean,
    reset: () => void
  ) => {
    if (!isValid || isSubmitting) return;

    // TODO: 인증 붙으면 실제 로그인 유저 id 쓰기
    const sellerId = 1;

    try {
      setIsSubmitting(true);
      setErrorMessage(null);

      await createListingFromDraft(listingDraft, {
        sellerId,
        status: ListingStatus.ON_SALE, // 필요하면 여기서 지정
      });

      // 성공 후 초기화 + 페이지 이동 등
      reset();
      alert("게시글이 등록되었습니다.");
      // router.push("/listings"); 등 원하는 곳으로 이동
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message ?? "등록 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return { isSubmitting, errorMessage, handleSubmit };
}
