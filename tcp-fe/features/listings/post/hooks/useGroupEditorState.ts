// post/hooks/imageItemEditor/useGroupEditorState.ts
import { useReducer } from "react";
import {
  GroupEditorState,
  ListingItemDraft,
  EditorStep,
  ItemEditAction,
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

function createEmptyItemDraft(base?: {
  localImageId: string | null;
  listingImageId: number | null;
}): ListingItemDraft {
  const common: ListingItemDraft = {
    name: "",
    detailText: "",
    pricePerUnit: 0,
    quantity: 1,
    unit: 1,
    itemId: null,
    localImageId: base ? base.localImageId : null,
    listingImageId: base ? base.listingImageId : null,
  };

  return { ...common } as ListingItemDraft;
}

function initGroupEditorState(
  imageLocalId: string,
  imageId: number
): GroupEditorState {
  return {
    editAction: "ADD",
    imageLocalId,
    imageId,
    itemDraft: createEmptyItemDraft({
      listingImageId: imageId,
      localImageId: imageLocalId,
    }),
  };
}

function initItemDraft(
  state: GroupEditorState,
  editAction: ItemEditAction
): GroupEditorState {
  return {
    ...state,
    itemDraft:
      state.itemDraft.listingImageId && state.itemDraft.localImageId
        ? createEmptyItemDraft({
            localImageId: state.imageLocalId,
            listingImageId: state.imageId,
          })
        : createEmptyItemDraft(),
  };
}

function reducer(state: GroupEditorState, action: Action): GroupEditorState {
  switch (action.action) {
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
        itemDraft: action.item,
      };
    case "SET_ACTION_DELETE":
      return state;
    default:
      return state;
  }
}

export function useGroupEditorState(imageLocalId: string, imageId: number) {
  const [state, dispatch] = useReducer(
    reducer,
    initGroupEditorState(imageLocalId, imageId)
  );

  const setItem = (item: Partial<ListingItemDraft>) =>
    dispatch({ action: "SET_ITEM", item: item });
  const setAdd = () => dispatch({ action: "SET_ACTION_ADD" });
  const setUpdate = (item: ListingItemDraft) =>
    dispatch({ action: "SET_ACTION_UPDATE", item });
  const setType = (itemType: ListingItemType) =>
    dispatch({ action: "SET_TYPE", itemType });
  return {
    state,
    setItem,
    setAdd,
    setUpdate,
    setType,
  };
}

export type GroupEditor = ReturnType<typeof useGroupEditorState>;
