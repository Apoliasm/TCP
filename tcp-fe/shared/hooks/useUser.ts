import { useQuery } from "@tanstack/react-query";
import { LoginUser } from "../../features/user/types/types";

let defaultUser: LoginUser = {
  listings: [],
  nickName: "로그인이 필요합니다.",
  userId: null,
  subscribeItems: [],
  profileImageUrl: null,
};

async function login(id: number = 1): Promise<LoginUser> {
  return {
    listings: [1, 2],
    nickName: "developer",
    userId: 1,
    subscribeItems: [1, 2],
    profileImageUrl: "",
  };
}

export function useUser(user: LoginUser = defaultUser) {
  return useQuery({
    queryKey: ["user"],
    queryFn: () => login(),
    staleTime: Infinity,
    gcTime: 1000 * 600,
  });
}
