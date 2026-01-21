import { UserInfoResponse } from "./type";

export async function fetchUserInfo(userId: number) : Promise<UserInfoResponse> {
    return await fetch(`/api/user/userInfo/${userId}`).then((res) => res.json())
}
