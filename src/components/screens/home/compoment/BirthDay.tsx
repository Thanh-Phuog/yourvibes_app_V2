import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  Animated,
} from "react-native";
import React, { useEffect, useRef } from "react";
import { defaultFriendRepo } from "@/src/api/features/friends/FriendRepo";
import useColor from "@/src/hooks/useColor";
import { DateTransfer } from "@/src/utils/helper/DateTransfer";
import { useAuth } from "@/src/context/auth/useAuth";
import { Image } from "expo-image";
import { router, useFocusEffect } from "expo-router";
import UserProfileViewModel from "../../profile/viewModel/UserProfileViewModel";
import FriendRequestAndUserViewModel from "../viewModel/FriendAndBirthViewModel";
import dayjs from "dayjs";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import useConversationViewModel from "../../messages/viewModel/ConversationViewModel";
import { defaultMessagesRepo } from "@/src/api/features/messages/MessagesRepo";

const Birth = () => {
  const { user, localStrings } = useAuth();
  const { brandPrimary, backgroundColor, lightGray, borderBirth, backGround } =
    useColor();
  const { acceptFriendRequest, refuseFriendRequest, sendRequestLoading } =
    UserProfileViewModel();
  const fadeAnimation = useRef(new Animated.Value(0)).current;
  const {
    birthdayFriends,
    loadingBirthday,
    fetchBirthdayFriends,
    onRefreshBirthday,
    loadMoreBirthdayFriends,
    hasMoreBirthday,
    hasMoreFriendRequest,
    onViewableItemsChanged,
  } = FriendRequestAndUserViewModel(defaultFriendRepo);

  const { createConversation } = useConversationViewModel(defaultMessagesRepo);

  useEffect(() => {
    if (user) {
      fetchBirthdayFriends();
    }
  }, []);

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

  return (
    <View style={{}}>
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
            color: "gray",
            marginLeft: 10,
          }}
        >
          {localStrings.Public.HappyBirthday}
        </Text>
      </View>
      {birthdayFriends.length > 0 ? (
        <FlatList
          data={birthdayFriends}
          renderItem={({ item }) => {
            return (
              <View>
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
                    backgroundColor: backGround,
                  }}
                >
                  <TouchableOpacity
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      padding: 10,
                      marginVertical: 5,
                    }}
                    activeOpacity={0.8}
                  >
                    <View style={{ position: "relative", display: "flex" }}>
                      <Image
                        source={{ uri: item.avatar_url }}
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: 22,
                          borderWidth: 2,
                          borderColor: borderBirth || "#FF6699",
                          marginRight: 12,
                        }}
                      />
                      {dayjs(item.birthday).format("DD/MM") ===
                        dayjs().format("DD/MM") && (
                        <FontAwesome
                          name="birthday-cake"
                          size={16}
                          color="#FF6699"
                          style={{
                            position: "absolute",
                            bottom: -5,
                            right: 5,
                            backgroundColor: "white",
                            borderRadius: 8,
                            padding: 2,
                          }}
                        />
                      )}
                    </View>

                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          fontWeight: "600",
                          fontSize: 15,
                          color: brandPrimary,
                        }}
                      >
                        {item.family_name + " " + item.name}
                      </Text>
                      <Text
                        style={{
                          color: "gray",
                          fontSize: 13,
                          fontWeight: "500",
                          marginTop: 4,
                        }}
                      >
                        {localStrings.Public.Birthday}{" "}
                        {dayjs(item.birthday).format("DD/MM") ===
                        dayjs().format("DD/MM")
                          ? "Today"
                          : dayjs(item.birthday).format("DD/MM")}
                      </Text>
                    </View>

                    <Ionicons
                      size={25}
                      name="chatbubble-ellipses"
                      style={{ marginRight: 15, color: brandPrimary }}
                      onPress={async () => {
                        const UserIds = [item.id];
                        if (UserIds) {
                          try {
                            const conversationId = await createConversation({
                              name: `chat`,
                              user_ids: UserIds.filter(
                                (id): id is string => id !== undefined
                              ),
                            });

                            if (conversationId) {
                              router.push(
                                `/chat?conversation_id=${conversationId}`
                              );
                            } else {
                              console.error("Conversation ID không hợp lệ");
                            }
                          } catch (error) {
                            console.error(
                              "Lỗi khi tạo cuộc trò chuyện:",
                              error
                            );
                          }
                        } else {
                          router.push(`/chat?friend_id=${item.id}`);
                        }
                      }}
                    />
                  </TouchableOpacity>
                </Animated.View>
              </View>
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
          <Text style={{ color: lightGray, fontSize: 13, textAlign: "center" }}>
            {localStrings.Public.NoBirthdays}
          </Text>
        </View>
      )}
    </View>
  );
};

export default Birth;
