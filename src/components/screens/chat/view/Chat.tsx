"use client";
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  FlatList,
  Image,
  TextInput,
} from "react-native";
import React, { use, useCallback, useEffect, useRef, useState } from "react";
import useColor from "@/src/hooks/useColor";
import { useAuth } from "@/src/context/auth/useAuth";
import {
  AntDesign,
  Entypo,
  Feather,
  FontAwesome,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import {
  ActivityIndicator,
  Form,
  Button,
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
import * as ImagePicker from "expo-image-picker";
import a from "@ant-design/react-native/lib/modal/alert";

const Chat = () => {
  const {
    backgroundColor,
    brandPrimary,
    backGround,
    colorChat,
    borderColor,
    lightGray,
  } = useColor();
  const { user, localStrings } = useAuth();
  const router = useRouter();
  const { showActionSheetWithOptions } = useActionSheet();
  const [showMember, setShowMember] = React.useState(false);
  const [showUserGroupModel, setShowUserGroupModel] = React.useState(false);
  const [showGroup, setShowGroup] = useState(false);
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
  const { createConversation, deleteConversation, updateConversation, loading } =
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
  const [newAvatar, setNewAvatar] = useState({
    uri: "",
    name: "",
    type: "",
  });

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

  const pickAvatarImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: false,
        quality: 1,
      });

      if (!result?.canceled && result?.assets) {
        setNewAvatar({
          uri: result.assets[0].uri,
          name: result.assets[0].fileName as string,
          type: result.assets[0].mimeType as string,
        });
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: localStrings.AddPost.PickImgFailed,
      });
    }
  };

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
    return [...messageItems, headerItem];
  });

  useFocusEffect(
    useCallback(() => {
      return () => {
        setSocketMessages([]); // Xóa tin nhắn khi rời trang
      };
    }, [])
  );


  const [name, setName] = useState("");
const [isEditing, setIsEditing] = useState(false);

  const handleSave = async () => {
    await updateConversation({
      id: currentConversationId,
      name: name.trim(),
      image: newAvatar?.uri ? newAvatar : undefined,
    });
    setShowGroup(false);
    setIsEditing(false);
  };

// Cập nhật name khi conversationsDetail đã có dữ liệu
useEffect(() => {
  if (conversationsDetail?.length > 0) {
    const computedName =
      total === 2
        ? conversationsDetail[0]?.user?.id === user?.id
          ? conversationsDetail[1]?.user?.family_name + " " + conversationsDetail[1]?.user?.name
          : conversationsDetail[0]?.user?.family_name + " " + conversationsDetail[0]?.user?.name
        : conversationsDetail[0]?.conversation?.name || `${userInfo?.family_name} ${userInfo?.name}`;

    setName(computedName || ""); // fallback nếu vẫn null
  }
}, [conversationsDetail, total]);

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
            onPress={() => {
              setShowGroup(true);
            }}
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
          }}
        >
          <AddUserGroup conversationsDetail={conversationsDetail} />
        </View>
      </Modal>
      {/* Thông tin nhóm */}
      <Modal
  popup
  maskClosable
  visible={showGroup}
  animationType="slide-up"
  onClose={() => setShowGroup(false)}
