"use client";

import { useCallback, useEffect, useState } from "react";
import {
  ImageGroupDraft,
  ItemInfoDraft,
  ListingItemDraft,
  Rarity,
} from "../types/types";
import { ItemInfoResponseDto, ListingItemType } from "@/lib/api/listings/types";
import { searchItemByname } from "@/lib/api/listings/queries";

type Step = 1 | 2 | 3 | 4 | 5;

type ImageItemGroupEditorValue = {
  image: ImageGroupDraft;
  stepIndex: number;
};

type ImageItemGroupEditorActions = {
  removeGroup: () => void;
  addItem: (localId: string, newItem: ListingItemDraft) => void;
  updateItem: (
    index: number,
    localId: string,
    partial: Partial<ListingItemDraft>
  ) => void;
  removeItem: (index: number) => void;
};

type Props = {
  value: ImageItemGroupEditorValue;
  actions: ImageItemGroupEditorActions;
};

const MOCK_SEARCH_RESULTS = [
  "푸른 눈의 백룡",
  "푸른 눈의 아백룡",
  "블루아이즈 화이트 드래곤",
];
const defaultStatus = "거의 새 것";

export function ImageItemGroupEditor({
  value: { image, stepIndex },
  actions,
}: Props) {
  const { removeGroup, addItem, updateItem, removeItem } = actions;

  const [step, setStep] = useState<Step>(1);
  const [isNewItem, setIsNewItem] = useState(true);
  const [itemIndex, setItemIndex] = useState(0);

  const [newItem, setNewItem] = useState<ListingItemDraft>({
    localItemId: crypto.randomUUID(),
    type: ListingItemType.CARD,
    cardName: "",
    detail: "",
    condition: defaultStatus,
    quantity: 1,
    pricePerUnit: 0,
    rarity: Rarity.N, // 기본값 N
  });

  const goNext = () =>
    setStep((prev) => {
      if (prev === 1 && newItem.type !== ListingItemType.CARD) {
        return (prev + 2) as Step;
      } else return (prev === 5 ? 5 : prev + 1) as Step;
    });

  const goPrev = () =>
    setStep((prev) => {
      if (prev === 3 && newItem.type !== ListingItemType.CARD) {
        return (prev - 2) as Step;
      } else return (prev === 1 ? 1 : prev - 1) as Step;
    });

  const resetNewItem = () => {
    setNewItem({
      localItemId: crypto.randomUUID(),
      type: ListingItemType.CARD,
      cardName: "",
      detail: "",
      condition: "",
      quantity: 1,
      pricePerUnit: 0,
      rarity: Rarity.N,
    });
  };

  const handleClickEditItem = (index: number, item: ListingItemDraft) => {
    setIsNewItem(false);
    setItemIndex(index);
    setNewItem({ ...item });
    setStep(1);
  };

  const handleSaveItem = () => {
    if (isNewItem) {
      addItem(image.localId, newItem);
    } else {
      updateItem(itemIndex, image.localId, newItem);
    }

    // 저장 후 새 매물 모드
    setIsNewItem(true);
    setStep(1);
    resetNewItem();
  };

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <HeaderSection stepIndex={stepIndex} onRemove={removeGroup} />

      <ImagePreviewSection previewUrl={image.previewUrl} />

      <ItemListSection
        image={image}
        onEditItem={handleClickEditItem}
        onDeleteItem={removeItem}
      />

      <section className="space-y-4">
        {/* STEP 1: 타입 + 카드명 */}
        {step === 1 && (
          <TypeAndCardNameStep
            item={newItem}
            onChange={(partial) =>
              setNewItem((prev) => ({ ...prev, ...partial }))
            }
            onNext={goNext}
          />
        )}

        {/* STEP 2: 레어도 선택 */}
        {step === 2 && (
          <RarityStep
            value={newItem.rarity}
            isCard={newItem.type === ListingItemType.CARD}
            onChange={(rarity) => setNewItem((prev) => ({ ...prev, rarity }))}
            onPrev={goPrev}
            onNext={goNext}
          />
        )}

        {/* STEP 3: 수량 */}
        {step === 3 && (
          <QuantityStep
            value={newItem.quantity}
            onChange={(quantity) =>
              setNewItem((prev) => ({ ...prev, quantity }))
            }
            onPrev={goPrev}
            onNext={goNext}
          />
        )}

        {/* STEP 4: 가격 */}
        {step === 4 && (
          <PriceStep
            value={newItem.pricePerUnit}
            onChange={(pricePerUnit) =>
              setNewItem((prev) => ({ ...prev, pricePerUnit }))
            }
            onPrev={goPrev}
            onNext={goNext}
          />
        )}

        {/* STEP 5: 상태 & 상세 설명 */}
        {step === 5 && (
          <ConditionAndDetailStep
            condition={newItem.condition}
            detail={newItem.detail}
            onChange={(partial) =>
              setNewItem((prev) => ({ ...prev, ...partial }))
            }
            onPrev={goPrev}
            onSave={handleSaveItem}
          />
        )}
      </section>
    </article>
  );
}

