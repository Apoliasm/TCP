// steps/SetQuantity.tsx
"use client";

import {
  EditorStepPropsActions,
  EditorStepPropsValue,
} from "../../../types/types";

type SetQuantityProps = {
  value: EditorStepPropsValue;
  actions: EditorStepPropsActions;
};

export function SetQuantity({ value, actions }: SetQuantityProps) {
  const { itemDraft } = value;
  const { onChange, onPrev, onNext } = actions;

  const currentQuantity = itemDraft.quantity ?? 1;

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = Number(e.target.value);

    // 숫자가 아니면 무시
    if (isNaN(raw)) return;

    // 최소 1 이상만 허용
    const next = Math.max(1, raw);
    onChange({ quantity: next });
  };

  const handleDecrease = () => {
    const next = Math.max(1, currentQuantity - 1);
    onChange({ quantity: next });
  };

  const handleIncrease = () => {
    const next = currentQuantity + 1;
    onChange({ quantity: next });
  };

  return (
    <div className="space-y-3 transition-opacity duration-300">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-slate-800">수량 입력</h3>
        <span className="text-[11px] text-slate-500">3 / 5</span>
      </div>

      <p className="text-xs text-slate-500">
        판매할 수량을 입력해주세요. (기본값 1개)
      </p>

      {/* 🔢 수량 입력 + - / + 버튼 */}
      <div className="flex items-center gap-2">
        {/* - 버튼 */}
        <button
          type="button"
          onClick={handleDecrease}
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-100 transition"
        >
          -
        </button>

        {/* 숫자 입력 */}
        <input
          type="number"
          min={1}
          value={currentQuantity}
          onChange={handleChangeInput}
          className="w-24 rounded-lg border border-slate-300 px-3 py-2 text-sm text-center outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-300"
        />

        {/* + 버튼 */}
        <button
          type="button"
          onClick={handleIncrease}
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-100 transition"
        >
          +
        </button>
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
          className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-medium text-white hover:bg-slate-800 transition"
        >
          다음
        </button>
      </div>
    </div>
  );
}
