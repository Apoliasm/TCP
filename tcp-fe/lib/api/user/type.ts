import { ItemSearchResponse, ListingResponse, ListingSummary } from "../listings/types";

export type UserInfoResponse = {
  listings: ListingSummary[];
  subscribedItems: ItemSearchResponse[];
}