/* --------------------------------- Header --------------------------------- */

type HeaderSectionProps = {
  stepIndex: number;
  onRemove: () => void;
};

function HeaderSection({ stepIndex, onRemove }: HeaderSectionProps) {
  return (
    <header className="mb-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-xs text-white">
          {stepIndex}
        </span>
        <p className="text-xs text-slate-600">사진 {stepIndex}</p>
      </div>
      <button
        type="button"
        onClick={onRemove}
        className="text-xs text-slate-400 hover:text-red-500"
      >
        이 사진 삭제
      </button>
    </header>
  );
}

/* ------------------------------- Image Preview ------------------------------ */

type ImagePreviewSectionProps = {
  previewUrl?: string;
};

function ImagePreviewSection({ previewUrl }: ImagePreviewSectionProps) {
  if (!previewUrl) return null;

  return (
    <div className="mb-4">
      <img
        src={previewUrl}
        alt="상품 이미지"
        className="h-32 w-full rounded-lg object-cover"
      />
    </div>
  );
}

/* -------------------------- Item List (수정/삭제) -------------------------- */

type ItemListSectionProps = {
  image: ImageGroupDraft;
  onEditItem: (index: number, item: ListingItemDraft) => void;
  onDeleteItem: (index: number) => void;
};

function ItemListSection({
  image,
  onEditItem,
  onDeleteItem,
}: ItemListSectionProps) {
  if (image.items.length === 0) {
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
        {image.items.map((item, index) => (
          <li
            key={item.localItemId ?? `${image.localId}-${index}`}
            className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2"
          >
            <div className="text-[11px] text-slate-700">
              <span className="font-medium">
                {item.cardName || "이름 없음"}
              </span>
              <span className="ml-2 text-slate-500">
                {item.quantity}장 · {item.pricePerUnit.toLocaleString()}원/장
              </span>
              {item.rarity !== undefined && (
                <span className="ml-2 text-[10px] text-emerald-600">
                  [{Rarity[item.rarity]}]
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onEditItem(index, item)}
                className="rounded-lg border border-slate-300 px-2 py-1 text-[11px] text-slate-700 hover:bg-slate-100 transition"
              >
                수정
              </button>
              <button
                type="button"
                onClick={() => onDeleteItem(index)}
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

/* -------------------- Step 1: 타입 + 카드명(검색) -------------------- */

const typeOptions = [
  { label: "카드", value: ListingItemType.CARD },
  { label: "악세사리", value: ListingItemType.ACCESSORY },
  { label: "기타", value: ListingItemType.OTHER },
] as const;

type TypeAndCardNameStepProps = {
  item: ListingItemDraft;
  onChange: (partial: Partial<ListingItemDraft>) => void;
  onNext: () => void;
};

function TypeAndCardNameStep({
  item,
  onChange,
  onNext,
}: TypeAndCardNameStepProps) {
  const [isInput, setIsInput] = useState<boolean>(false);
  const [searchResult, setSearchResult] = useState<ItemInfoResponseDto[]>([]);
  const [query, setQuery] = useState("");
  const [cardCode, setCardCode] = useState("");
  const onClick = ({ name, code, rarity }: ItemInfoDraft) => {
    setIsInput(true);
    setQuery(name);
    if (code) setCardCode(code);
    onChange({ rarity: rarity as Rarity, cardName: name });
  };

  async function searchQuery(value: string) {
    const result = await searchItemByname({ nameQuery: value, codeQuery: "" });
    if (result) setSearchResult([...result]);
  }

  useEffect(() => {
    if (!query.trim()) {
      setSearchResult([]);
      return;
    }

    const timer = setTimeout(() => {
      // query가 바뀐 후 300ms 동안 추가 입력이 없으면 실행
      searchQuery(query);
    }, 300);

    // query가 다시 바뀌면 이전 타이머 취소
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="space-y-3 transition-opacity duration-300">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-slate-800">
          품목 종류 & 카드명
        </h3>
        <span className="text-[11px] text-slate-500">1 / 5</span>
      </div>

      {/* 타입 선택 */}
      <div className="space-y-1">
        <p className="text-xs text-slate-500">품목 종류를 선택해 주세요.</p>
        <div className="inline-flex rounded-full bg-slate-100 p-1 text-[11px]">
          {typeOptions.map(({ label, value }) => (
            <button
              key={value}
              type="button"
              onClick={() => onChange({ type: value })}
              className={[
                "px-3 py-1 rounded-full transition",
                item.type === value
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500",
              ].join(" ")}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* 카드명 입력 + 검색 결과 (CARD일 때 추천) */}

      <div className="space-y-2">
        <p className="text-xs text-slate-500">
          카드 이름을 입력하면 추천 결과가 나타납니다.
          <br />
          (카드가 아니라면 간단한 품목 이름을 적어주세요.)
        </p>
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
          }}
          placeholder={
            item.type === ListingItemType.CARD
              ? "예) 푸른 눈의 백룡"
              : "예) 카드 슬리브 세트"
          }
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-300"
        />
      </div>
      {isInput ? (
        <div className="space-y-2">
          <p className="text-xs text-slate-500">코드네임</p>

          <input
            type="text"
            value={cardCode}
            onChange={(e) => {
              setCardCode(e.target.value);
            }}
            placeholder={"ROTA-KR024"}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-300"
          />
        </div>
      ) : (
        <SearchResultViewer results={searchResult} onChange={onClick} />
      )}

      <div className="flex justify-end gap-2 pt-1">
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

type SearchResultViewerProps = {
  results: ItemInfoResponseDto[];
  onChange: ({ name, type, code, rarity }: ItemInfoDraft) => void;
};
function SearchResultViewer({ results, onChange }: SearchResultViewerProps) {
  if (results.length !== 0) {
    return (
      <ul className="max-h-32 overflow-y-auto rounded-lg border border-slate-200 bg-white text-xs shadow-sm">
        {results
          .map((result) => {
            const name =
              result.cardInfo?.cardName?.name ??
              result.cardInfo?.candidate?.name ??
              result.accessoryInfo?.name ??
              "";

            return {
              id: result.id,
              name: name,
              type: result.type,
              ...(result.cardInfo?.cardCode && {
                code: result.cardInfo.cardCode,
              }),
              ...(result.cardInfo?.rarity && {
                rarity: result.cardInfo.rarity,
              }),
            };
          })
          .map((item) => (
            <li
              key={item.id}
              className="cursor-pointer px-3 py-2 hover:bg-slate-50 flex justify-between items-center"
              onClick={() =>
                onChange({
                  name: item.name,
                  type: item.type,
                  ...(item.code && { code: item.code }),
                  ...(item.rarity && { rarity: item.rarity }),
                })
              }
            >
              {/* 카드명 */}
              <span className="text-sm text-slate-800">{item.name}</span>

              {/* 코드 + 레어도 */}
              <span className="text-xs text-slate-500 flex gap-2">
                {item.code && <span>{item.code}</span>}
                {item.rarity && (
                  <span className="font-medium">{item.rarity}</span>
                )}
              </span>
            </li>
          ))}
      </ul>
    );
  }
}

/* -------------------- Step 2: 레어도 선택 -------------------- */

export const RARITY_OPTIONS = [
  { label: "노멀 (N)", value: Rarity.N },
  { label: "레어 (R)", value: Rarity.R },
  { label: "슈퍼 레어 (SR)", value: Rarity.SR },
  { label: "울트라 레어 (UR)", value: Rarity.UR },
  { label: "얼티메이트 레어 (UL)", value: Rarity.UL },
  { label: "프리즈마틱", value: Rarity.Prismatic },
  { label: "울트라 패러럴 (UPR)", value: Rarity.UPR },
  { label: "노멀 패러럴 (NPR)", value: Rarity.NPR },
  { label: "기타", value: Rarity.Other },
] as const;

type RarityStepProps = {
  value: Rarity;
  isCard: boolean;
  onChange: (value?: Rarity) => void;
  onPrev: () => void;
  onNext: () => void;
};

function RarityStep({
  value,
  isCard,
  onChange,
  onPrev,
  onNext,
}: RarityStepProps) {
  return (
    <div className="space-y-3 transition-opacity duration-300">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-slate-800">레어도 선택</h3>
        <span className="text-[11px] text-slate-500">2 / 5</span>
      </div>

      {isCard ? (
        <>
          <p className="text-xs text-slate-500">
            카드의 레어도를 선택해주세요.
          </p>

          <div className="flex flex-wrap gap-2">
            {RARITY_OPTIONS.map(({ label, value: rarityValue }) => {
              const rarityInput = value ? Rarity[value] : Rarity.N;
              const active = rarityInput === rarityValue;

              return (
                <button
                  key={rarityValue}
                  type="button"
                  onClick={() => onChange(active ? undefined : rarityValue)}
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

/* ---------------------------- Step 3: 수량 입력 ----------------------------- */

type QuantityStepProps = {
  value: number;
  onChange: (value: number) => void;
  onPrev: () => void;
  onNext: () => void;
};

function QuantityStep({ value, onChange, onPrev, onNext }: QuantityStepProps) {
  return (
    <div className="space-y-3 transition-opacity duration-300">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-slate-800">수량 입력</h3>
        <span className="text-[11px] text-slate-500">3 / 5</span>
      </div>
      <p className="text-xs text-slate-500">
        판매할 수량을 입력해주세요. (기본값 1개)
      </p>

      <input
        type="number"
        min={1}
        value={value ?? 1}
        onChange={(e) => onChange(Math.max(1, Number(e.target.value) || 1))}
        className="w-24 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-300"
      />

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

/* ----------------------- Step 4: 가격(1개당) 입력 ----------------------- */

type PriceStepProps = {
  value: number;
  onChange: (value: number) => void;
  onPrev: () => void;
  onNext: () => void;
};

function PriceStep({ value, onChange, onPrev, onNext }: PriceStepProps) {
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
          value={value ?? 0}
          onChange={(e) => onChange(Math.max(0, Number(e.target.value) || 0))}
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

/* ------------------------- Step 5: 상태 & 상세 설명 ------------------------ */

type ConditionAndDetailStepProps = {
  condition: string;
  detail: string;
  onChange: (partial: Partial<ListingItemDraft>) => void;
  onPrev: () => void;
  onSave: () => void;
};

function ConditionAndDetailStep({
  condition,
  detail,
  onChange,
  onPrev,
  onSave,
}: ConditionAndDetailStepProps) {
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
          value={condition}
          onChange={(e) => {
            const next = e.target.value;

            // 지금 상태가 기본값인 시점에서, 사용자가 뭔가 바꾸려고 하면
            if (condition === defaultStatus) {
              // → 그냥 통째로 비워버림
              onChange({ condition: "" });
            } else {
              // 이미 기본값이 아니면, 그대로 입력값 반영
              onChange({ condition: next });
            }
          }}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-300"
        />
      </div>

      {/* 상세 설명 */}
      <div className="space-y-1">
        <label className="text-xs text-slate-600">상세 설명</label>
        <textarea
          value={detail}
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
          onClick={onSave}
          className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-medium text-white hover:bg-slate-800"
        >
          이 매물 저장하고 다음 매물 추가
        </button>
      </div>
    </div>
  );
}
