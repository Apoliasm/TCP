import { Listing } from "@/features/listings/post/types/types";
import { ListingResponse } from "@/lib/api/listings/types";

export interface LoginUser {
  userId: number | null;
  nickName: string;
  listings: ListingResponse["id"][];
  subscribeItems: Id[];
  profileImageUrl: string | null;
}

type Id = number;
