// post/hooks/imageItemEditor/useGroupEditorState.ts
import { useReducer } from "react";
import {
  GroupEditorState,
  ListingItemDraft,
  EditorStep,
  Rarity,
  ItemEditAction,
  ListingItemCommon,
  ListingItemCard,
  RARITY,
} from "../types/types";
import { ListingItemType } from "@/lib/api/listings/types";

export const defaultCondition = "거의 새 것";

type Action =
  | {
      action: "SET_TYPE";
      itemType: ListingItemType;
    }
  | { action: "SET_STEP"; step: EditorStep }
  | { action: "NEXT_STEP" }
  | { action: "PREV_STEP" }
  | { action: "SET_ITEM"; item: Partial<ListingItemDraft> }
  | { action: "SET_ACTION_ADD" }
  | { action: "SET_ACTION_UPDATE"; item: ListingItemDraft }
  | { action: "SET_ACTION_DELETE" }; // 🔥 부분 업데이트

function createEmptyItemDraft(
  itemType: ListingItemType,
  base?: Partial<Pick<ListingItemCommon, "localId" | "listingImageId">>
): ListingItemDraft {
  const common = {
    name: "",
    condition: "",
    detail: "",
    pricePerUnit: 0,
    quantity: 1,
    localId: base?.localId ?? "",
    listingImageId: base?.listingImageId ?? -1,
    infoId: undefined,
  };

  switch (itemType) {
    case ListingItemType.CARD:
      return {
        ...common,
        type: ListingItemType.CARD,
        cardCode: "",
        rarity: RARITY.N,
      };
    case ListingItemType.ACCESSORY:
      return { ...common, type: ListingItemType.ACCESSORY };
    case ListingItemType.OTHER:
      return { ...common, type: ListingItemType.OTHER };
  }
}

function initGroupEditorState(imageLocalId: string): GroupEditorState {
  return {
    editAction: "ADD",
    imageLocalId,
    step: 1 as EditorStep,
    itemDraft: createEmptyItemDraft(ListingItemType.CARD),
  };
}

function initItemDraft(
  state: GroupEditorState,
  editAction: ItemEditAction,
  itemType: ListingItemType = state.itemDraft.type
): GroupEditorState {
  return {
    imageLocalId: state.imageLocalId,
    step: 1 as EditorStep,
    editAction,
    itemDraft: createEmptyItemDraft(itemType),
  };
}

function reducer(state: GroupEditorState, action: Action): GroupEditorState {
  switch (action.action) {
    case "SET_TYPE":
      return initItemDraft(state, state.editAction, action.itemType);
    case "SET_STEP":
      return { ...state, step: action.step };
    case "NEXT_STEP":
      return { ...state, step: (state.step + 1) as EditorStep };

    case "PREV_STEP":
      return { ...state, step: (state.step - 1) as EditorStep };
    case "SET_ITEM":
      return {
        ...state,
        itemDraft: {
          ...state.itemDraft,
          ...action.item,
        } as typeof state.itemDraft,
      };
    case "SET_ACTION_ADD":
      return initItemDraft(state, "ADD");
    case "SET_ACTION_UPDATE":
      return {
        ...state,
        editAction: "UPDATE",
        step: 1 as EditorStep,
        itemDraft: action.item,
      };
    case "SET_ACTION_DELETE":
      return state;
    default:
      return state;
  }
}

export function useGroupEditorState(imageLocalId: string) {
  const [state, dispatch] = useReducer(
    reducer,
    initGroupEditorState(imageLocalId)
  );

  const goNext = () => dispatch({ action: "NEXT_STEP" });
  const goPrev = () => dispatch({ action: "PREV_STEP" });
  const setStep = (step: EditorStep) => dispatch({ action: "SET_STEP", step });
  const setItem = (item: Partial<ListingItemDraft>) =>
    dispatch({ action: "SET_ITEM", item: item });
  const setAdd = () => dispatch({ action: "SET_ACTION_ADD" });
  const setUpdate = (item: ListingItemDraft) =>
    dispatch({ action: "SET_ACTION_UPDATE", item });
  const setType = (itemType: ListingItemType) =>
    dispatch({ action: "SET_TYPE", itemType });
  return {
    state,
    goNext,
    goPrev,
    setStep,
    setItem,
    setAdd,
    setUpdate,
    setType,
  };
}

export type GroupEditor = ReturnType<typeof useGroupEditorState>;
