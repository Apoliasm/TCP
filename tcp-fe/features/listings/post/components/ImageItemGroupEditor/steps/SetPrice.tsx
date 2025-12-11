import { isNumberObject } from "util/types";
import {
  EditorStepPropsActions,
  EditorStepPropsValue,
  ListingItemDraft,
} from "../../../types/types";

type SetPriceProps = {
  value: EditorStepPropsValue;
  actions: EditorStepPropsActions;
};

export function SetPrice({ value, actions }: SetPriceProps) {
  const { itemDraft } = value;
  const { onChange, onPrev, onNext } = actions;

  return (
    <div className="space-y-3 transition-opacity duration-300">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-slate-800">
          가격 입력 (1개당)
        </h3>
        <span className="text-[11px] text-slate-500">4 / 5</span>
      </div>
      <p className="text-xs text-slate-500">
        한 개당 판매 가격을 입력해주세요.
      </p>

      <div className="flex items-center gap-2">
        <input
          type="number"
          min={0}
          value={itemDraft.pricePerUnit ?? 0}
          onChange={(e) => {
            onChange({
              pricePerUnit: Math.max(0, Number(e.target.value) || 0),
            });
          }}
          className="w-40 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-300"
        />
        <span className="text-xs text-slate-500">원</span>
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
          onClick={onNext}
          className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-medium text-white hover:bg-slate-800"
        >
          다음
        </button>
      </div>
    </div>
  );
}
