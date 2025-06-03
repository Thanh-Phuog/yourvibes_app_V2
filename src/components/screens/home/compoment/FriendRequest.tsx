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

const FriendRequest = ({ limit }: { limit?: number }) => {
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

  
  const limitedData = limit ? incomingFriendRequests.slice(0, limit) : incomingFriendRequests;

  useEffect(() => {
    if (user) {
      fetchFriendRequests();
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
            {localStrings.Public.FriendRequests}
          </Text>
        </View>
        <View style={{ height: 1, backgroundColor: borderColor }} /> */}
        {loadingFriendRequests ? (
          <View style={{ paddingVertical: 10, alignItems: "center" }}>
            <ActivityIndicator size="large" color={brandPrimary} />
          </View>
        ) : (
          incomingFriendRequests.length > 0 && (
            <FlatList
              data={limitedData}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => {
                return (
                  <TouchableOpacity
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      padding: 12,
                      marginVertical: 6,
                      backgroundColor: backgroundColor,
                      borderRadius: 10,
                      marginHorizontal: 10,
                      shadowColor: "#ff1f5",
                      marginBottom: 16,
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
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          fontWeight: "600",
                          fontSize: 15,
                          color: brandPrimary,
                          marginBottom: 8,
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
                        }}
                      >
                        <Button
                          style={{ width: "45%", height: 30, backgroundColor: brandPrimary }}
                          type="primary"
                          onPress={() => {
                            acceptFriendRequest &&
                              acceptFriendRequest(item?.id as string);
                          }}
                          loading={sendRequestLoading}
                        >
                          <Text
                            style={{
                              color: backgroundColor,
                              fontSize: 13,
                            }}
                          >
                            {localStrings.Public.AcceptFriendRequest}
                          </Text>
                        </Button>
                        <Button
                          style={{ width: "45%", height: 30,    borderColor:borderColor,
                            borderWidth: 1, }}
                          type="ghost"
                          onPress={() => {
                            refuseFriendRequest &&
                              refuseFriendRequest(item?.id as string);
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 13,
                              color: brandPrimary,
                            }}
                          >
                            {localStrings.Public.RefuseFriendRequest}
                          </Text>
                        </Button>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              }}
              ListFooterComponent={renderFooterFriend}
              onEndReachedThreshold={0.5}
              onEndReached={loadMoreFriendRequests}
              refreshing={loadingFriendRequests}
              onRefresh={onRefreshFriendRequest}
              showsVerticalScrollIndicator={false}
              removeClippedSubviews={true}
              onViewableItemsChanged={onViewableItemsChanged.current}
              viewabilityConfig={{
                itemVisiblePercentThreshold: 50,
              }}
            />
          )
        )}
      </View>
    </View>
  );
};

export default FriendRequest;
