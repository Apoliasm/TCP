import { ItemInfoResponseDto, ListingItemType } from "@/lib/api/listings/types";
import { ItemSearchInfo, ListingItemDraft, Rarity } from "../../../types/types";
import { useEffect, useState } from "react";
import { searchItemByname } from "@/lib/api/listings/queries";

const typeOptions = [
  { label: "카드", value: ListingItemType.CARD },
  { label: "악세사리", value: ListingItemType.ACCESSORY },
  { label: "기타", value: ListingItemType.OTHER },
] as const;

/** 🔹 value / actions 타입 정의 */
type InputItemNameValue = {
  item: ListingItemDraft;
};

type InputItemNameActions = {
  updateItemDraft: (partial: Partial<ListingItemDraft>) => void;
  goNext: () => void;
};

type InputItemNameProps = {
  value: InputItemNameValue;
  actions: InputItemNameActions;
};

export function InputItemName({ value, actions }: InputItemNameProps) {
  const { item } = value;
  const { updateItemDraft, goNext } = actions;

  const [isInput, setIsInput] = useState<boolean>(false);
  const [searchResult, setSearchResult] = useState<ItemInfoResponseDto[]>([]);
  const [query, setQuery] = useState("");
  const [cardCode, setCardCode] = useState("");

  const onClick = ({ name, code, rarity }: ItemSearchInfo) => {
    setIsInput(true);
    setQuery(name);
    if (code) setCardCode(code);
    updateItemDraft({ rarity: rarity as Rarity, cardName: name });
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
              onClick={() => updateItemDraft({ type: value })}
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
              // 필요하다면 updateItemDraft({ cardCode: e.target.value }) 같은 것도 가능
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
          onClick={goNext}
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
  onChange: ({ name, type, code, rarity }: ItemSearchInfo) => void;
};

function SearchResultViewer({ results, onChange }: SearchResultViewerProps) {
  if (results.length === 0) return null;

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
            name,
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
