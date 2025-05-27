"use client";
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import useColor from "@/src/hooks/useColor";
import { useAuth } from "@/src/context/auth/useAuth";
import { Entypo, Feather, FontAwesome, Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import {
  ActivityIndicator,
  Form,
  Input,
  Modal,
} from "@ant-design/react-native";
import useMessagesViewModel from "../viewModel/MessagesViewModel";
import { defaultMessagesRepo } from "@/src/api/features/messages/MessagesRepo";
import useConversationViewModel from "../../messages/viewModel/ConversationViewModel";
import useConversationDetailViewModel from "../../messages/viewModel/ConversationDetailsViewModel";
import { useActionSheet } from "@expo/react-native-action-sheet";
import MemberMessage from "../component/MemberMessage";
import Toast from "react-native-toast-message";
import { useWebSocket } from "@/src/context/socket/useSocket";
import UserProfileViewModel from "../../profile/viewModel/UserProfileViewModel";
import AddUserGroup from "../component/AddUserGroup";
import { DateTransfer } from "@/src/utils/helper/DateTransfer";
import MyInput from "@/src/components/foundation/MyInput";

const Chat = () => {
  const { backgroundColor, brandPrimary, backGround, colorChat, borderColor } =
    useColor();
  const { user, localStrings } = useAuth();
  const router = useRouter();
  const { showActionSheetWithOptions } = useActionSheet();
  const [showMember, setShowMember] = React.useState(false);
  const [showUserGroupModel, setShowUserGroupModel] = React.useState(false);
  const [messagerForm] = Form.useForm();
  const { socketMessages, setSocketMessages } = useWebSocket();
  const [initialized, setInitialized] = useState(false);
  const {
    messages,
    setNewMessage,
    newMessage,
    handleSendMessage,
    fetchMessages,
    page,
    loadMoreMessages,
    loadingMessages,
  } = useMessagesViewModel(defaultMessagesRepo);
  const { createConversation, deleteConversation } =
    useConversationViewModel(defaultMessagesRepo);
  const merMessages = [...socketMessages, ...messages];
  const { conversation_id: rawConversationId, friend_id: rawFriendId } =
    useLocalSearchParams();
  const conversation_id = Array.isArray(rawConversationId)
    ? rawConversationId[0]
    : rawConversationId;
  const friend_id = Array.isArray(rawFriendId) ? rawFriendId[0] : rawFriendId;
  const {
    conversationsDetail,
    fetchConversationsDetail,
    pageDetail,
    DeleteConversationDetail,
    total,
  } = useConversationDetailViewModel(defaultMessagesRepo);
  const [currentConversationId, setCurrentConversationId] =
    useState(conversation_id);
  const [selectedMessage, setSelectedMessage] = useState<{
    id: string;
    content: string;
    user: { id: string; family_name: string; name: string };
  } | null>(null);
  const { fetchUserProfile, userInfo } = UserProfileViewModel();
  const handleReplyMessage = (message: {
    id: string;
    content: string;
    user: { id: string; family_name: string; name: string };
  }) => {
    setSelectedMessage(message);
  };

  const handleSendMessages = async () => {
    handleSendMessage({
      content: newMessage,
      conversation_id: currentConversationId,
      parent_id: selectedMessage?.id || undefined,
      user: {
        id: user?.id,
        avatar_url: user?.avatar_url,
        family_name: user?.family_name,
        name: user?.name,
      },
    });
    setSelectedMessage(null);
    messagerForm.setFieldsValue({ message: "" });
  };

  useEffect(() => {
    if (conversation_id) {
      if (typeof conversation_id === "string") {
        if (!initialized) {
          fetchConversationsDetail(pageDetail, conversation_id);
          fetchMessages(page, conversation_id);
          setInitialized(true);
        }
      }
    }
  }, [conversation_id, initialized]);

  useEffect(() => {
    if (friend_id) {
      if (typeof friend_id === "string") {
        fetchUserProfile(friend_id);
      }
    }
  }, [friend_id]);

  const flatListRef = useRef<FlatList>(null);


  const handleDeleteConversation = () => {
    Modal.alert(
      localStrings.Messages.DeleteConversation,
      localStrings.Messages.DeleteConversationConfirm,
      [
        {
          text: localStrings.Public.Cancel,
          style: "cancel",
        },
        {
          text: localStrings.Public.Confirm,
          onPress: async () => {
            try {
              await deleteConversation(conversation_id);
              router.back();
            } catch (error) {
              console.error("Error deleting conversation:", error);
            }
          },
        },
      ]
    );
  };

  const handleLeaveGroup = () => {
    Modal.alert(
      localStrings.Messages.LeaveGroup,
      localStrings.Messages.LeaveGroupConfirm,
      [
        {
          text: localStrings.Public.Cancel,
          style: "cancel",
        },
        {
          text: localStrings.Public.Confirm,
          onPress: async () => {
            try {
              await DeleteConversationDetail({
                conversation_id: conversation_id,
                user_id: user?.id,
              });
            } catch (error) {
              console.error("Error leaving group:", error);
            }
          },
        },
      ]
    );
  };
  // Tìm phần tử trong conversationsDetail tương ứng với user hiện tại
  const currentUserDetail = conversationsDetail.find(
    (item) => item.user?.id === user?.id
  );

const showMessAction = useCallback(() => {
  // Khởi tạo danh sách tùy chọn
  const options = [
    localStrings.Messages.Member,
    localStrings.Messages.AddUserGroup,
    localStrings.Messages.LeaveGroup,
    localStrings.Messages.DeleteConversation,
    localStrings.Public.Cancel,
  ];

  // Xử lý ẩn từng mục nếu cần
  if (total > 2 && currentUserDetail?.conversation_role !== 0) {
    options.splice(options.indexOf(localStrings.Messages.DeleteConversation), 1);
  }

  if (total === 2) {
    options.splice(options.indexOf(localStrings.Messages.LeaveGroup), 1);
  }

  // Hiển thị ActionSheet
  showActionSheetWithOptions(
    {
      title: localStrings.Public.Action,
      options: options,
      cancelButtonIndex: options.length - 1,
      cancelButtonTintColor: "#F95454",
    },
    (buttonIndex) => {
      const selectedOption = buttonIndex !== undefined ? options[buttonIndex] : null;

      // Thực hiện hành động tương ứng với lựa chọn
      switch (selectedOption) {
        case localStrings.Messages.Member:
          setShowMember(true);
          break;
        case localStrings.Messages.AddUserGroup:
          setShowUserGroupModel(true);
          break;
        case localStrings.Messages.LeaveGroup:
          handleLeaveGroup();
          break;
        case localStrings.Messages.DeleteConversation:
          handleDeleteConversation();
          break;
        default:
          break;
      }
    }
  );
}, [localStrings, conversationsDetail, total, currentUserDetail]);



  const renderFooter = useCallback(() => {
    return (
      <View>
        {loadingMessages ? (
          <View style={{ paddingVertical: 20 }}>
            <ActivityIndicator size="large" color={brandPrimary} />
          </View>
        ) : (
          <View></View>
        )}
      </View>
    );
  }, [loadingMessages]);

  const checkDate = (date: string) => {
    const today = new Date();
    const messageDate = new Date(date);

    const isToday =
      today.getDate() === messageDate.getDate() &&
      today.getMonth() === messageDate.getMonth() &&
      today.getFullYear() === messageDate.getFullYear();

    if (isToday) return localStrings.Messages.Today;

    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const isYesterday =
      yesterday.getDate() === messageDate.getDate() &&
      yesterday.getMonth() === messageDate.getMonth() &&
      yesterday.getFullYear() === messageDate.getFullYear();

    if (isYesterday) return localStrings.Messages.Yesterday;

    return DateTransfer(date); // giả sử bạn có hàm này để format ngày
  };
  // Hàm chuyển UTC sang giờ Việt Nam
  const convertToTime = (dateString: string) => {
    const date = new Date(dateString);
    const utcDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
    const vnDate = new Date(utcDate.getTime() + 7 * 3600000); // Cộng thêm 7 giờ
    return vnDate.toLocaleString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Nhóm tin nhắn theo ngày
  const groupMessagesByDate = (messages: any[]) => {
    const groupedMessages: { [key: string]: any[] } = {};
    messages.forEach((message) => {
      const date = checkDate(message.created_at); // Bạn có thể thay `checkDate` bằng bất kỳ logic xử lý ngày nào
      if (!groupedMessages[date]) {
        groupedMessages[date] = [];
      }
      groupedMessages[date].push(message);
    });
    return groupedMessages;
  };

  // Lấy nhóm tin nhắn
  const groupedMessages = groupMessagesByDate(merMessages);

  // Chuyển thành một mảng phẳng để sử dụng trong FlatList
  const flatMessages = Object.keys(groupedMessages).flatMap((date) => {
    // Thêm một phần tử "header" cho ngày
    const headerItem = {
      type: "header",
      id: `header-${date}`,
      date,
    };

    // Các tin nhắn trong ngày
    const messageItems = groupedMessages[date].map((msg) => ({
      ...msg,
      type: "message", // Đánh dấu kiểu tin nhắn
    }));

    // Trả về header và các tin nhắn của ngày đó
    return [...messageItems,headerItem];
  });

  useFocusEffect(
    useCallback(() => {
      return () => {
        setSocketMessages([]); // Xóa tin nhắn khi rời trang
      };
    }, [])
  );
  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: backGround, width: "100%" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={{ flex: 1 }}>
        {/* Header Cố Định */}
        <View
          style={{
            marginTop: Platform.OS === "ios" ? 30 : 0,
            height: 50,
            paddingHorizontal: 16,
            paddingTop: 16,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: backgroundColor,
            zIndex: 10,
            borderBottomColor: "black",
            borderBottomWidth: 1,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              router.back();
            }}
          >
            <Feather name="arrow-left" size={24} color={brandPrimary} />
          </TouchableOpacity>
          <Text
            style={{
              textAlign: "center",
              fontSize: 18,
              fontWeight: "bold",
              flex: 1,
              color: brandPrimary,
            }}
          >
            {/* {conversationsDetail[0]?.conversation?.name ||
              } */}
            {total === 2
              ? conversationsDetail[0]?.user?.id === user?.id
                ? conversationsDetail[1]?.user?.family_name +
                  " " +
                  conversationsDetail[1]?.user?.name
                : conversationsDetail[0]?.user?.family_name +
                  " " +
                  conversationsDetail[0]?.user?.name
              : conversationsDetail[0]?.conversation?.name ||
                `${userInfo?.family_name} ${userInfo?.name}`}
          </Text>
          <TouchableOpacity
            style={{
              width: "8%",
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
            }}
            onPress={showMessAction}
          >
            <Entypo name="dots-three-vertical" size={16} color={brandPrimary} />
          </TouchableOpacity>
        </View>

        {/* Body */}
        <View style={{ flex: 1, paddingBottom: 20 }}>
          {/* Chat */}
          <FlatList
            ref={flatListRef}
            data={flatMessages}
            inverted
            keyExtractor={(item, index) =>
              item.id ? item.id.toString() : index.toString()
            }
            renderItem={({ item }) => {
              if (item.type === "header") {
                // Render tiêu đề ngày
                return (
                  <Text
                    style={{
                      fontSize: 12,
                      color: "#999",
                      textAlign: "center",
                      marginVertical: 10,
                    }}
                  >
                    {item.date}
                  </Text>
                );
              }
              return (
                <View>
                  {item.parent_id === null ? (
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent:
                          item.user.id === user?.id ? "flex-end" : "flex-start",
                        marginBottom: 5,
                        alignItems: "center",
                      }}
                    >
                      <View>
                        {/* <Text style={{ fontSize: 12, color: "#999" }}>
                      {item.user.family_name} {item.user.name}
                    </Text> */}
                        <View
                          style={{
                            flexDirection:
                              item.user.id === user?.id ? "row-reverse" : "row",
                            alignItems: "center",
                          }}
                        >
                          <Image
                            source={{
                              uri: item.user.avatar_url,
                            }}
                            style={{
                              width: 40,
                              height: 40,
                              borderRadius: 25,
                              backgroundColor: "#e0e0e0",
                              marginLeft: item.user.id === user?.id ? 10 : 0,
                              marginRight: item.user.id === user?.id ? 0 : 10,
                            }}
                          />
                          <View
                            style={{
                              padding: 10,
                              backgroundColor:
                                item.user.id === user?.id
                                  ? colorChat
                                  : backgroundColor,
                              borderColor: borderColor,
                              borderWidth: 1,
                              borderRadius: 10,
                              alignSelf: "flex-end",
                              marginBottom: 5,
                              maxWidth: "80%",
                              shadowColor: "#000",
                              shadowOffset: { width: 0, height: 2 },
                              shadowOpacity: 0.25,
                              shadowRadius: 3.84,
                              alignItems:
                                item.user.id === user?.id
                                  ? "flex-end"
                                  : "flex-start",
                            }}
                          >
                            <TouchableOpacity
                              onLongPress={() => handleReplyMessage(item)}
                            >
                              <View>
                                <Text style={{ color: brandPrimary }}>
                                  {item.content}
                                </Text>
                              </View>
                              <Text style={{ fontSize: 12, color: "#999" }}>
                                {convertToTime(item.created_at)}
                              </Text>
                              <View></View>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                    </View>
                  ) : (
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent:
                          item.user.id === user?.id ? "flex-end" : "flex-start",
                        marginBottom: 5,
                        alignItems: "center",
                      }}
                    >
                      <View>
                        {/* <Text style={{ fontSize: 12, color: "#999" }}>
                      {item.user.family_name} {item.user.name}
                    </Text> */}
                        <View
                          style={{
                            flexDirection:
                              item.user.id === user?.id ? "row-reverse" : "row",
                            alignItems: "center",
                          }}
                        >
                          <Image
                            source={{
                              uri: item.user.avatar_url,
                            }}
                            style={{
                              width: 40,
                              height: 40,
                              borderRadius: 25,
                              backgroundColor: "#e0e0e0",
                              marginLeft: item.user.id === user?.id ? 10 : 0,
                              marginRight: item.user.id === user?.id ? 0 : 10,
                            }}
                          />
                          <View
                            style={{
                              padding: 10,
                              backgroundColor:
                                item.user.id === user?.id
                                  ? colorChat
                                  : backgroundColor,
                              borderColor: borderColor,
                              borderWidth: 1,
                              borderRadius: 10,
                              alignSelf: "flex-end",
                              marginBottom: 5,
                              maxWidth: "80%",
                              shadowColor: "#000",
                              shadowOffset: { width: 0, height: 2 },
                              shadowOpacity: 0.25,
                              shadowRadius: 3.84,
                              alignItems:
                                item.user.id === user?.id
                                  ? "flex-end"
                                  : "flex-start",
                            }}
                          >
                            <TouchableOpacity
                              onLongPress={() => handleReplyMessage(item)}
                            >
                              <View>
                                <View
                                  style={{
                                    backgroundColor: backGround,
                                    padding: 5,
                                    borderRadius: 8,
                                    marginBottom: 5,
                                  }}
                                >
                                  <Text style={{ fontSize: 14, color: "gray" }}>
                                    {localStrings.Messages.Reply}:{" "}
                                    {item.parent_content}
                                  </Text>
                                </View>
                                <Text style={{ color: brandPrimary }}>
                                  {item.content}
                                </Text>
                                <Text style={{ fontSize: 12, color: "#999" }}>
                                  {convertToTime(item.created_at)}
                                </Text>
                              </View>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                    </View>
                  )}
                </View>
              );
            }}
            onEndReachedThreshold={0.5}
            ListFooterComponent={renderFooter}
            onEndReached={() => loadMoreMessages(conversation_id)}
            removeClippedSubviews={true}
            showsVerticalScrollIndicator={false}
          />

          {/*messager input */}
          <Form
            style={{
              backgroundColor: backGround,
            }}
            form={messagerForm}
          >
            {selectedMessage && (
              <View
                style={{
                  backgroundColor: backgroundColor,
                  padding: 5,
                  borderRadius: 8,
                  marginBottom: 5,
                }}
              >
                <Text style={{ fontSize: 14, color: "#666" }}>
                  Trả lời: {selectedMessage.content}
                </Text>
                <TouchableOpacity onPress={() => setSelectedMessage(null)}>
                  <Text style={{ color: "red" }}>Hủy</Text>
                </TouchableOpacity>
              </View>
            )}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                padding: 10,
              }}
            >
              <Form.Item noStyle name="message">
                <MyInput
                  placeholder={localStrings.Messages.EnterMessage}
                  style={{
                    flex: 1,
                    borderColor: "#ccc",
                    borderWidth: 1,
                    borderRadius: 5,
                    padding: 10,
                    backgroundColor: backgroundColor,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5,
                  }}
                  inputStyle={{
                    color: brandPrimary,
                  }}
                  value={newMessage}
                  onChangeText={(text) => setNewMessage(text)}
                />
              </Form.Item>

              <View
                style={{
                  backgroundColor: backGround,
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
                    handleSendMessages();
                  }}
                >
                  <FontAwesome name="send-o" size={30} color={brandPrimary} />
                </TouchableOpacity>
              </View>
            </View>
          </Form>
        </View>
      </View>
      <Modal
        popup
        visible={showMember}
        animationType="slide-up"
        maskClosable
        onClose={() => {
          setShowMember(false);
        }}
        title={localStrings.Messages.Member}
      >
        <FlatList
          data={conversationsDetail}
          renderItem={({ item }) => (
            <MemberMessage
              conversationDetail={item}
              currentUserId={currentUserDetail}
            />
          )}
          // keyExtractor={(item, index) => item.user.id?.toString() || index.toString()}
        />
      </Modal>
      <Modal
        popup
        maskClosable
        visible={showUserGroupModel}
        animationType="slide-up"
        onClose={() => {
          setShowUserGroupModel(false);
        }}
      >
        <View
                  style={{
                    backgroundColor: backgroundColor,
                    paddingTop: Platform.OS === "ios" ? 30 : 0,
                    height: 500,
                  }}>

        <AddUserGroup conversationsDetail={conversationsDetail} />
                  </View>
      </Modal>
      <Toast />
    </KeyboardAvoidingView>
  );
};

export default Chat;
