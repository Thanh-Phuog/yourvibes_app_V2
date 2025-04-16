import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
} from "react-native";
import React, { useEffect } from "react";
import { defaultFriendRepo } from "@/src/api/features/friend/FriendRepo";
import FriendRequestAndBirthViewModel from "../viewModel/FriendRequestAndBirthViewModel";
import useColor from "@/src/hooks/useColor";
import { DateTransfer } from "@/src/utils/helper/DateTransfer";
import { useAuth } from "@/src/context/auth/useAuth";
import { Image } from "expo-image";
import { router, useFocusEffect } from "expo-router";
import UserProfileViewModel from "../../profile/viewModel/UserProfileViewModel";
import { Button } from "@ant-design/react-native";

const FriendRequestAndBirth = ({ isActive }: { isActive: boolean }) => {
  const { user, localStrings } = useAuth();
  const { brandPrimary, backgroundColor, lightGray, pink } = useColor();
  const { acceptFriendRequest, refuseFriendRequest, sendRequestLoading } = UserProfileViewModel();
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
    totalBirthday,
    totalFriendRequest,
    pageBirthday,
    pageFriendRequest,
    limitBirthday,
    limitFriendRequest,
    onViewableItemsChanged,
    visibleItems,
  } = FriendRequestAndBirthViewModel(defaultFriendRepo);

  useEffect(() => {
    if (user && isActive) {
      fetchBirthdayFriends();
    }
  }, [isActive]);

  const renderFooter = () => {
    if (!loadingBirthday || !hasMoreBirthday) return null;
    return (
      <View style={{ paddingVertical: 10, alignItems: "center" }}>
        <ActivityIndicator size="large" color={brandPrimary} />
      </View>
    );
  };

  return (
    <View>
      <View>
        {loadingBirthday ? (
          <View style={{ paddingVertical: 10, alignItems: "center" }}>
            <ActivityIndicator size="large" color={brandPrimary} />
          </View>
        ) : birthdayFriends.length > 0 ? (
          <View
            style={{
              // backgroundColor: "#fff1f5", // fallback vì không có linear-gradient
              borderRadius: 12,
              padding: 16,
              marginBottom: 16,
              elevation: 6, // tương đương boxShadow
            }}
          >
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
                {localStrings.Public.HappyBirthday}
              </Text>
            </View>

            <FlatList
              data={birthdayFriends}
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
                      elevation: 3, // giống boxShadow nhẹ
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
                        {DateTransfer(item.birthday)}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              }}
              ListFooterComponent={renderFooter}
              onEndReachedThreshold={0.5}
              onEndReached={() => {
                loadMoreBirthdayFriends;
              }}
              refreshing={loadingBirthday}
              onRefresh={onRefreshBirthday}
              showsVerticalScrollIndicator={false}
              removeClippedSubviews={true}
              onViewableItemsChanged={onViewableItemsChanged.current}
              viewabilityConfig={{
                itemVisiblePercentThreshold: 50,
              }}
            />
          </View>
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

      <View>
        {loadingFriendRequests ? (
          <View style={{ paddingVertical: 10, alignItems: "center" }}>
            <ActivityIndicator size="large" color={brandPrimary} />
          </View>
        ) : incomingFriendRequests.length > 0 ? (
          <View
            style={{
              // backgroundColor: "#fff1f5", // fallback vì không có linear-gradient
              borderRadius: 12,
              padding: 16,
              marginBottom: 16,
              elevation: 6, // tương đương boxShadow
            }}
          >
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
                      elevation: 3, // giống boxShadow nhẹ
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
                      <Button
                        style={{ width: "48%" }}
                        type="primary"
                        onPress={() => {
                          acceptFriendRequest &&
                            acceptFriendRequest(item?.id as string);
                        }}
                        loading={sendRequestLoading}
                      >
                        {localStrings.Public.AcceptFriendRequest}
                      </Button>
                      <Button
                        style={{ width: "48%" }}
                        type="ghost"
                        onPress={() => {
                          refuseFriendRequest &&
                            refuseFriendRequest(item?.id as string);
                        }}
                      >
                        {localStrings.Public.RefuseFriendRequest}
                      </Button>
                    </View>
                  </TouchableOpacity>
                );
              }}
              ListFooterComponent={renderFooter}
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
          </View>
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
