// post/hooks/imageItemEditor/useGroupEditorState.ts
import { useReducer } from "react";
import {
  GroupEditorState,
  ListingItemDraft,
  EditorStep,
  Rarity,
  ItemEditAction,
} from "../types/types";
import { ListingItemType } from "@/lib/api/listings/types";

type Action =
  | { type: "SET_STEP"; step: EditorStep }
  | { type: "NEXT_STEP" }
  | { type: "PREV_STEP" }
  | { type: "SET_ITEM"; item: Partial<ListingItemDraft> }
  | { type: "SET_ACTION_ADD" }
  | { type: "SET_ACTION_UPDATE" }
  | { type: "SET_ACTION_DELETE" }; // 🔥 부분 업데이트

function initItemDraft(
  state: GroupEditorState,
  editAction: ItemEditAction
): GroupEditorState {
  return {
    ...state,
    step: 1,
    editAction: editAction,
    itemDraft: {
      ...state.itemDraft,
      cardName: "",
      condition: "",
      detail: "",
      pricePerUnit: 0,
      quantity: 1,
      type: ListingItemType.CARD,
      rarity: Rarity.N,
      infoId: undefined,
    },
  };
}
function reducer(state: GroupEditorState, action: Action): GroupEditorState {
  switch (action.type) {
    case "SET_STEP":
      return { ...state, step: action.step };

    case "NEXT_STEP":
      return { ...state, step: (state.step + 1) as EditorStep };

    case "PREV_STEP":
      return { ...state, step: (state.step - 1) as EditorStep };

    case "SET_ITEM":
      return {
        ...state,
        itemDraft: { ...state.itemDraft, ...action.item },
      };
    case "SET_ACTION_ADD":
      return initItemDraft(state, "ADD");
    case "SET_ACTION_UPDATE":
      return initItemDraft(state, "UPDATE");
    case "SET_ACTION_DELETE":
      return initItemDraft(state, "ADD");

    default:
      return state;
  }
}

export function useGroupEditorState(initial: GroupEditorState) {
  const [state, dispatch] = useReducer(reducer, initial);

  const goNext = () => dispatch({ type: "NEXT_STEP" });
  const goPrev = () => dispatch({ type: "PREV_STEP" });
  const setStep = (step: EditorStep) => dispatch({ type: "SET_STEP", step });
  const setItem = (item: Partial<ListingItemDraft>) =>
    dispatch({ type: "SET_ITEM", item: item });
  const setAdd = () => dispatch({ type: "SET_ACTION_ADD" });
  const setUpdate = () => dispatch({ type: "SET_ACTION_UPDATE" });

  return {
    state,
    goNext,
    goPrev,
    setStep,
    setItem,
    setAdd,
    setUpdate,
  };
}

export type GroupEditor = ReturnType<typeof useGroupEditorState>;
