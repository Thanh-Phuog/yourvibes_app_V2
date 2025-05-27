import { View, Text } from "react-native";
import React, { useRef, useState } from "react";
import { FriendStatus } from "@/src/api/baseApiResponseModel/baseApiResponseModel";
import { SuggestionUserModel } from "@/src/api/features/newFeed/Model/NewFeedModel";
import { NewFeedRepo } from "@/src/api/features/newFeed/NewFeedRepo";
import { defaultProfileRepo } from "@/src/api/features/profile/ProfileRepository";
import Toast from "react-native-toast-message";
import { useAuth } from "@/src/context/auth/useAuth";

export interface FriendSuggestionWithStatus extends SuggestionUserModel {
  friendStatus?: FriendStatus;
  hidden?: boolean;
}

const friendSuggestionsViewModel = (repo: NewFeedRepo) => {
  const { localStrings } = useAuth();
  const [loading, setLoading] = useState(false);
  const [friendSuggestions, setFriendSuggestions] = useState<
    FriendSuggestionWithStatus[]
  >([]);
  const [friendRequestLoading, setFriendRequestLoading] = useState<
    Record<string, boolean>
  >({});
  const [hasMoreFriend, setHasMoreFriend] = useState(true);
  const [pageFriend, setPageFriend] = useState(1);
  const [total, setTotal] = useState(0);
  const [visibleItems, setVisibleItems] = useState<string[]>([]);
  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    const visibleIds = viewableItems.map((item: any) => item.item.id);
    setVisibleItems(visibleIds);
  });
  const fetchSuggestions = async (newPage: number = 1) => {
    try {
      setLoading(true);
      const response = await repo.getSuggestion({
        page: newPage,
        limit: 10,
      });
      if (response.code === 20001) {
        const suggestionsWithStatus = (response.data ?? []).map(
          (suggestion: SuggestionUserModel) => ({
            ...suggestion,
            friendStatus: suggestion.is_send_friend_request
              ? FriendStatus.SendFriendRequest
              : (suggestion as any).friend_status || FriendStatus.NotFriend,
            hidden: false,
          })
        );
        if (newPage === 1) {
          setFriendSuggestions(suggestionsWithStatus);
        } else {
          setFriendSuggestions((prevPosts) => [
            ...prevPosts,
            ...(suggestionsWithStatus || []),
          ]);
        }
        const {
          page: currentPage,
          limit: currentLimit,
          total: totalRecords,
        } = response?.paging;
        setPageFriend(currentPage);
        setTotal(totalRecords);
        setHasMoreFriend(currentPage * currentLimit < totalRecords);
      } else {
        throw new Error(response.message);
      }
    } catch (error: any) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = async () => {
    if (hasMoreFriend && !loading) {
      setPageFriend((prevPage) => prevPage + 1);
      fetchSuggestions(pageFriend + 1);
    }
  };

  const handleFriendRequest = async (
    userId: string,
    action: "send" | "cancel" | "accept" | "refuse"
  ) => {
    setFriendRequestLoading((prev) => ({ ...prev, [userId]: true }));
    try {
      let response;
      switch (action) {
        case "send":
          response = await defaultProfileRepo.sendFriendRequest(userId);
          if (response.code === 20001) {
            Toast.show({
              type: "success",
              text1: localStrings.Profile.Friend.SendRequestSuccess,
            });

            setFriendSuggestions((prev) =>
              prev.map((s) =>
                s.id === userId
                  ? {
                      ...s,
                      friendStatus: FriendStatus.SendFriendRequest,
                      is_send_friend_request: true,
                    }
                  : s
              )
            );
          }
          break;
        case "cancel":
          response = await defaultProfileRepo.cancelFriendRequest(userId);
          if (response.code === 20001) {
            Toast.show({
              type: "success",
              text1: `${localStrings.Public.CancelFriendRequest} success`,
            });
            setFriendSuggestions((prev) =>
              prev.map((s) =>
                s.id === userId
                  ? {
                      ...s,
                      friendStatus: FriendStatus.NotFriend,
                      is_send_friend_request: false,
                    }
                  : s
              )
            );
          }
          break;
        case "accept":
          response = await defaultProfileRepo.acceptFriendRequest(userId);
          if (response.code === 20001) {
            Toast.show({
              type: "success",
              text1: "Friend request accepted",
            });
            setFriendSuggestions((prev) =>
              prev.map((s) =>
                s.id === userId
                  ? { ...s, friendStatus: FriendStatus.IsFriend }
                  : s
              )
            );
          }
          break;
        case "refuse":
          response = await defaultProfileRepo.refuseFriendRequest(userId);
          if (response.code === 20001) {
            setFriendSuggestions((prev) =>
              prev.map((s) => (s.id === userId ? { ...s, hidden: true } : s))
            );
          }
          break;
      }
      if (response?.code !== 20001)
        throw new Error(response?.error?.message_detail || response?.message);
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: error?.message || "Action failed",
      });
    } finally {
      setFriendRequestLoading((prev) => ({ ...prev, [userId]: false }));
    }
  };

  const handleRemoveSuggestion = (userId: string) => {
    setFriendSuggestions((prev) =>
      prev.map((suggestion) =>
        suggestion.id === userId ? { ...suggestion, hidden: true } : suggestion
      )
    );
  };

  return {
    loading,
    friendSuggestions,
    fetchSuggestions,
    handleFriendRequest,
    handleRemoveSuggestion,
    friendRequestLoading,
    setFriendSuggestions,
    handleLoadMore,
    hasMoreFriend,
    pageFriend,
    onViewableItemsChanged,
    visibleItems,
  };
};

export default friendSuggestionsViewModel;
