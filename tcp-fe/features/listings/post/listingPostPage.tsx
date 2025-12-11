"use client";

import { ListingTitle } from "./components/listingTitle";
import { ListingEditor } from "./components/listingEditor";

import { useListingDraft } from "./hooks/useListingDraft";
import { useListingSubmit } from "./hooks/useListingSubmit";

export function ListingPostPage() {
  const {
    addGroup,
    draft,
    isValid,
    removeGroup,
    reset,
    setTitle,
    updateGroup,
  } = useListingDraft({
    title: "",
    images: [],
  });

  const { isSubmitting, errorMessage, handleSubmit } = useListingSubmit();

  return (
    <main className="p-6 space-y-6">
      {/* 🔹 기본 정보 */}

      <ListingTitle value={{ title: draft.title }} actions={{ setTitle }} />

      {/* 🔹 내용 + 이미지 */}
      <ListingEditor
        value={{ images: draft.images }}
        actions={{
          addGroup,
          updateGroup,
          removeGroup,
        }}
      />

      {/* 🔹 버튼 */}
      <section className="rounded-xl p-6 flex items-center justify-end gap-3">
        <button
          type="button"
          className="text-sm px-4 py-2 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-100 transition"
          onClick={reset}
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
          onClick={() => handleSubmit(draft, isValid, reset)}
        >
          게시글 등록
        </button>
      </section>
    </main>
  );
}
