"use client";

import { useListingPostForm } from "./hooks/useListingPostForm";
import { ListingTitle } from "./components/listingTitle";
import { ListingEditor } from "./components/listingEditor";
import { useState } from "react";
import { createListingFromDraft } from "@/lib/api/listings/mutations";
import { ListingStatus } from "@/lib/api/listings/types";
export function ListingPostPage() {
  const {
    draft,
    setTitle,
    setContent,
    addImage,
    updateImage,
    removeImage,
    addItemToImage,
    updateItemInImage,
    isValid,
    setImageListingId,
    removeItemFromImage,
    reset,
  } = useListingPostForm();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!isValid || isSubmitting) return;

    // TODO: 인증 붙으면 실제 로그인 유저 id 쓰기
    const sellerId = 1;

    try {
      setIsSubmitting(true);
      setErrorMessage(null);

      await createListingFromDraft(draft, {
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

  return (
    <main className="p-6 space-y-6">
      {/* 🔹 기본 정보 섹션 */}
      <section className="bg-slate-50 rounded-xl p-6 space-y-4 border border-slate-200">
        <ListingTitle
          value={{ title: draft.title }}
          actions={{ setTitle, setContent }}
        />
      </section>

      {/* 🔹 내용 및 이미지 섹션 */}
      <section className="bg-slate-50 rounded-xl p-6 space-y-4 border border-slate-200">
        <h2 className="text-sm font-medium text-slate-800">내용 및 이미지</h2>
        <p className="text-xs text-slate-500">
          거래 조건, 카드 상태, 참고할 만한 정보를 자유롭게 적어주세요.
        </p>

        <ListingEditor
          value={{ images: draft.images }}
          actions={{
            addImage,
            updateImage,
            removeImage,
            removeItemFromImage,
            addItemToImage,
            updateItemInImage,
          }}
        />
      </section>

      {/* 🔹 하단 버튼 영역 */}
      <section className="rounded-xl p-6 flex items-center justify-end gap-3">
        <button
          type="button"
          className="text-sm px-4 py-2 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-100 transition"
        >
          취소
        </button>
        <button
          type="button"
          disabled={!isValid}
          className={[
            "text-sm px-5 py-2.5 rounded-xl font-medium transition",
            "bg-slate-900 text-white hover:bg-slate-800",
            "disabled:bg-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed",
          ].join(" ")}
          onClick={() => handleSubmit()}
        >
          게시글 등록
        </button>
      </section>
    </main>
  );
}
