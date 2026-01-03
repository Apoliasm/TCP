import { isNumberObject } from "util/types";
import {
  EditorStepPropsActions,
  EditorStepPropsValue,
  ListingItemDraft,
} from "../../../types/types";
import { NumberInput } from "@/shared/component/numberInput";

type SetPriceProps = {
  value: EditorStepPropsValue;
  actions: EditorStepPropsActions;
};

export function SetPrice({ value, actions }: SetPriceProps) {
  const { itemDraft } = value;
  const { onChange } = actions;

  return (
    <div className="space-y-3 transition-opacity duration-300">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-slate-800">
          가격 입력 (1개당)
        </h3>
      </div>
      <p className="text-xs text-slate-500">
        한 개당 판매 가격을 입력해주세요.
      </p>

      <NumberInput
        value={{
          currentValue: itemDraft.pricePerUnit,
          increaseUnit: 1000,
          unitName: "원",
          updateKey: "pricePerUnit",
        }}
        action={{ onChange }}
      />
    </div>
  );
}
