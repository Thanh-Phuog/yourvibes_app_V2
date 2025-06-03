"use client";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Platform,
  ActivityIndicator,
  SectionList,
  Alert,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import useListFriendsViewModel from "../../listFriends/viewModel/ListFriendsViewModel";
import { router } from "expo-router";
import { useAuth } from "@/src/context/auth/useAuth";
import { Checkbox, Form, Input } from "@ant-design/react-native";
import { AntDesign } from "@expo/vector-icons";
import useColor from "@/src/hooks/useColor";
import useConversationViewModel from "../viewModel/ConversationViewModel";
import { defaultMessagesRepo } from "@/src/api/features/messages/MessagesRepo";
import useConversationDetailViewModel from "../viewModel/ConversationDetailsViewModel";

const AddGroupModel = () => {
  const { user, localStrings } = useAuth();
  const { backgroundColor, brandPrimary, backGround } = useColor();
  const [groupForm] = Form.useForm();
  const { friends, page, fetchFriends, loading, hasMore, handleEndReached } =
    useListFriendsViewModel();
    

  const { createConversation } = useConversationViewModel(defaultMessagesRepo);
  const { createConversationDetail } =
    useConversationDetailViewModel(defaultMessagesRepo);
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);

  const toggleSelectFriend = (friendId: string) => {
    setSelectedFriends((prev) => {
      if (prev.includes(friendId)) {
        return prev.filter((id) => id !== friendId); // Bỏ chọn
      } else {
        return [...prev, friendId]; // Chọn
      }
    });
  };

  const renderFriend = ({
    item,
  }: {
    item: { id: string; avatar_url: string; family_name: string; name: string };
  }) => (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10,
        paddingLeft: 10,
        borderBottomWidth: 1,
        borderColor: "#e0e0e0",
      }}
    >
      <Checkbox
        checked={selectedFriends.includes(item.id)}
        onChange={() => toggleSelectFriend(item.id)}
        style={{
          marginRight: 10,
          borderColor: brandPrimary,
          
        }}
      />
      <Image
        source={{ uri: item.avatar_url }}
        style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: "#e0e0e0",
          marginRight: 10,
        }}
      />
      <Text style={{ fontSize: 16, color: brandPrimary }}>
        {item.family_name} {item.name}
      </Text>
    </View>
  );

  useEffect(() => {
    if (user) {
      fetchFriends(page, user.id);
    }
  }, [user]);

  const handleCreateGroup = async () => {
    try {
      if (selectedFriends.length === 0) {
        Alert.alert(
  "Thông báo", // Tiêu đề
  "Bạn cần chọn ít nhất một người để tạo nhóm!", // Nội dung
  [
    {
      text: "OK",
    },
  ]
);
        return;
      }

      const UserIds = [...selectedFriends];
      if (UserIds) {
        try {
          const friendNames = selectedFriends
            .map((friendId) => {
              const friend = friends.find((f) => f.id === friendId);
              return friend ? `${friend.family_name} ${friend.name}` : null;
            })
            .filter(Boolean) // Lọc bỏ giá trị null
            .join(", ");

          const conversationId = await createConversation({
            // name: fullName,
            name: groupForm.getFieldValue("message"),
            user_ids: UserIds.filter((id): id is string => id !== undefined),
          });

          if (conversationId) {
            console.log(
              "Before API call - conversationId:",
              conversationId,
              typeof conversationId
            );

            router.push(`/chat?conversation_id=${conversationId}`);
          } else {
            console.error("Conversation ID không hợp lệ");
          }
        } catch (error) {
          console.error("Lỗi khi tạo cuộc trò chuyện:", error);
        }
      }
    } catch (error) {
      console.error("Lỗi khi thêm nhóm:", error);
    }
  };

  return (
    <View>
      <Form
        style={{
          backgroundColor: backgroundColor,
        }}
        form={groupForm}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            padding: 10,
          }}
        >
          <Form.Item noStyle name="message"    rules={[{ required: true, message: localStrings.Messages.NameGroup}]}>
            <Input
              placeholder={localStrings.Messages.NameGroupPlaceholder}
              style={{
                flex: 1,
                borderColor: "#ccc",
                borderWidth: 1,
                borderRadius: 5,
                padding: 10,
                backgroundColor: backGround,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5,
              }}
              inputStyle={{
                color: brandPrimary,
              }}
            />
          </Form.Item>

          <View
            style={{
              backgroundColor: backgroundColor,
              borderRadius: 50,
              marginLeft: 10,
              padding: 10,
              justifyContent: "center",
              alignItems: "center",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.2,
              shadowRadius: 1.5,
              elevation: 5,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                handleCreateGroup();
              }}
            >
              {/* <FontAwesome name="send-o" size={30} color={brandPrimary} /> */}
              <AntDesign
                name="addusergroup"
                size={24}
                color={brandPrimary}
                style={{ marginLeft: "auto" }}
              />
            </TouchableOpacity>
          </View>
        </View>
      </Form>
      <SectionList
        sections={[{ title: "", data: friends as any }]}
        renderItem={renderFriend}
        keyExtractor={(item) => item.id}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loading && hasMore ? (
            <ActivityIndicator size="small" color="blue" />
          ) : null
        }
      />
    </View>
  );
};

export default AddGroupModel;