>
  <View
    style={{
      backgroundColor: backgroundColor,
      paddingTop: Platform.OS === "ios" ? 30 : 0,
      paddingHorizontal: 20,
      paddingBottom: 20,
      alignItems: "center",
    }}
  >
    {/* Phần avatar, tên nhóm, số người */}
    <View style={{ alignItems: "center", marginTop: -60 }}>
      <View style={{ position: "relative" }}>
        <Image
          source={{
            uri:
              newAvatar?.uri ||
              (total === 2
                ? conversationsDetail[0]?.user?.id === user?.id
                  ? conversationsDetail[1]?.user?.avatar_url || userInfo?.avatar_url
                  : conversationsDetail[0]?.user?.avatar_url || userInfo?.avatar_url
                : conversationsDetail[0]?.conversation?.image || userInfo?.avatar_url),
          }}
          style={{
            width: 120,
            height: 120,
            borderRadius: 60,
            backgroundColor: lightGray,
          }}
        />
        <TouchableOpacity
          style={{
            position: "absolute",
            top: 0,
            left: 10,
            backgroundColor: backgroundColor,
            borderRadius: 20,
            padding: 5,
          }}
          onPress={pickAvatarImage}
        >
          <MaterialIcons name="camera-alt" size={20} color={brandPrimary} />
        </TouchableOpacity>
        {newAvatar?.uri && (
          <TouchableOpacity
            style={{
              position: "absolute",
              top: 0,
              right: 10,
              backgroundColor: backgroundColor,
              borderRadius: 20,
              padding: 5,
            }}
            onPress={() => setNewAvatar({ uri: "", name: "", type: "" })}
          >
            <Ionicons name="close" size={20} color={brandPrimary} />
          </TouchableOpacity>
        )}
      </View>
    </View>
   <View style={{ alignItems: "center", marginTop: 10 }}>
  <View style={{ flexDirection: "row", alignItems: "center" }}>
    {isEditing ? (
      <TextInput
        value={name}
        onChangeText={setName}
        autoFocus
        style={{
          fontSize: 20,
          fontWeight: "bold",
          color: brandPrimary,
          borderBottomWidth: 1,
          borderBottomColor: brandPrimary,
          paddingVertical: 2,
          marginBottom: 5,
          marginTop: 10,
          textAlign: "center", // canh giữa text
        }}
      />
    ) : (
      <Text
        style={{
          fontSize: 20,
          fontWeight: "bold",
          color: brandPrimary,
          marginBottom: 5,
          marginTop: 10,
          textAlign: "center", // canh giữa text
        }}
      >
        {name}
      </Text>
    )}

    <TouchableOpacity onPress={() => setIsEditing(!isEditing)} style={{ marginLeft: 8, marginTop: 10 }}>
      <AntDesign name="edit" size={20} color={brandPrimary} />
    </TouchableOpacity>
  </View>
</View>


      <Text style={{ fontSize: 16, color: "#555", marginBottom: 20 }}>
        {total} {localStrings.Messages.Member}
      </Text>

      <Button type="primary" loading={loading} onPress={handleSave}>
        <Text
          style={{
            color: backGround,
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          {localStrings.Public.Save}
        </Text>
      </Button>

    {/* Phần danh sách các hành động */}
    <View style={{ marginTop: 30, width: "100%" }}>
      {[
        localStrings.Messages.InfoGroup,
        localStrings.Messages.Member,
        localStrings.Messages.AddUserGroup,
        localStrings.Messages.LeaveGroup,
        // Xử lý điều kiện ẩn DeleteConversation giống logic bạn có
        ...(total > 2 && currentUserDetail?.conversation_role !== 0
          ? []
          : [localStrings.Messages.DeleteConversation]),
      ].map((option, idx) => (
        <TouchableOpacity
          key={idx}
          style={{
            paddingVertical: 15,
            borderBottomWidth: 1,
            borderBottomColor: "#eee",
          }}
          onPress={() => {
            switch (option) {
              case localStrings.Messages.InfoGroup:
                // Đang ở modal info rồi, có thể ko làm gì
                break;
              case localStrings.Messages.Member:
                setShowMember(true);
                setShowGroup(false);
                break;
              case localStrings.Messages.AddUserGroup:
                setShowUserGroupModel(true);
                setShowGroup(false);
                break;
              case localStrings.Messages.LeaveGroup:
                handleLeaveGroup();
                setShowGroup(false);
                break;
              case localStrings.Messages.DeleteConversation:
                handleDeleteConversation();
                setShowGroup(false);
                break;
              default:
                break;
            }
          }}
        >
          <Text
            style={{
              fontSize: 16,
              textAlign: "center",
              color: brandPrimary,
            }}
          >
            {option}
          </Text>
        </TouchableOpacity>
      ))}

      {/* Nút hủy modal */}
      <TouchableOpacity
        style={{ paddingVertical: 15, marginTop: 10 }}
        onPress={() => setShowGroup(false)}
      >
        <Text
          style={{
            fontSize: 16,
            textAlign: "center",
            color: "#F95454",
            fontWeight: "bold",
          }}
        >
          {localStrings.Public.Cancel}
        </Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>

      <Toast />
    </KeyboardAvoidingView>
  );
};

export default Chat;
