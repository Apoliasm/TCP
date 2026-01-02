// steps/InputItemDetail.tsx
"use client";

import { Dispatch } from "react";
import {
  EditorStepPropsActions,
  EditorStepPropsValue,
  GroupEditDispatch,
  ListingItemDraft,
} from "../../../types/types";

const defaultStatus = "거의 새 것";

type InputItemDetailProps = {
  value: EditorStepPropsValue;
  actions: EditorStepPropsActions;
};

export function InputItemDetail({ value, actions }: InputItemDetailProps) {
  const { itemDraft, editAction } = value;
  const { onChange } = actions;

  return (
    <div className="space-y-3 transition-opacity duration-300">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-slate-800">상태 & 상세 설명</h3>
      </div>
      <p className="text-xs text-slate-500">
        카드/품목 상태와 추가로 알려주고 싶은 내용을 적어주세요.
      </p>

      {/* 상세 설명 */}
      <div className="space-y-1">
        <label className="text-xs text-slate-600">상세 설명</label>
        <textarea
          value={itemDraft.detailText}
          onChange={(e) => onChange({ detailText: e.target.value })}
          rows={3}
          placeholder="예) 카드 뒷면 상단에 살짝 스크래치가 있습니다. 슬리브에 넣어 보관했습니다."
          className="w-full resize-none rounded-lg border border-slate-300 px-3 py-2 text-xs outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-300"
        />
      </div>
    </div>
  );
}
