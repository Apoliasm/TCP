// ImageItemGroupEditor.tsx
"use client";

import { Dispatch } from "react";
import {
  ListingItemDraft,
  ImageGroupDraft,
  GroupEditDispatch,
} from "../../types/types";
import { ListingItemType } from "@/lib/api/listings/types";
import { HeaderSection } from "./sections/HeaderSection";
import { ItemListSection } from "./sections/ItemListSection";
import { ImagePreviewSection } from "./sections/ImagePreviewSection";
import { InputItemName } from "./steps/InputItemName";
import { SetRarity } from "./steps/SetRarity";
import { SetPrice } from "./steps/SetPrice";
import { InputItemDetail } from "./steps/InputItemDetail";
import { SetQuantity } from "./steps/SetQuantity";
import { useGroupEditorState } from "../../hooks/useGroupEditorState";
type ImageItemEditorValue = {
  group: ImageGroupDraft;
  stepIndex: number;
};
type ImageItemGroupEditorActions = {
  dispatchGroups: Dispatch<GroupEditDispatch>;
};

type Props = {
  value: ImageItemEditorValue;
  actions: ImageItemGroupEditorActions;
};

export function ImageItemGroupEditor({ value, actions }: Props) {
  const { group, stepIndex } = value;
  const { dispatchGroups } = actions;
  const {
    goNext,
    goPrev,
    setAdd,
    setItem,
    setStep,
    setUpdate,
    setType,
    state,
  } = useGroupEditorState(group.localId);

  const onStartUpdateItem = (item: ListingItemDraft) => {
    setUpdate(item);
  };

  const onDeleteItem = (del: ListingItemDraft) => {
    group.items = group.items.filter((item) => {
      del.name === item.name && del.type === item.type;
    });
    setAdd();
    dispatchGroups({ action: "UPDATE", item: group });
  };

  const updateGroup = (cur: ListingItemDraft) => {
    const nextItems =
      editAction === "ADD"
        ? [...group.items, cur]
        : group.items.map((item) =>
            item.localId === cur.localId ? cur : item
          );

    const nextGroup: ImageGroupDraft = { ...group, items: nextItems };

    dispatchGroups({ action: "UPDATE", item: nextGroup });
    setAdd();
  };

  const { imageLocalId, itemDraft, step, editAction } = state;

  /** 🧩 스텝 단계별 렌더링 */
  const renderStep = () => {
    switch (step) {
      // 1단계: 타입 + 카드명
      case 1:
        return (
          <InputItemName
            value={{ item: itemDraft }}
            actions={{
              updateItemDraft: setItem,
              goNext,
              setType,
            }}
          />
        );

      // 2단계: 레어도 선택
      case 2:
        return (
          <SetRarity
            value={{
              itemDraft,
              editAction,
            }}
            actions={{
              onChange: setItem,
              onPrev: goPrev,
              onNext: goNext,
            }}
          />
        );

      // 3단계: 수량
      case 3:
        return (
          <SetQuantity
            value={{ itemDraft, editAction }}
            actions={{
              onChange: setItem,
              onPrev: goPrev,
              onNext: goNext,
            }}
          />
        );

      // 4단계: 가격
      case 4:
        return (
          <SetPrice
            value={{ itemDraft, editAction }}
            actions={{
              onChange: setItem,
              onPrev: goPrev,
              onNext: goNext,
            }}
          />
        );

      // 5단계: 상태 & 상세 설명
      case 5:
        return (
          <InputItemDetail
            value={{ itemDraft, editAction }}
            actions={{
              onPrev: goPrev,
              onChange: setItem,
              onSave: updateGroup,
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
      <HeaderSection value={{ group }} actions={{ dispatchGroups }} />

      {/* 이미지 미리보기 */}
      <ImagePreviewSection value={{ previewUrl: group.previewUrl }} />

      {/* 이 이미지에 이미 등록된 아이템 리스트 */}
      <ItemListSection
        value={{ items: group.items }}
        actions={{
          onUpdateItem: onStartUpdateItem,
          onDeleteItem: onDeleteItem,
        }}
      />

      {/* 아이템 추가/수정 위자드 */}
      <section className="mt-4 space-y-4">{renderStep()}</section>
    </article>
  );
}
