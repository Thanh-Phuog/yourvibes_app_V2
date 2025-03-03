import { PostResponseModel } from "@/src/api/features/post/models/PostResponseModel";
import { defaultPostRepo } from "@/src/api/features/post/PostRepo";
import { useAuth } from "@/src/context/auth/useAuth";
import { useState, useEffect, useCallback, useRef } from "react";
import Toast from "react-native-toast-message";
import { defaultProfileRepo } from "@/src/api/features/profile/ProfileRepository";
import { FriendResponseModel } from "@/src/api/features/profile/model/FriendReponseModel";

const ProfileViewModel = () => {
  const { user, localStrings, onUpdateProfile } = useAuth();
  const [posts, setPosts] = useState<PostResponseModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const limit = 10;
  const [friends, setFriends] = useState<FriendResponseModel[]>([]);
  const [friendCount, setFriendCount] = useState(0);
  const [search, setSearch] = useState<string>("");
  const [profileLoading, setProfileLoading] = useState(false);
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
        user_id: user?.id,
        sort_by: "created_at",
        isDescending: true,
        page: newPage,
        limit: limit,
      });

      if (!response?.error) {
        if (newPage === 1) {
          setPosts(response?.data);
        } else {
          setPosts((prevPosts) => [...prevPosts, ...response?.data]);
        }
        const {
          page: currentPage,
          limit: currentLimit,
          total: totalRecords,
        } = response?.paging;

        setTotal(totalRecords);
        setPage(currentPage);
        setHasMore(currentPage * currentLimit < totalRecords);
      } else {
        setPosts([]);
      }
    } catch (error: any) {
      console.error(error);
      Toast.show({
        type: "error",
        text1: localStrings.Profile.Posts.GetPostsFailed,
        text2: error?.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const loadMorePosts = () => {
    if (!loading && hasMore) {
      setPage((prevPage) => prevPage + 1);
      fetchUserPosts(page + 1);
    }
  };

  const fetchMyFriends = async (page: number) => {
    try {
      const response = await defaultProfileRepo.getListFriends({
        page: page,
        limit: 10,
        user_id: user?.id,
      });
      if (response?.data) {
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
        }
        else {
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
    if (user) {
      fetchMyFriends(page);
    }
  }, [page]);

  //Privacy setting
  const fetchUserProfile = async (id: string) => {
    try {
      setProfileLoading(true);
      const response = await defaultProfileRepo.getProfile(id);
      if (!response?.error) {
        setResultCode(response?.code);
      } else {
        Toast.show({
          type: 'error',
          text1: localStrings.Profile.Info.GetInfoFailed,
          text2: response?.error?.message,
        });
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

  return {
    loading,
    posts,
    hasMore,
    loadMorePosts,
    fetchUserPosts,
    total,
    search,
    setSearch,
    friends,
    friendCount,
    page,
    fetchMyFriends,
    profileLoading,
    fetchUserProfile,
    resultCode,
    onViewableItemsChanged,
    visibleItems
  };
};

export default ProfileViewModel;
