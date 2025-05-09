"use client";
import {
  View,
  Text,
  Platform,
  StatusBar,
  TouchableOpacity,
  FlatList,
  Image,
  KeyboardAvoidingView,
} from "react-native";
import React, { useCallback, useEffect } from "react";
import { useAuth } from "@/src/context/auth/useAuth";

import { ActivityIndicator, ListView, Modal } from "@ant-design/react-native";
import MessagerItem from "../component/MessagesItem";
import useColor from "@/src/hooks/useColor";
import { router, useFocusEffect } from "expo-router";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import useListFriendsViewModel from "../../listFriends/viewModel/ListFriendsViewModel";
import { defaultMessagesRepo } from "@/src/api/features/messages/MessagesRepo";
import { ConversationDetailResponseModel } from "@/src/api/features/messages/models/ConversationDetail";
import useConversationDetailViewModel from "../viewModel/ConversationDetailsViewModel";
import useConversationViewModel from "../viewModel/ConversationViewModel";
import { create } from "react-test-renderer";
import AddGroupModel from "../component/CreateGroupModel";
import { useWebSocket } from "@/src/context/socket/useSocket";

const MessagesFeature = () => {
  const { user } = useAuth();
  const { backgroundColor, brandPrimary } = useColor();
  const { localStrings } = useAuth();
  const {newMessageTrigger} = useWebSocket();
  const [showGroupModel, setShowGroupModel] = React.useState(false);
  const { friends, page, fetchFriends } = useListFriendsViewModel();
  const {createConversation, loading, fetchConversations, conversations, loadMoreConversations} = useConversationViewModel(defaultMessagesRepo);
  
  const renderFriend = useCallback(() => {
    return (
      <View style={{ paddingVertical: 20, overscrollBehavior: "auto" }}>
        <View
          style={{
            flexDirection: "row",
            // flexWrap: "wrap",
            // justifyContent: "space-between",
          }}
        >
          {friends?.map((friend, index) => (
            <TouchableOpacity
              key={index}
              style={{
                width: "23%",
                alignItems: "center",
                marginBottom: 10,
                marginRight: 4,
                marginLeft: 4,
              }}
              onPress={async() => {
                const UserIds = [friend.id];
                  if (UserIds) {
                    try {
                      const conversationId = await createConversation({
                          name: `${user?.family_name} ${user?.name}, ${friend.family_name} ${friend.name}`,
                          user_ids: UserIds.filter((id): id is string => id !== undefined),
                      });
          
                      if (conversationId) {

                          router.push(`/chat?conversation_id=${conversationId}`);
                      } else {
                          console.error("Conversation ID không hợp lệ");
                      }
                  } catch (error) {
                      console.error("Lỗi khi tạo cuộc trò chuyện:", error);
                  }
              } else {
                  router.push(`/chat?friend_id=${friend.id}`);
              }
              }}
            >
              <Image
                source={{
                  uri: friend.avatar_url,
                }}
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 25,
                  backgroundColor: "#e0e0e0",
                  marginRight: 10,
                }}
              />
              <Text style={{ marginTop: 5 }}>{friend.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  }, [friends]);

  const renderFooter = useCallback(() => {
    return (
      <>
        {loading ? (
          <View style={{ paddingVertical: 20 }}>
            <ActivityIndicator size="large" color={brandPrimary} />
          </View>
        ) : (
          <></>
        )}
      </>
    );
  }, [loading]);
  useEffect(() => {
    if (user) {
      fetchFriends(page, user.id);
    }
  }, [user]);
  
  useFocusEffect(
    useCallback(() => {
      if (user) {
        fetchConversations(page);
      }
    }, [user, newMessageTrigger]) // Ensure proper typing and avoid null issues
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#f9f9f9", width: "100%" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={{ flex: 1 }}>
        {/* Header */}

        <View
          style={{
            backgroundColor: backgroundColor,
            paddingTop: Platform.OS === "ios" ? 30 : 0,
          }}
        >
          <StatusBar barStyle="dark-content" />
          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-end",
              height: 60,
              paddingBottom: 10,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                paddingHorizontal: 10,
                alignItems: "center",
                flex: 1,
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  router.back();
                }}
              >
                <Ionicons
                  name="arrow-back-outline"
                  size={24}
                  color={brandPrimary}
                />
              </TouchableOpacity>

              <Text
                style={{ fontWeight: "bold", fontSize: 20, marginLeft: 10 }}
              >
                {localStrings.Messages.Messages}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setShowGroupModel(true);
                }}
              >
                <AntDesign
                  name="addusergroup"
                  size={24}
                  color={brandPrimary}
                  style={{ marginLeft: "auto" }}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={{ borderBottomWidth: 1, borderColor: "#000" }} />

        {renderFriend()}
        {/* <MessagerItem messages={fakeMessages} /> */}
        <FlatList
          data={conversations}
          renderItem={({ item }) => (
            <MessagerItem conversation={item} />
          )}
          keyExtractor={(item, index) =>
            item.id?.toString() || index.toString()
          }
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          onEndReached={() => loadMoreConversations()}
          removeClippedSubviews={true}
          showsVerticalScrollIndicator={false}
        />

        <Toast />
      </View>
      <Modal
        popup
        visible={showGroupModel}
        animationType="slide-up"
        onClose={() => {
          setShowGroupModel(false);
        }}
        maskClosable
      >
        <AddGroupModel />
      </Modal>
    </KeyboardAvoidingView>
  );
};

export default MessagesFeature;
