import { ItemSearchResponse, ListingItemType } from "@/lib/api/listings/types";
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
};

type InputItemNameProps = {
  value: InputItemNameValue;
  actions: InputItemNameActions;
};

export function InputItemName({ value, actions }: InputItemNameProps) {
  const { item } = value;
  const { updateItemDraft } = actions;
  const [searchResult, setSearchResult] = useState<ItemSearchInfo[]>([]);

  const [isSearching, setIsSearching] = useState(false);
  const resetSearch = () => {
    setIsSearching(false);
    setSearchResult([]);
  };
  const onClickSearchItem = ({ name, id }: ItemSearchInfo) => {
    updateItemDraft({ name, itemId: id });
    resetSearch();
  };

  async function searchQuery(value: string) {
    const result = await searchItemByname({ query: value });
    if (result && result.length > 0) setSearchResult([...result]);
    else if (result.length === 0) {
      updateItemDraft({ name: value });
    }
  }

  useEffect(() => {
    if (item.name.length === 0) {
      setIsSearching(false);
      setSearchResult([]);
      return;
    }
    let timer: NodeJS.Timeout;
    if (isSearching) {
      timer = setTimeout(() => {
        // query가 바뀐 후 300ms 동안 추가 입력이 없으면 실행
        setIsSearching(true);
        searchQuery(item.name);
        updateItemDraft({ name: item.name });
      }, 300);
    } else {
      setIsSearching(true);
    }
    return () => clearTimeout(timer);

    // query가 다시 바뀌면 이전 타이머 취소
  }, [item.name]);
  return (
    <div className="space-y-3 transition-opacity duration-300">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-slate-800">
          품목 종류 & 카드명
        </h3>
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
          value={item.name}
          onChange={(e) => {
            updateItemDraft({ name: e.target.value });
          }}
          placeholder={"예) 푸른 눈의 백룡, 섬도희 파츠"}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-300"
        />
        {isSearching && (
          <SearchResultViewer
            results={searchResult}
            onChange={onClickSearchItem}
          />
        )}
      </div>
    </div>
  );
}

type SearchResultViewerProps = {
  results: ItemSearchResponse[];
  onChange: ({ name, id }: ItemSearchInfo) => void;
};

function SearchResultViewer({ results, onChange }: SearchResultViewerProps) {
  if (results.length === 0) return null;

  return (
    <ul className="max-h-32 overflow-y-scroll border border-slate-200 bg-white text-xs shadow-sm">
      {results.map((item) => (
        <li
          key={item.id}
          className="cursor-pointer px-3 py-2 hover:bg-slate-50 flex justify-between items-center"
          onClick={() =>
            onChange({
              name: item.name,
              id: item.id,
            })
          }
        >
          {/* 카드명 */}
          <span className="text-sm text-slate-800">{item.name}</span>
        </li>
      ))}
    </ul>
  );
}
