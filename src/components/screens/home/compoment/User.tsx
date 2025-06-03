import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  Animated,
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { defaultFriendRepo } from "@/src/api/features/friends/FriendRepo";
import useColor from "@/src/hooks/useColor";
import { useAuth } from "@/src/context/auth/useAuth";
import { Image } from "expo-image";
import { router } from "expo-router";
import UserProfileViewModel from "../../profile/viewModel/UserProfileViewModel";
import { Button } from "@ant-design/react-native";
import { AntDesign, Entypo, FontAwesome5 } from "@expo/vector-icons";
import FriendRequestAndUserViewModel from "../viewModel/FriendAndBirthViewModel";
import { GetUserNonFriendsModel } from "@/src/api/features/friends/models/GetUserNonFriends";

const UserNonFriend = ({ limit }: { limit?: number }) => {
  const { user, localStrings } = useAuth();
  const { brandPrimary, backgroundColor, lightGray } = useColor();
  const {
    sendFriendRequest,
    cancelFriendRequest,
  } = UserProfileViewModel();

  const {
    userNonFriend,
    setUserNonFriend, // Cần chắc chắn có hàm này trong ViewModel hoặc quản lý ở đây
    loadingNonFriend,
    loadMoreNonFriend,
    onRefreshNonFriend,
    fetchUserNonFriend,
    onViewableItemsChanged,
  } = FriendRequestAndUserViewModel(defaultFriendRepo);

  const limitedData = limit ? userNonFriend.slice(0, limit) : userNonFriend;

  useEffect(() => {
    if (user) {
      fetchUserNonFriend();
    }
  }, []);

const renderButtonFriendRequest = useCallback(
  (item: GetUserNonFriendsModel) => {
    const isSendFriendRequest = item?.is_send_friend_request;

    const onPressHandler = async () => {
      try {
        if (isSendFriendRequest && cancelFriendRequest) {
          await cancelFriendRequest(item.id);
        } else if (!isSendFriendRequest && sendFriendRequest) {
          await sendFriendRequest(item.id);
        }

        // Cập nhật UI local ngay lập tức
        setUserNonFriend((prev) =>
          prev.map((user) =>
            user.id === item.id
              ? { ...user, is_send_friend_request: !isSendFriendRequest }
              : user
          )
        );
      } catch (error) {
        console.error("Error updating friend request:", error);
      }
    };

    if (isSendFriendRequest) {
      // Button: Đã gửi lời mời => Hủy
      return (
        <Button
          type="ghost"
          onPress={onPressHandler}
          style={{
            backgroundColor: backgroundColor,
            borderColor: brandPrimary,
            borderWidth: 1,
            width: 130,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Entypo name="cross" size={18} color={brandPrimary} />
            <Text
              style={{
                color: brandPrimary,
                fontSize: 14,
              }}
            >
              {localStrings.Public.CancelFriendRequest}
            </Text>
          </View>
        </Button>
      );
    }

    // Button: Chưa gửi lời mời => Kết bạn
    return (
      <Button
        type="primary"
        onPress={onPressHandler}
        style={{
          backgroundColor: brandPrimary,
          width: 130,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <FontAwesome5 name="user-plus" size={15} color={backgroundColor} />
          <Text
            style={{
              color: backgroundColor,
              fontSize: 14,
              marginLeft: 8,
            }}
          >
            {localStrings.Public.AddFriend}
          </Text>
        </View>
      </Button>
    );
  },
  [cancelFriendRequest, sendFriendRequest, setUserNonFriend, brandPrimary, backgroundColor, localStrings]
);

  return (
    <View>
      {loadingNonFriend ? (
        <View style={{ paddingVertical: 10, alignItems: "center" }}>
          <ActivityIndicator size="large" color={brandPrimary} />
        </View>
      ) : userNonFriend.length > 0 ? (
        <FlatList
          data={limitedData}
          keyExtractor={(item) => item.id.toString()}
          extraData={userNonFriend}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                padding: 12,
                marginVertical: 2,
                backgroundColor: backgroundColor,
                borderRadius: 10,
                shadowColor: "#ff1f5",
                elevation: 6,
              }}
              activeOpacity={0.8}
              onPress={() => router.push(`/(tabs)/user/${item.id}`)}
            >
              <Image
                source={{ uri: item.avatar_url }}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  borderWidth: 2,
                  borderColor: lightGray || "#FF6699",
                  marginRight: 12,
                }}
              />
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text
                  style={{
                    fontWeight: "600",
                    fontSize: 15,
                    color: brandPrimary,
                  }}
                >
                  {item.family_name + " " + item.name}
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "auto",
                  }}
                >
                  {renderButtonFriendRequest(item)}
                </View>
              </View>
            </TouchableOpacity>
          )}
          onEndReachedThreshold={0.5}
          onEndReached={loadMoreNonFriend}
          refreshing={loadingNonFriend}
          onRefresh={onRefreshNonFriend}
          showsVerticalScrollIndicator={false}
          removeClippedSubviews={true}
          onViewableItemsChanged={onViewableItemsChanged.current}
          viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
        />
      ) : (
        <View style={{ paddingVertical: 10 }}>
          <Text style={{ color: lightGray, fontSize: 13, textAlign: "center" }}>
            {localStrings.Public.UserNotFound}
          </Text>
        </View>
      )}
    </View>
  );
};

export default UserNonFriend;
