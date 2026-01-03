// sections/ItemListSection.tsx
import { ListingItemType } from "@/lib/api/listings/types";
import {
  GroupEditDispatch,
  ImageGroupDraft,
  ItemEditAction,
  ListingItemDraft,
  RARITY,
  Rarity,
} from "../../../types/types";

type ItemListSectionValue = {
  items: ListingItemDraft[];
};

type ItemListSectionActions = {
  onUpdateItem: (item: ListingItemDraft) => void;
  onDeleteItem: (item: ListingItemDraft) => void;
};

type ItemListSectionProps = {
  value: ItemListSectionValue;
  actions: ItemListSectionActions;
};

export function ItemListSection({ value, actions }: ItemListSectionProps) {
  const { items } = value;
  const { onUpdateItem, onDeleteItem } = actions;

  if (items.length === 0) {
    return (
      <section className="my-4">
        <p className="text-[11px] text-slate-400">
          아직 이 사진에 등록된 매물이 없습니다. 아래에서 첫 매물을 등록해
          주세요.
        </p>
      </section>
    );
  }

  return (
    <section className="my-4">
      <ul className="space-y-2">
        {items.map((item, index) => (
          <li
            key={`${item.name}-${index}`}
            className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2"
          >
            <div className="text-[11px] text-slate-700">
              <span className="font-medium">{item.name || "이름 없음"}</span>
              <span className="ml-2 text-slate-500">
                {item.quantity}장 · {item.pricePerUnit.toLocaleString()}원/장
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onUpdateItem(item)}
                className="rounded-lg border border-slate-300 px-2 py-1 text-[11px] text-slate-700 hover:bg-slate-100 transition"
              >
                수정
              </button>
              <button
                type="button"
                onClick={() => onDeleteItem(item)}
                className="rounded-lg border border-red-200 px-2 py-1 text-[11px] text-red-500 hover:bg-red-50 transition"
              >
                삭제
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
