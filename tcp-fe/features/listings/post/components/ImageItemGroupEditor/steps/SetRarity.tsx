import { ListingItemType } from "@/lib/api/listings/types";
import {
  EditorStepPropsActions,
  EditorStepPropsValue,
  ListingItemDraft,
  RARITY,
} from "../../../types/types";

export const RARITY_OPTIONS = (
  [
    ["노멀 (N)", RARITY.N],
    ["레어 (R)", RARITY.R],
    ["슈퍼 레어 (SR)", RARITY.SR],
    ["울트라 레어 (UR)", RARITY.UR],
    ["얼티메이트 레어 (UL)", RARITY.UL],
    ["프리즈마틱", RARITY.Prismatic],
    ["울트라 패러럴 (UPR)", RARITY.UPR],
    ["노멀 패러럴 (NPR)", RARITY.NPR],
    ["기타", RARITY.Other],
  ] as const
).map(([label, value]) => ({ label, value }));

type SetRarityProps = {
  value: EditorStepPropsValue;
  actions: EditorStepPropsActions;
};

export function SetRarity({ value, actions }: SetRarityProps) {
  const { itemDraft } = value;
  const { onChange, onPrev, onNext } = actions;

  return (
    <div className="space-y-3 transition-opacity duration-300">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-slate-800">레어도 선택</h3>
        <span className="text-[11px] text-slate-500">2 / 5</span>
      </div>

      {itemDraft.type === ListingItemType.CARD ? (
        <>
          <p className="text-xs text-slate-500">
            카드의 레어도를 선택해주세요.
          </p>

          <div className="flex flex-wrap gap-2">
            {RARITY_OPTIONS.map(({ label, value: rarityValue }) => {
              const active = itemDraft.rarity === rarityValue;

              return (
                <button
                  key={rarityValue}
                  type="button"
                  onClick={() => onChange({ rarity: rarityValue })}
                  className={[
                    "px-3 py-1 rounded-full text-[11px] border transition",
                    active
                      ? "bg-slate-900 text-white border-slate-900"
                      : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50",
                  ].join(" ")}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </>
      ) : (
        <p className="text-xs text-slate-500">
          이 품목은 카드가 아니므로 레어도를 선택하지 않아도 됩니다.
        </p>
      )}

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
