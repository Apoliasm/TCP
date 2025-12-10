"use client";

import { useRef } from "react";
import { ImageGroupDraft, ListingItemDraft } from "../types/types";
import { ImageItemGroupEditor } from "./imageItemEditor";

type ListingEditorValue = {
  images: ImageGroupDraft[];
};

type ListingEditorActions = {
  addImage: (file: File) => void;
  updateImage: (localId: string, partial: Partial<ImageGroupDraft>) => void;
  removeImage: (localId: string) => void;

  addItemToImage: (localId: string, newItem: ListingItemDraft) => void;
  updateItemInImage: (
    localId: string,
    index: number,
    partial: Partial<ListingItemDraft>
  ) => void;
  removeItemFromImage: (localId: string, index: number) => void;
};

type ListingEditorProps = {
  value: ListingEditorValue;
  actions: ListingEditorActions;
};

export function ListingEditor({ value, actions }: ListingEditorProps) {
  const { images } = value;
  const {
    addImage,
    removeImage,
    addItemToImage,
    updateItemInImage,
    removeItemFromImage,
    updateImage, // 지금은 안 쓰지만 시그니처 유지
  } = actions;

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  return (
    <section className="space-y-4">
      {/* 상단 설명 + 버튼 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-medium text-slate-800">
            사진 & 카드 정보
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            매물 사진을 업로드한 뒤, 이 사진 안에 포함된 카드들을 순차적으로
            등록할 수 있어요.
          </p>
          <p className="mt-0.5 text-[11px] text-slate-400">
            한 장의 사진에 여러 매물을 등록할 수 있습니다.
          </p>
        </div>

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition"
        >
          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-slate-900 text-white text-xs">
            +
          </span>
          사진 추가
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) addImage(file);

            if (e.target) e.target.value = "";
          }}
        />
      </div>

      {/* 이미지가 없을 때 안내 */}
      {images.length === 0 && (
        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center text-xs text-slate-500">
          아직 등록된 사진이 없습니다.
          <br />
          <span className="font-medium text-slate-700">“사진 추가”</span> 버튼을
          눌러 첫 매물을 등록해보세요.
        </div>
      )}

      {/* 이미지별 에디터 */}
      <div className="space-y-4">
        {images.map((image, index) => (
          <ImageItemGroupEditor
            key={image.localId}
            value={{ image, stepIndex: index + 1 }}
            actions={{
              removeGroup: () => removeImage(image.localId),
              addItem: (localId, item) => addItemToImage(localId, item),
              updateItem: (itemIndex, localId, partial) =>
                updateItemInImage(localId, itemIndex, partial),
              removeItem: (itemIndex) =>
                removeItemFromImage(image.localId, itemIndex),
            }}
          />
        ))}
      </div>
    </section>
  );
}
