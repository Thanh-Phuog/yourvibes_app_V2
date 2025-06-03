import { useEffect, useState, useCallback } from "react";
import { useActionSheet } from "@expo/react-native-action-sheet"; // Import useActionSheet
import Toast from "react-native-toast-message";

import { useAuth } from "@/src/context/auth/useAuth";
import { defaultProfileRepo } from "@/src/api/features/profile/ProfileRepository";
import { FriendResponseModel } from "@/src/api/features/profile/model/FriendReponseModel";
import UserProfileViewModel from "../../profile/viewModel/UserProfileViewModel";

const useListFriendsViewModel = (userId?: string) => {
  const [selectedFriendName, setSelectedFriendName] = useState<string>("");
  const {user, localStrings } = useAuth();
  const [search, setSearch] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [friends, setFriends] = useState<FriendResponseModel[]>([]);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [friendCount, setFriendCount] = useState<number>(0);
  const getFriendCount = () => friendCount;
  const [otherUserFriends, setOtherUserFriends] = useState<FriendResponseModel[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const {fetchUserProfile} = UserProfileViewModel();

  const fetchFriends = async (page: number, userId?: string) => {

    try {
      setLoading(true);
      const response = await defaultProfileRepo.getListFriends({
        limit: 15,
        page: page,
        user_id: userId,
      });
      if (response?.data ) {
       if (page === 1) {
          setFriends(response?.data || []);}
        else {
          setFriends((prevFriends) => [...prevFriends, ...(response?.data || [])]);
        }
          setFriendCount(friends.length); //Đếm số lượng bạn bè
          const { page: currentPage, limit: currentLimit, total: totalRecords } = response?.paging;
          setPage(currentPage);
          setHasMore(currentPage * currentLimit < totalRecords);
        } else {
         console.log("Không có bạn bè nào.");
         setFriends([]);
         
        }
    } catch (error: any) {
      console.error(error);
      Toast.show({
        type: "error",
        text2: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredFriends = friends.filter((friend) =>
    friend?.name?.toLowerCase().includes(search.toLowerCase())
  );

  const handleEndReached = (userId?: string) => {
    if (!loading && hasMore) {
      
      setPage((prevPage) => prevPage + 1);
      fetchFriends(page + 1, userId);
    }
  };

  const { showActionSheetWithOptions } = useActionSheet();

  const handleMoreOptions = useCallback(
    (friend: FriendResponseModel) => {
      setSelectedFriendName(friend.name || "");
      const options = [
        `${localStrings.ListFriends.Unfriend}`,
        `${localStrings.ListFriends.ViewProfile}`,
        `${localStrings.ListFriends.Block}`,
        `${localStrings.ListFriends.Cancel}`,
      ];

      const cancelButtonIndex = options.length - 1;

      showActionSheetWithOptions(
        {
          title: `${friend.name}`,
          options,
          cancelButtonIndex,
          cancelButtonTintColor: "#F95454",
        },
        (buttonIndex) => {
          switch (buttonIndex) {
            case 0: // Hủy kết bạn
              console.log(`Hủy kết bạn với ${friend.name}`);
              // Hiện thông báo tổng quan
              Toast.show({
                text1: `Bạn đã hủy kết bạn với ${friend.name}`,
                text2: "Bạn có thể tìm kiếm lại bạn bè ở YourVibes.",
              });
              break;

            case 1: // Xem trang cá nhân
              console.log(`Xem trang cá nhân của ${friend.name}`);
              break;

            case 2: // Chặn
              console.log(`Chặn ${friend.name}`);
              // Hiện thông báo tổng quan
              Toast.show({
                text1: `Bạn đã chặn ${friend.name}`,
                text2: "Bạn sẽ không nhận được thông báo từ người này.",
              });
              break;

            default:
              // Không có hành động nào được chọn
              break;
          }
        }
      );
    },
    [localStrings, showActionSheetWithOptions]
  );

  return {
    search,
    setSearch,
    loading,
    friends: filteredFriends,
    handleEndReached,
    hasMore,
    page,
    handleMoreOptions,
    friendCount,
    getFriendCount,
    fetchFriends,
  };
};

export default useListFriendsViewModel;