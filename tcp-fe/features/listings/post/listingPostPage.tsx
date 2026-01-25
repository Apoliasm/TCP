"use client";

import { ListingTitle } from "./components/listingTitle";
import { ListingEditor } from "./components/listingEditor";
import { useListingDraft } from "./hooks/useListingDraft";
import { useListingSubmit } from "./hooks/useListingSubmit";
import { ListingStatus } from "@/lib/api/listings/types";

export function ListingPostPage() {
  const {
    title,
    userId,
    groups,
    memo,
    status,
    dispatchGroups,
    isValid,
    setTitle,
  } = useListingDraft({
    userId: 1,
    title: "",
    memo: "",
    status: ListingStatus.ON_SALE,
    groups: [],
  });

  // ✅ reset: draft를 초기 상태로 되돌리기
  const reset = () => {
    setTitle("");
    dispatchGroups({ action: "RESET" });
  };

  const { isSubmitting, errorMessage, handleSubmit } = useListingSubmit();

  return (
    <div className="p-6 space-y-6">
      <header>
        <ListingTitle value={{ title }} actions={{ setTitle }} />
      </header>
      <ListingEditor value={{ groups }} actions={{ dispatchGroups }} />

      {errorMessage && (
        <p className="text-sm text-red-600" role="alert">
          {errorMessage}
        </p>
      )}

      <footer className="rounded-xl p-6 flex items-center justify-end gap-3">
        <button
          type="button"
          className="text-sm px-4 py-2 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-100 transition"
          onClick={() => reset()} // 취소도 reset만 하거나 router.back() 등 선택
          disabled={isSubmitting}
        >
          취소
        </button>

        <button
          type="button"
          disabled={!isValid || isSubmitting}
          className={[
            "text-sm px-5 py-2.5 rounded-xl font-medium transition",
            "bg-slate-900 text-white hover:bg-slate-800",
            "disabled:bg-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed",
          ].join(" ")}
          onClick={() =>
            handleSubmit(
              { userId, title, groups, memo, status },
              isValid,
              reset
            )
          }
        >
          {isSubmitting ? "등록 중..." : "게시글 등록"}
        </button>
      </footer>
    </div>
  );
}
