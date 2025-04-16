export interface GetBirthdayFriendsModel {
    id: string;
    family_name: string;
    name: string;
    avatar_url: string;
    birthday: string;
}

export interface GetBirthdayFriendsRequestModel {
    user_id?: string;
    limit?: number;
    page?: number;
}