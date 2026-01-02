// ImageItemGroupEditor.tsx
"use client";

import { Dispatch } from "react";
import {
  ListingItemDraft,
  ImageGroupDraft,
  GroupEditDispatch,
} from "../../types/types";
import { HeaderSection } from "./sections/HeaderSection";
import { ItemListSection } from "./sections/ItemListSection";
import { ImagePreviewSection } from "./sections/ImagePreviewSection";
import { InputItemName } from "./steps/InputItemName";
import { SetPrice } from "./steps/SetPrice";
import { InputItemDetail } from "./steps/InputItemDetail";
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
  const { setAdd, setItem, setUpdate, state } = useGroupEditorState(
    group.localImageId,
    group.imageId
  );
  const { imageLocalId, itemDraft, editAction } = state;

  const onStartUpdateItem = (item: ListingItemDraft) => {
    setUpdate(item);
  };

  const onDeleteItem = (del: ListingItemDraft) => {
    group.items = group.items.filter((item) => {
      del.name === item.name;
    });
    setAdd();
    dispatchGroups({ action: "UPDATE", item: group });
  };

  const updateGroup = (cur: ListingItemDraft) => {
    const nextItems =
      editAction === "ADD"
        ? [...group.items, cur]
        : group.items.map((item) =>
            item.localImageId === cur.localImageId ? cur : item
          );

    const nextGroup: ImageGroupDraft = { ...group, items: nextItems };

    dispatchGroups({ action: "UPDATE", item: nextGroup });
    setAdd();
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
      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm ">
        <InputItemName
          value={{ item: itemDraft }}
          actions={{
            updateItemDraft: setItem,
          }}
        />
        <div className="flex justify-between py-2">
          <span className="px-2">
            <SetPrice
              value={{ itemDraft, editAction }}
              actions={{
                onChange: setItem,
              }}
            />
          </span>
        </div>

        <InputItemDetail
          value={{ itemDraft, editAction }}
          actions={{
            onChange: setItem,
          }}
        />
        <div className="flex justify-between gap-2 pt-1">
          <button
            type="button"
            onClick={() => updateGroup(itemDraft)}
            className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-medium text-white hover:bg-slate-800"
          >
            이 매물 저장하고 다음 매물 추가
          </button>
        </div>
      </section>
    </article>
  );
}
