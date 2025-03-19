import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  FlatList,
} from "react-native";
import React, { useCallback, useEffect, useRef } from "react";
import useColor from "@/src/hooks/useColor";
import { useAuth } from "@/src/context/auth/useAuth";
import { Entypo, Feather, FontAwesome, Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Form, Input, Modal } from "@ant-design/react-native";
import useMessagesViewModel from "../../messages/viewModel/MessagesViewModel";
import { defaultMessagesRepo } from "@/src/api/features/messages/MessagesRepo";
import useConversationViewModel from "../../messages/viewModel/ConversationViewModel";
import useConversationDetailViewModel from "../../messages/viewModel/ConversationDetailsViewModel";
import { useActionSheet } from "@expo/react-native-action-sheet";
import MemberMessage from "../component/MemberMessage";
import Toast from "react-native-toast-message";
import { useWebSocket } from "@/src/context/socket/useSocket";

const Chat = () => {
  const { backgroundColor, brandPrimary } = useColor();
  const { user, localStrings } = useAuth();
  const router = useRouter();
  const { showActionSheetWithOptions } = useActionSheet();
  const [showMember, setShowMember] = React.useState(false);
  const [messagerForm] = Form.useForm();
  const {
    messages} = useWebSocket();
    
  const {
    // messages,
    setNewMessage,
    newMessage,
    handleSendMessage,
    fetchMessages,
    page,
  } = useMessagesViewModel(defaultMessagesRepo);
  const { conversation_id: rawConversationId } = useLocalSearchParams();
  const conversation_id = Array.isArray(rawConversationId)
    ? rawConversationId[0]
    : rawConversationId;

  const handleSendMessages = () => {
    handleSendMessage({
      content: newMessage,
      conversation_id: conversation_id,
      user: {
        id: user?.id,
        avatar_url: user?.avatar_url,
        family_name: user?.family_name,
        name: user?.name,
      },
    });
    
    messagerForm.setFieldsValue({ message: "" });
  };
  const { conversationsDetail, fetchConversationsDetail, pageDetail } =
    useConversationDetailViewModel(defaultMessagesRepo);

  useEffect(() => {
    if (conversation_id) {
      if (typeof conversation_id === "string") {
        fetchConversationsDetail(pageDetail, undefined, conversation_id);
        fetchMessages(page, conversation_id);
      }
    }
  }, [conversation_id]);

  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

    const showFriendAction = useCallback(() => {
      const options = [
        localStrings.Messages.Member,

        localStrings.Public.Cancel,
      ];
  
      showActionSheetWithOptions(
        {
          title: localStrings.Public.Action,
          options: options,
          cancelButtonIndex: options.length - 1,
          cancelButtonTintColor: "#F95454"
        },
        (buttonIndex) => {
          switch (buttonIndex) {
            case 0:
              setShowMember(true);

              break;
            case 1:
              // TODO: block user
              break;
            default:
              break;
          }
        }
      );
    }, [localStrings]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#f9f9f9", width: "100%" }}
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
            backgroundColor: "#fff",
            zIndex: 10,
            borderBottomColor: "black",
            borderBottomWidth: 1,
          }}
        >
          <TouchableOpacity onPress={() => router.back()}>
            <Feather name="arrow-left" size={24} color="black" />
          </TouchableOpacity>
          <Text
            style={{
              textAlign: "center",
              fontSize: 18,
              fontWeight: "bold",
              flex: 1,
            }}
          >
            {conversationsDetail[0]?.conversation?.name || "Tên hội thoại"}
          </Text>
          <TouchableOpacity
            style={{ width: '8%', display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}
            onPress={showFriendAction}
          >
            <Entypo name="dots-three-vertical" size={16} />
          </TouchableOpacity>
        </View>

        {/* Body */}
        <View style={{ flex: 1, padding: 10 }}>
          {/* Chat */}
          <FlatList
            ref={flatListRef}
            data={messages}
            extraData={messages}
            // keyExtractor={(item, index) =>
            //   item.id ? item.id.toString() : index.toString()
            // // }
            renderItem={({ item }) => (
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
                <View
                  style={{
                    padding: 10,
                    backgroundColor: backgroundColor,
                    borderColor: "#ccc",
                    borderWidth: 1,
                    borderRadius: 10,
                    alignSelf: "flex-end",
                    marginBottom: 5,
                    maxWidth: "80%",
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                  }}
                >
                  <Text style={{ fontSize: 16 }}>{item.content}</Text>
                </View>
              </View>
            )}
          />

          {/*messager input */}
          <Form
            style={{
              backgroundColor: "#fff",
            }}
            form={messagerForm}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                padding: 10,
                paddingBottom: Platform.OS === "ios" ? 10 : 40,
              }}
            >
              <Form.Item noStyle name="message">
                <Input
                  placeholder={localStrings.Messages.EnterMessage}
                  style={{
                    flex: 1,
                    borderColor: "#ccc",
                    borderWidth: 1,
                    borderRadius: 5,
                    padding: 10,
                    backgroundColor: "#fff",
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5,
                  }}
                  value={newMessage}
                  onChangeText={(text) => setNewMessage(text)}
                />
              </Form.Item>

              <View
                style={{
                  backgroundColor: "white",
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
              onClose={() => {setShowMember(false)}}
              title={localStrings.Messages.Member}
            >
              <FlatList
                data={conversationsDetail}
                renderItem={({ item }) => 
                <MemberMessage conversationDetail={item} />
                }
                // keyExtractor={(item, index) => item.user.id?.toString() || index.toString()}
              />
            </Modal>
      <Toast />
    </KeyboardAvoidingView>
  );
};

export default Chat;
