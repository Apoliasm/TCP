import { createListingFromDraft } from "@/lib/api/listings/mutations";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ListingDraft } from "../types/types";
import { ListingStatus } from "@/lib/api/listings/types";

export function useListingSubmit() {
  const router = useRouter();

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
        status: ListingStatus.ON_SALE,
      });

      reset();
      alert("게시물 등록에 성공했습니다.");
      // ✅ 성공 후 /listings로 이동
      router.push("/listing");
      // 목록 화면이 서버 컴포넌트 + fetch 캐시 쓰면 아래가 도움될 때가 있음
      router.refresh();
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err?.message ?? "등록 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return { isSubmitting, errorMessage, handleSubmit };
}
