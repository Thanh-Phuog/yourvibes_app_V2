import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  Animated,
} from "react-native";
import React, { useEffect, useRef } from "react";
import { defaultFriendRepo } from "@/src/api/features/friend/FriendRepo";
import FriendRequestAndBirthViewModel from "../viewModel/FriendRequestAndBirthViewModel";
import useColor from "@/src/hooks/useColor";
import { DateTransfer } from "@/src/utils/helper/DateTransfer";
import { useAuth } from "@/src/context/auth/useAuth";
import { Image } from "expo-image";
import { router, useFocusEffect } from "expo-router";
import UserProfileViewModel from "../../profile/viewModel/UserProfileViewModel";
import { Button } from "@ant-design/react-native";
import { LinearGradient } from "expo-linear-gradient";
import dayjs from "dayjs";

const FriendRequestAndBirth = ({ isActive }: { isActive: boolean }) => {
  const { user, localStrings } = useAuth();
  const { brandPrimary, backgroundColor, lightGray, pink } = useColor();
  const { acceptFriendRequest, refuseFriendRequest, sendRequestLoading } =
    UserProfileViewModel();
  const fadeAnimation = useRef(new Animated.Value(0)).current;
  const {
    birthdayFriends,
    loadingBirthday,
    fetchBirthdayFriends,
    onRefreshBirthday,
    loadMoreBirthdayFriends,
    fetchFriendRequests,
    loadingFriendRequests,
    incomingFriendRequests,
    onRefreshFriendRequest,
    loadMoreFriendRequests,
    hasMoreBirthday,
    hasMoreFriendRequest,
    onViewableItemsChanged,
  } = FriendRequestAndBirthViewModel(defaultFriendRepo);

  useEffect(() => {
    if (user && isActive) {
      fetchBirthdayFriends();
      fetchFriendRequests();
    }
  }, [isActive]);

  const renderFooterBirth = () => {
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
    <View style={{ flex: 1 }}>
      <View style={{ maxHeight: "50%", overflowY: "scroll" }}>
        <View
          style={{
            flexDirection: "column",
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
            {localStrings.Public.BirthdayFriend}
          </Text>
          <Text
            style={{
              fontSize: 13,
              color: "#4b5563",
              marginLeft: 10,
            }}
          >
            {localStrings.Public.HappyBirthday}
          </Text>
        </View>
        {loadingBirthday ? (
          <View style={{ paddingVertical: 10, alignItems: "center" }}>
            <ActivityIndicator size="large" color={brandPrimary} />
          </View>
        ) : birthdayFriends.length > 0 ? (
          <FlatList
            data={birthdayFriends}
            renderItem={({ item }) => {
              return (
                <>
                  <Animated.View
                    style={{
                      flex: 1,
                      opacity: fadeAnimation,
                      marginHorizontal: 10,
                      padding: 2,
                      marginVertical: 5,
                      borderRadius: 10,
                      shadowColor: "#ff1f5",
                      marginBottom: 10,
                      elevation: 6,
                    }}
                  >
                    <LinearGradient
                      colors={["#e6f0ff", "#fff1f5"]}
                      start={{ x: 0.2, y: 0 }}
                      end={{ x: 0.8, y: 1 }}
                    >
                      <TouchableOpacity
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          padding: 10,
                          marginVertical: 5,
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
                            borderColor: pink || "#FF6699",
                            marginRight: 12,
                          }}
                        />
                        <View style={{ flex: 1 }}>
                          <Text
                            style={{
                              fontWeight: "600",
                              fontSize: 15,
                              color: "#1f2937",
                            }}
                          >
                            {item.family_name + " " + item.name}
                          </Text>
                          <Text
                            style={{
                              color: "#4b5563",
                              fontSize: 13,
                              fontWeight: "500",
                              marginTop: 4,
                            }}
                          >
                            {localStrings.Public.Birthday}{" "}
                            {dayjs(item.birthday).format("DD/MM")}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </LinearGradient>
                  </Animated.View>
                </>
              );
            }}
            keyExtractor={(item) => item.id.toString()}
            ListFooterComponent={renderFooterBirth}
            onEndReached={loadMoreBirthdayFriends}
            onEndReachedThreshold={0.5}
            removeClippedSubviews={true}
            showsVerticalScrollIndicator={false}
            onRefresh={onRefreshBirthday}
            refreshing={loadingBirthday}
            onViewableItemsChanged={onViewableItemsChanged.current}
            viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
          />
        ) : (
          // </View>
          <View style={{ paddingVertical: 10 }}>
            <Text
              style={{ color: lightGray, fontSize: 13, textAlign: "center" }}
            >
              {localStrings.Public.NoBirthdays}
            </Text>
          </View>
        )}
      </View>

      <View style={{ maxHeight: "50%", overflowY: "scroll" }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 12,
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
        {loadingFriendRequests ? (
          <View style={{ paddingVertical: 10, alignItems: "center" }}>
            <ActivityIndicator size="large" color={brandPrimary} />
          </View>
        ) : incomingFriendRequests.length > 0 ? (
          <FlatList
            data={incomingFriendRequests}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => {
              return (
                <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    padding: 12,
                    marginVertical: 6,
                    backgroundColor: "#ffffff",
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
                        color: "#1f2937",
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
                        style={{ width: "45%", height: 30 }}
                        type="primary"
                        onPress={() => {
                          acceptFriendRequest &&
                            acceptFriendRequest(item?.id as string);
                        }}
                        loading={sendRequestLoading}
                      >
                        <Text
                          style={{
                            color: "#ffffff",
                            fontSize: 13,
                          }}
                        >
                          {localStrings.Public.AcceptFriendRequest}
                        </Text>
                      </Button>
                      <Button
                        style={{ width: "45%", height: 30 }}
                        type="ghost"
                        onPress={() => {
                          refuseFriendRequest &&
                            refuseFriendRequest(item?.id as string);
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 13,
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
            onEndReached={() => {
              loadMoreFriendRequests;
            }}
            refreshing={loadingFriendRequests}
            onRefresh={onRefreshFriendRequest}
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
              {localStrings.Public.NoBirthdays}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default FriendRequestAndBirth;
