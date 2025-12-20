"use client";

import { Dispatch, useRef, useState } from "react";
import { GroupEditDispatch, ImageGroupDraft } from "../types/types";
import { ImageItemGroupEditor } from "./ImageItemGroupEditor/ImageItemGroupEditor";
import { postListingImage } from "@/lib/api/listings/mutations";

type ListingEditorValue = {
  groups: ImageGroupDraft[];
};

type ListingEditorActions = {
  dispatchGroups: Dispatch<GroupEditDispatch>;
};

type ListingEditorProps = {
  value: ListingEditorValue;
  actions: ListingEditorActions;
};

export function ListingEditor({ value, actions }: ListingEditorProps) {
  const { groups } = value;
  const [imageOrder, setImageOrder] = useState(0);
  const { dispatchGroups } = actions;

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleClickAddPhoto = () => {
    fileInputRef.current?.click();
  };

  const handleChangeFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const localId = crypto.randomUUID();
    const previewUrl = URL.createObjectURL(file);
    const { id, url } = await postListingImage(imageOrder, file);
    setImageOrder((prev) => prev + 1);
    const newGroup: ImageGroupDraft = {
      localId,
      file,
      previewUrl,
      imageUrl: url,
      order: imageOrder,
      listingImageId: id,
      items: [],
      // 필요하면 listingImageId 같은 필드도 여기서 undefined 로 초기화
    };
    dispatchGroups({ action: "ADD", item: newGroup });

    // 같은 파일 다시 선택 가능하도록 초기화
    e.target.value = "";
  };

  return (
    <section className="bg-slate-50 rounded-xl p-6 space-y-4 border border-slate-200">
      <h2 className="text-sm font-medium text-slate-800">내용 및 이미지</h2>
      <p className="text-xs text-slate-500">
        거래 조건, 카드 상태 등을 자유롭게 적어주세요.
      </p>

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
            onClick={handleClickAddPhoto}
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
            onChange={handleChangeFile}
          />
        </div>

        {/* 이미지가 없을 때 안내 */}
        {groups.length === 0 && (
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center text-xs text-slate-500">
            아직 등록된 사진이 없습니다.
            <br />
            <span className="font-medium text-slate-700">“사진 추가”</span>{" "}
            버튼을 눌러 첫 매물을 등록해보세요.
          </div>
        )}

        {/* 이미지별 에디터 */}
        <div className="space-y-4">
          {groups.map((group, index) => (
            <ImageItemGroupEditor
              key={group.localId}
              value={{ group, stepIndex: index + 1 }}
              actions={{
                dispatchGroups,
              }}
            />
          ))}
        </div>
      </section>
    </section>
  );
}
