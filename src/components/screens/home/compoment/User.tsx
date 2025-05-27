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
import { DateTransfer } from "@/src/utils/helper/DateTransfer";
import { useAuth } from "@/src/context/auth/useAuth";
import { Image } from "expo-image";
import { router, useFocusEffect } from "expo-router";
import UserProfileViewModel from "../../profile/viewModel/UserProfileViewModel";
import { Button, Modal } from "@ant-design/react-native";
import dayjs from "dayjs";
import { Entypo, FontAwesome5 } from "@expo/vector-icons";
import FriendRequestAndUserViewModel from "../viewModel/FriendAndBirthViewModel";
import { GetUserNonFriendsModel } from "@/src/api/features/friends/models/GetUserNonFriends";
import Birth from "./BirthDay";

const UserNonFriend = ({ limit }: { limit?: number }) => {
  const { user, localStrings } = useAuth();
  const { brandPrimary, backgroundColor, lightGray, borderColor } = useColor();
  const [showModalBirth, setShowModalBirth] = useState(false);
  const {
    acceptFriendRequest,
    refuseFriendRequest,
    sendRequestLoading,
    sendFriendRequest,
    cancelFriendRequest,
  } = UserProfileViewModel();
  const fadeAnimation = useRef(new Animated.Value(0)).current;
  const {
    userNonFriend,
    loadingNonFriend,
    loadMoreNonFriend,
    onRefreshNonFriend,
    fetchUserNonFriend,
    fetchFriendRequests,
    loadingFriendRequests,
    incomingFriendRequests,
    onRefreshFriendRequest,
    loadMoreFriendRequests,
    hasMoreBirthday,
    hasMoreFriendRequest,
    onViewableItemsChanged,
  } = FriendRequestAndUserViewModel(defaultFriendRepo);

  
  const limitedData = limit ? userNonFriend.slice(0, limit) : userNonFriend;
  useEffect(() => {
    if (user) {
      fetchUserNonFriend();
    }
  }, []);

  const renderFooterUser = () => {
    if (!hasMoreBirthday) return null;
    return (
      <View style={{ paddingVertical: 10, alignItems: "center" }}>
        <ActivityIndicator size="large" color={brandPrimary} />
      </View>
    );
  };

  useEffect(() => {
    Animated.timing(fadeAnimation, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const renderFooterFriend = () => {
    if (!hasMoreFriendRequest) return null;
    return (
      <View style={{ paddingVertical: 10, alignItems: "center" }}>
        <ActivityIndicator size="large" color={brandPrimary} />
      </View>
    );
  };

  const renderButtonFriendRequest = useCallback(
    (item: GetUserNonFriendsModel) => {
      const isSendFriendRequest = item?.is_send_friend_request;

      const ButtonContent = (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {isSendFriendRequest ? (
            <Entypo name="cross" size={20} color={brandPrimary} />
          ) : (
            <FontAwesome5 name="user-plus" size={12} color={brandPrimary} />
          )}
          <Text
            style={{
              color: brandPrimary,
              fontSize: 12,
              marginHorizontal: 10,
              fontWeight: "bold",
            }}
          >
            {isSendFriendRequest
              ? localStrings.Public.CancelFriendRequest
              : localStrings.Public.AddFriend}
          </Text>
        </View>
      );
      return (
        <Button
          type="ghost"
          onPress={() => {
            if (isSendFriendRequest && cancelFriendRequest) {
              cancelFriendRequest(item.id);
            } else if (!isSendFriendRequest && sendFriendRequest) {
              sendFriendRequest(item.id);
            }
          }}
        >
          {ButtonContent}
        </Button>
      );
    },
    [cancelFriendRequest, sendFriendRequest, sendRequestLoading]
  );

  return (
    <View style={{}}>
 

      <View style={{}}>
        {/* <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 5,
          }}
        >
          <Text
            style={{
              fontWeight: "700",
              fontSize: 16,
              color: brandPrimary,
              letterSpacing: 0.5,
            }}
          >
            {localStrings.Public.AllUser}
          </Text>
        </View>
        <View style={{ height: 1, backgroundColor: borderColor }} /> */}
        {loadingNonFriend ? (
          <View style={{ paddingVertical: 10, alignItems: "center" }}>
            <ActivityIndicator size="large" color={brandPrimary} />
          </View>
        ) : userNonFriend.length > 0 ? (
          <FlatList
            data={limitedData}
            keyExtractor={(item) => item.id.toString()}
            extraData={userNonFriend}
            renderItem={({ item }) => {
              return (
                <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    padding: 12,
                    marginVertical: 2,
                    backgroundColor: backgroundColor,
                    borderRadius: 10,
                    shadowColor: "#ff1f5",
                    elevation: 6, // tương đương boxShadow
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
                        display: "flex",
                        justifyContent: "space-between",
                        width: "40%",
                      }}
                    >
                      {renderButtonFriendRequest(item)}
                    </View>
                  </View>
                </TouchableOpacity>
              );
            }}
            // ListFooterComponent={renderFooterUser}
            onEndReachedThreshold={0.5}
            onEndReached={loadMoreNonFriend}
            refreshing={loadingNonFriend}
            onRefresh={onRefreshNonFriend}
            showsVerticalScrollIndicator={false}
            removeClippedSubviews={true}
            onViewableItemsChanged={onViewableItemsChanged.current}
            viewabilityConfig={{
              itemVisiblePercentThreshold: 50,
            }}
          />
        ) : (
          <View style={{ paddingVertical: 10 }}>
            <Text
              style={{ color: lightGray, fontSize: 13, textAlign: "center" }}
            >
              {localStrings.Public.UserNotFound}
            </Text>
          </View>
        )}
      </View>
        
    </View>
  );
};

export default UserNonFriend;
