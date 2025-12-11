// post/hooks/imageItemEditor/useImageItemEditorState.ts
import { useReducer } from "react";
import {
  ImageItemEditorState,
  ListingItemDraft,
  EditorStep,
} from "../types/types";
import { initItemDraft } from "../utils/const";

type Action =
  | { type: "SET_STEP"; step: EditorStep }
  | { type: "NEXT_STEP" }
  | { type: "PREV_STEP" }
  | { type: "INIT_ITEM" }
  | { type: "SET_ITEMS"; items: ListingItemDraft[] }
  | { type: "UPDATE_ITEM"; item: ListingItemDraft } // itemDraft를 특정 아이템으로 로드
  | { type: "SELECT_ITEM"; item: ListingItemDraft } // 필요 시 사용
  | { type: "SET_DRAFT"; item: Partial<ListingItemDraft> } // 🔥 부분 업데이트
  | { type: "PUSH_DRAFT"; item: ListingItemDraft } // 🔥 새 아이템 추가 or 기존 수정
  | { type: "REMOVE_ITEM"; item: ListingItemDraft };

function reducer(
  state: ImageItemEditorState,
  action: Action
): ImageItemEditorState {
  switch (action.type) {
    case "SET_STEP":
      return { ...state, step: action.step };

    case "NEXT_STEP":
      return { ...state, step: (state.step + 1) as EditorStep };

    case "PREV_STEP":
      return { ...state, step: (state.step - 1) as EditorStep };

    case "INIT_ITEM":
      return {
        ...state,
        itemDraft: { ...initItemDraft },
        isNewItem: true,
        step: 1,
      };

    case "SET_ITEMS":
      return {
        ...state,
        items: action.items,
      };

    case "SET_DRAFT":
      return {
        ...state,
        itemDraft: {
          ...state.itemDraft,
          ...action.item, // 🔥 부분 업데이트 머지
        },
      };

    case "UPDATE_ITEM":
      // 특정 아이템을 에디터에 불러와서 수정 모드 진입
      return {
        ...state,
        itemDraft: { ...action.item },
        isNewItem: false,
        step: 1,
      };

    case "SELECT_ITEM":
      return {
        ...state,
        itemDraft: { ...action.item },
        isNewItem: false,
      };

    case "PUSH_DRAFT":
      return {
        ...state,
        items: [...state.items, action.item],
        isNewItem: false,
        // 저장 후 다시 1단계로 돌려 보내거나, 유지하고 싶으면 여기서 조절
        step: 1,
      };

    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter(
          (item) => item.localItemId !== action.item.localItemId
        ),
      };

    default:
      return state;
  }
}

export function useGroupEditorState(initial: ImageItemEditorState) {
  const [state, dispatch] = useReducer(reducer, initial);

  const goNext = () => dispatch({ type: "NEXT_STEP" });
  const goPrev = () => dispatch({ type: "PREV_STEP" });
  const setStep = (step: EditorStep) => dispatch({ type: "SET_STEP", step });

  const initNewItem = () => {
    dispatch({ type: "INIT_ITEM" });
  };

  const setDraft = (itemDraft: Partial<ListingItemDraft>) =>
    dispatch({ type: "SET_DRAFT", item: itemDraft });

  const pushDraft = (itemDraft: ListingItemDraft) =>
    dispatch({ type: "PUSH_DRAFT", item: itemDraft });

  const updateItem = (item: ListingItemDraft) =>
    dispatch({ type: "UPDATE_ITEM", item });

  const removeItem = (item: ListingItemDraft) =>
    dispatch({ type: "REMOVE_ITEM", item });

  const setItems = (items: ListingItemDraft[]) =>
    dispatch({ type: "SET_ITEMS", items });

  return {
    state,
    goNext,
    goPrev,
    setStep,
    initNewItem,
    setDraft,
    pushDraft,
    updateItem,
    removeItem,
    setItems,
  };
}

export type GroupEditor = ReturnType<typeof useGroupEditorState>;
