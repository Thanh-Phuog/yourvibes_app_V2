import { ApiPath } from "../../ApiPath";
import { BaseApiResponseModel } from "../../baseApiResponseModel/baseApiResponseModel";
import client from "../../client";
import { GetBirthdayFriendsModel, GetBirthdayFriendsRequestModel } from "./models/GetBirthdayFriends";
import { GetUserNonFriendsModel, GetUserNonFriendsRequestModel } from "./models/GetUserNonFriends";

interface IFriendRepo {
    getUsersNonFriend(data: GetUserNonFriendsRequestModel): Promise<BaseApiResponseModel<GetUserNonFriendsModel[]>>;
     getBirthdayFriends(data: GetBirthdayFriendsRequestModel): Promise<BaseApiResponseModel<GetBirthdayFriendsModel[]>>;
}

export class FriendRepo implements IFriendRepo {
    async getUsersNonFriend(data: GetUserNonFriendsRequestModel): Promise<BaseApiResponseModel<GetUserNonFriendsModel[]>> {
        return client.get(ApiPath.NON_FRIENDS, data);
    }

    async getBirthdayFriends(data: GetBirthdayFriendsRequestModel): Promise<BaseApiResponseModel<GetBirthdayFriendsModel[]>> {
        return client.get(ApiPath.BIRTHDAY_FRIENDS, data);
    }
}

export const defaultFriendRepo = new FriendRepo();