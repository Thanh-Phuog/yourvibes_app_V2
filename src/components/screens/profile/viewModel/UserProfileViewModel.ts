import { FriendStatus } from "@/src/api/baseApiResponseModel/baseApiResponseModel";
import { UserModel } from "@/src/api/features/authenticate/model/LoginModel";
import { PostResponseModel } from "@/src/api/features/post/models/PostResponseModel";
import { defaultPostRepo } from "@/src/api/features/post/PostRepo";
import { defaultProfileRepo } from "@/src/api/features/profile/ProfileRepository";
import { useAuth } from "@/src/context/auth/useAuth";
import { useEffect, useRef, useState } from "react";
import Toast from "react-native-toast-message";
import { FriendResponseModel } from "@/src/api/features/profile/model/FriendReponseModel";

const UserProfileViewModel = () => {
  const { localStrings } = useAuth();
  const [posts, setPosts] = useState<PostResponseModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const limit = 10;
  const [userInfo, setUserInfo] = useState<UserModel | null>(null);
  const [sendRequestLoading, setSendRequestLoading] = useState(false);
  const [newFriendStatus, setNewFriendStatus] = useState<FriendStatus | undefined>(undefined);
  const [search, setSearch] = useState<string>("");
  const [friends, setFriends] = useState<FriendResponseModel[]>([]);
  const [friendCount, setFriendCount] = useState(0);
  const [resultCode, setResultCode] = useState(0);
  const [visibleItems, setVisibleItems] = useState<string[]>([]);

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    const visibleIds = viewableItems.map((item: any) => item.item.id);
    setVisibleItems(visibleIds);
  });

  const fetchUserPosts = async (newPage: number = 1) => {
    try {
      setLoading(true);
      const response = await defaultPostRepo.getPosts({
        user_id: userInfo?.id,
        sort_by: 'created_at',
        isDescending: true,
        page: newPage,
        limit: limit,
      });
      if (response?.data) {
        if (newPage === 1) {
          setPosts(response?.data);
        } else {
          setPosts((prevPosts) => [...prevPosts, ...response?.data]);
        }
        const { page: currentPage, limit: currentLimit, total: totalRecords } = response?.paging;

        setTotal(totalRecords);
        setPage(currentPage);
        setHasMore(currentPage * currentLimit < totalRecords);
      } else {
        setPosts([]);
        setTotal(0);
      }
    } catch (error: any) {
      console.error(error);
      Toast.show({
        type: 'error',
        text1: localStrings.Profile.Posts.GetPostsFailed,
        text2: error?.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProfile = async (id: string) => {
    try {
      setProfileLoading(true);
      const response = await defaultProfileRepo.getProfile(id);
      if (response?.data) {
        setUserInfo(response?.data);
        setResultCode(response?.code);
        setNewFriendStatus(response?.data?.friend_status || FriendStatus.NotFriend);
      } else {
        Toast.show({
          type: 'error',
          text1: localStrings.Profile.Info.GetInfoFailed,
          text2: response?.error?.message,
        });
        setUserInfo(null);
      }
    } catch (error: any) {
      console.error(error);
      Toast.show({
        type: 'error',
        text1: localStrings.Profile.Info.GetInfoFailed,
        text2: error?.message,
      });
    } finally {
      setProfileLoading(false);
    }
  }

  const loadMorePosts = () => {
    if (!loading && hasMore) {
      setPage((prevPage) => prevPage + 1);
      fetchUserPosts(page + 1);
    }
  };

  const sendFriendRequest = async (id: string) => {
    try {
      setSendRequestLoading(true);
      const response = await defaultProfileRepo.sendFriendRequest(id);
      if (!response?.error) {
        Toast.show({
          type: 'success',
          text1: localStrings.Profile.Friend.SendRequestSuccess,
        });
        setNewFriendStatus(FriendStatus.SendFriendRequest);
      } else {
        Toast.show({
          type: 'error',
          text1: localStrings.Profile.Friend.SendRequestFailed,
          text2: response?.error?.message,
        });
      }
    } catch (error: any) {
      console.error(error);
      Toast.show({
        type: 'error',
        text1: localStrings.Profile.Friend.SendRequestFailed,
        text2: error?.message,
      });
    } finally {
      setSendRequestLoading(false);
    }
  }

  const cancelFriendRequest = async (id: string) => {
    try {
      setSendRequestLoading(true);
      const response = await defaultProfileRepo.cancelFriendRequest(id);
      if (!response?.error) {
        Toast.show({
          type: 'success',
          text1: localStrings.Profile.Friend.CancelRequestSuccess,
        });
        setNewFriendStatus(FriendStatus.NotFriend);
      } else {
        Toast.show({
          type: 'error',
          text1: localStrings.Profile.Friend.CancelRequestFailed,
          text2: response?.error?.message,
        });
      }
    } catch (error: any) {
      console.error(error);
      Toast.show({
        type: 'error',
        text1: localStrings.Profile.Friend.CancelRequestFailed,
        text2: error?.message,
      });
    } finally {
      setSendRequestLoading(false);
    }
  }

  const refuseFriendRequest = async (id: string) => {
    try {
      setSendRequestLoading(true);
      const response = await defaultProfileRepo.refuseFriendRequest(id);
      if (!response?.error) {
        Toast.show({
          type: 'success',
          text1: localStrings.Profile.Friend.FriendResponseSuccess,
        });
        setNewFriendStatus(FriendStatus.NotFriend);
      } else {
        Toast.show({
          type: 'error',
          text1: localStrings.Profile.Friend.FriendResponseFailed,
          text2: response?.error?.message,
        });
      }
    } catch (error: any) {
      console.error(error);
      Toast.show({
        type: 'error',
        text1: localStrings.Profile.Friend.FriendResponseFailed,
        text2: error?.message,
      });
    } finally {
      setSendRequestLoading(false);
    }
  }

  const acceptFriendRequest = async (id: string) => {
    try {
      setSendRequestLoading(true);
      const response = await defaultProfileRepo.acceptFriendRequest(id);
      if (!response?.error) {
        Toast.show({
          type: 'success',
          text1: localStrings.Profile.Friend.FriendResponseSuccess,
        });
        setNewFriendStatus(FriendStatus.IsFriend);
        fetchUserProfile(id);
      } else {
        Toast.show({
          type: 'error',
          text1: localStrings.Profile.Friend.FriendResponseFailed,
          text2: response?.error?.message,
        });
      }
    } catch (error: any) {
      console.error(error);
      Toast.show({
        type: 'error',
        text1: localStrings.Profile.Friend.FriendResponseFailed,
        text2: error?.message,
      });
    } finally {
      setSendRequestLoading(false);
    }
  }

  const unFriend = async (id: string) => {
    try {
      setSendRequestLoading(true);
      const response = await defaultProfileRepo.unfriend(id);
      if (!response?.error) {
        Toast.show({
          type: 'success',
          text1: localStrings.Profile.Friend.UnfriendSuccess,
        });
        setNewFriendStatus(FriendStatus.NotFriend);
        fetchUserProfile(id);

      } else {
        Toast.show({
          type: 'error',
          text1: localStrings.Profile.Friend.UnfriendFailed,
          text2: response?.error?.message,

        });
      }
    } catch (error: any) {
      console.error(error);
      Toast.show({
        type: 'error',
        text1: localStrings.Profile.Friend.UnfriendFailed,
        text2: error?.message,
      });
    } finally {
      setSendRequestLoading(false);
    }
  }

  const fetchFriends = async (page: number, userID = userInfo?.id) => {
    try {
      const response = await defaultProfileRepo.getListFriends({
        page: page,
        limit: 10,
        user_id: userID,
      });
      if (response?.message === "Success") {
        if (Array.isArray(response?.data)) {
          const friends = response?.data.map(
            (friendResponse: FriendResponseModel) => ({
              id: friendResponse.id,
              family_name: friendResponse.family_name,
              name: friendResponse.name,
              avatar_url: friendResponse.avatar_url,
            })
          ) as FriendResponseModel[];
          setFriends(friends);
          setFriendCount(response?.paging?.total);
        } else {
          setFriends([]);
          setFriendCount(0);
        }
      }
      return friends;
    }
    catch (error: any) {
      console.error(error);
      Toast.show({
        type: "error",
        text1: error?.message || "Không có dữ liệu phản hồi từ server.",
      });
    }
  }

  useEffect(() => {
    if (userInfo) {
      fetchUserPosts();
      fetchFriends(1);
    }
  }, [userInfo]);

  return {
    loading,
    profileLoading,
    posts,
    hasMore,
    loadMorePosts,
    fetchUserPosts,
    total,
    fetchUserProfile,
    userInfo,
    sendFriendRequest,
    sendRequestLoading,
    refuseFriendRequest,
    cancelFriendRequest,
    newFriendStatus,
    setNewFriendStatus,
    acceptFriendRequest,
    unFriend,
    search,
    setSearch,
    friends,
    friendCount,
    page,
    fetchFriends,
    resultCode,
    setResultCode,
    onViewableItemsChanged,
    visibleItems
  }
}

export default UserProfileViewModel