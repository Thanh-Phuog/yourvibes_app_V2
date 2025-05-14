export interface GetUserNonFriendsModel {
    id: string;
    family_name: string;
    name: string;
    avatar_url: string;
    is_send_friend_request: boolean;
}

export interface GetUserNonFriendsRequestModel {
    user_id?: string;
    limit?: number;
    page?: number;
}