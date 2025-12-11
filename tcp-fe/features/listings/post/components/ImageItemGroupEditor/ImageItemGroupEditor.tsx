// ImageItemGroupEditor.tsx
"use client";

import { useState } from "react";
import { ListingItemDraft, ImageGroupDraft } from "../../types/types";
import { ListingItemType } from "@/lib/api/listings/types";
import { HeaderSection } from "./sections/HeaderSection";
import { ItemListSection } from "./sections/ItemListSection";
import { ImagePreviewSection } from "./sections/ImagePreviewSection";
import { InputItemName } from "./steps/InputItemName";
import { SetRarity } from "./steps/SetRarity";
import { SetPrice } from "./steps/SetPrice";
import { InputItemDetail } from "./steps/InputItemDetail";
import { SetQuantity } from "./steps/SetQuantity";
import { initItemDraft } from "../../utils/const";
import {
  GroupEditor,
  useGroupEditorState,
} from "../../hooks/useGroupEditorState";
type ImageItemEditorValue = {
  image: ImageGroupDraft;
  stepIndex: number;
};
type ImageItemGroupEditorActions = {
  updateGroup: (group: ImageGroupDraft) => void;
  removeGroup: (group: ImageGroupDraft) => void;
};

type Props = {
  value: ImageItemEditorValue;
  actions: ImageItemGroupEditorActions;
};

export function ImageItemGroupEditor({ value, actions }: Props) {
  const { image, stepIndex } = value;
  const { updateGroup, removeGroup } = actions;
  const {
    state,
    goNext,
    goPrev,
    initNewItem,
    removeItem,
    pushDraft,
    setDraft,
    setStep,
    updateItem,
  } = useGroupEditorState({
    isNewItem: false,
    itemDraft: initItemDraft,
    items: [],
    selectedImageId: null,
    step: 1,
  });
  const { isNewItem, itemDraft, items, selectedImageId, step } = state;
  // 위자드 상태
  const handleSaveItem = (itemDraft: ListingItemDraft) => {
    pushDraft(itemDraft);
    updateGroup({
      ...image,
      items: state.items,
    });
  };

  /** 🧩 스텝 단계별 렌더링 */
  const renderStep = () => {
    switch (step) {
      // 1단계: 타입 + 카드명
      case 1:
        return (
          <InputItemName
            value={{ item: itemDraft }}
            actions={{
              updateItemDraft: setDraft,
              goNext,
            }}
          />
        );

      // 2단계: 레어도 선택
      case 2:
        return (
          <SetRarity
            value={{
              itemDraft: itemDraft,
              isCard: itemDraft.type === ListingItemType.CARD,
            }}
            actions={{
              onChange: setDraft,
              onPrev: goPrev,
              onNext: goNext,
            }}
          />
        );

      // 3단계: 수량
      case 3:
        return (
          <SetQuantity
            value={{ itemDraft: itemDraft }}
            actions={{
              onChange: setDraft,
              onPrev: goPrev,
              onNext: goNext,
            }}
          />
        );

      // 4단계: 가격
      case 4:
        return (
          <SetPrice
            value={{ itemDraft: itemDraft }}
            actions={{
              onChange: setDraft,
              onPrev: goPrev,
              onNext: goNext,
            }}
          />
        );

      // 5단계: 상태 & 상세 설명
      case 5:
        return (
          <InputItemDetail
            value={{ itemDraft: itemDraft }}
            actions={{
              onPrev: goPrev,
              onChange: setDraft,
              onSave: handleSaveItem,
            }}
          />
        );

      default:
        return null;
    }
  };

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      {/* 상단 헤더: 그룹 번호, 삭제 버튼 등 */}
      <HeaderSection value={{ image }} actions={{ onRemove: removeGroup }} />

      {/* 이미지 미리보기 */}
      <ImagePreviewSection value={{ previewUrl: image.previewUrl }} />

      {/* 이 이미지에 이미 등록된 아이템 리스트 */}
      <ItemListSection
        value={{ image }}
        actions={{
          onEditItem: updateItem,
          onDeleteItem: removeItem,
        }}
      />

      {/* 아이템 추가/수정 위자드 */}
      <section className="mt-4 space-y-4">{renderStep()}</section>
    </article>
  );
}
