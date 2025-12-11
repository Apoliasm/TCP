// steps/InputItemDetail.tsx
"use client";

import {
  EditorStepPropsActions,
  EditorStepPropsValue,
  ListingItemDraft,
} from "../../../types/types";

const defaultStatus = "거의 새 것";

interface PropsActions extends Omit<EditorStepPropsActions, "onNext"> {
  onSave: (itemDraft: ListingItemDraft) => void;
}

type InputItemDetailProps = {
  value: EditorStepPropsValue;
  actions: PropsActions;
};

export function InputItemDetail({ value, actions }: InputItemDetailProps) {
  const { itemDraft } = value;
  const { onPrev, onChange, onSave } = actions;

  return (
    <div className="space-y-3 transition-opacity duration-300">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-slate-800">상태 & 상세 설명</h3>
        <span className="text-[11px] text-slate-500">5 / 5</span>
      </div>
      <p className="text-xs text-slate-500">
        카드/품목 상태와 추가로 알려주고 싶은 내용을 적어주세요.
      </p>

      {/* 상태 */}
      <div className="space-y-1">
        <label className="text-xs text-slate-600">상태</label>
        <input
          type="text"
          value={itemDraft.condition}
          onChange={(e) => {
            const next = e.target.value;

            if (itemDraft.condition === defaultStatus) {
              // 기본 문구에서 처음 수정 시 → 비워주기
              onChange({ condition: "" });
            } else {
              onChange({ condition: e.target.value });
            }
          }}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-300"
        />
      </div>

      {/* 상세 설명 */}
      <div className="space-y-1">
        <label className="text-xs text-slate-600">상세 설명</label>
        <textarea
          value={itemDraft.detail}
          onChange={(e) => onChange({ detail: e.target.value })}
          rows={3}
          placeholder="예) 카드 뒷면 상단에 살짝 스크래치가 있습니다. 슬리브에 넣어 보관했습니다."
          className="w-full resize-none rounded-lg border border-slate-300 px-3 py-2 text-xs outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-300"
        />
      </div>

      <div className="flex justify-between gap-2 pt-1">
        <button
          type="button"
          onClick={onPrev}
          className="rounded-lg border border-slate-300 px-4 py-2 text-xs text-slate-600 hover:bg-slate-50 transition"
        >
          이전
        </button>
        <button
          type="button"
          onClick={() => onSave(itemDraft)}
          className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-medium text-white hover:bg-slate-800"
        >
          이 매물 저장하고 다음 매물 추가
        </button>
      </div>
    </div>
  );
}
