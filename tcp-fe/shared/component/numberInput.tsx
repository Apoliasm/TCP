import {
  EditorStepPropsActions,
  GroupEditorState,
  ListingItemDraft,
} from "@/features/listings/post/types/types";
import { useEffect, useState } from "react";

type PropsValue = {
  currentValue: number;
  increaseUnit: number;
  unitName: string;
  updateKey: keyof ListingItemDraft;
};

type Props = {
  value: PropsValue;
  action: EditorStepPropsActions;
};
export function NumberInput(props: Props) {
  const { value, action } = props;
  const { currentValue, increaseUnit, unitName, updateKey } = value;
  const [inputValue, setInputValue] = useState<string>(`${currentValue}`);
  const { onChange } = action;
  useEffect(() => {
    setInputValue(`${currentValue}`);
  }, [currentValue]);
  const handleDecrease = () => {
    const next = Math.max(0, currentValue - increaseUnit);
    setInputValue(`${next}`);
    onChange({ [updateKey]: next } as Partial<ListingItemDraft>);
  };

  const handleIncrease = () => {
    const next = currentValue + increaseUnit;
    setInputValue(`${next}`);
    onChange({ [updateKey]: next } as Partial<ListingItemDraft>);
  };

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    let next: number = 0;
    if (e.target.value.length === 0) {
      setInputValue("");
      next = 0;
    } else {
      const raw = Number(e.target.value);
      // 숫자가 아니면 무시
      if (isNaN(raw)) return;
      next = Math.max(0, raw);
    }

    setInputValue(`${next}`);
    onChange({ [updateKey]: next } as Partial<ListingItemDraft>);
  };
  return (
    <div className="flex items-center gap-2">
      {/* - 버튼 */}
      <button
        type="button"
        onClick={handleDecrease}
        className="px-2 h-8 flex items-center justify-center rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-100 transition"
      >
        -{increaseUnit}
      </button>

      {/* 숫자 입력 */}
      <div className="relative w-24">
        <input
          type="text"
          inputMode="numeric"
          value={inputValue}
          onChange={handleChangeInput}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-center outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-300 text-transparent caret-slate-700"
        />

        <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-sm">
          <span>{inputValue}</span>
          <span className="ml-1 text-slate-400">{unitName}</span>
        </div>
      </div>

      {/* + 버튼 */}
      <button
        type="button"
        onClick={handleIncrease}
        className="px-2 h-8 flex items-center justify-center rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-100 transition"
      >
        +{increaseUnit}
      </button>
    </div>
  );
}
