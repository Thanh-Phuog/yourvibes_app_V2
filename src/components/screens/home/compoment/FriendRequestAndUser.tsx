import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  Animated,
  ScrollView,
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
import UserNonFriend from "./User";
import FriendRequest from "./FriendRequest";

const FriendRequestAndUser = ({ isActive }: { isActive: boolean }) => {
  const { user, localStrings } = useAuth();
  const { brandPrimary, backgroundColor, lightGray, borderColor } = useColor();
  const [showModalBirth, setShowModalBirth] = useState(false);
  const [showModalFriendRequest, setShowModalFriendRequest] = useState(false);
  const [showModalUser, setShowModalUser] = useState(false);
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

  const sections = [
  {
    key: "birth",
    title: localStrings.Public.BirthdayFriend,
    onPress: () => setShowModalBirth(true),
    content: <Birth limit={4} />,
  },
  {
    key: "request",
    title: localStrings.Public.FriendRequests,
    onPress: () => setShowModalFriendRequest(true),
    content: <FriendRequest limit={4} />,
  },
  {
    key: "users",
    title: localStrings.Public.AllUser,
    onPress: () => setShowModalUser(true),
    content: <UserNonFriend limit={4} />,
  },
];

  return (
<FlatList
  data={sections}
  keyExtractor={(item) => item.key}
  contentContainerStyle={{ padding: 10, paddingBottom: 20 }}
  renderItem={({ item }) => (
    <View style={{ marginBottom: 10 }}>
      <TouchableOpacity onPress={item.onPress}>
        <Text style={{
          fontSize: 16,
          fontWeight: "700",
          color: brandPrimary,
          letterSpacing: 0.5,
        }}>
          {item.title}
        </Text>
      </TouchableOpacity>
      <View style={{ height: 1, backgroundColor: borderColor, marginVertical: 5 }} />
      {item.content}
    </View>
  )}
  ListFooterComponent={
    <>
      <Modal
        popup
        maskClosable
        visible={showModalBirth}
        animationType="slide-up"
        onClose={() => setShowModalBirth(false)}
      >
        <View style={{ backgroundColor: backgroundColor, height: 500 }}>
          <Birth />
        </View>
      </Modal>

      <Modal
        popup
        maskClosable
        visible={showModalUser}
        animationType="slide-up"
        onClose={() => setShowModalUser(false)}
      >
        <View style={{ backgroundColor: backgroundColor, height: 500 }}>
          <UserNonFriend />
        </View>
      </Modal>

      <Modal
        popup
        maskClosable
        visible={showModalFriendRequest}
        animationType="slide-up"
        onClose={() => setShowModalFriendRequest(false)}
      >
        <View style={{ backgroundColor: backgroundColor, height: 500 }}>
          <FriendRequest />
        </View>
      </Modal>
    </>
  }
/>
  );
};

export default FriendRequestAndUser;
