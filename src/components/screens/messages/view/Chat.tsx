import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  FlatList,
} from "react-native";
import React, { useCallback } from "react";
import useColor from "@/src/hooks/useColor";
import { useAuth } from "@/src/context/auth/useAuth";
import { Feather, FontAwesome, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Form, Input } from "@ant-design/react-native";
import useMessagesViewModel from "../viewModel/MessagesViewModel";
import { MessagesResponse } from "@/src/api/features/messages/models/Messages";

const Chat = () => {
  const { backgroundColor, brandPrimary } = useColor();
  const { user, localStrings } = useAuth();
  const router = useRouter();
  const [messagerForm] = Form.useForm();
  const { messages, setNewMessage, newMessage, handleSendMessage } =
    useMessagesViewModel({ getMessages: () => user?.id || "" });
  const handleSendMessages = () => {
    handleSendMessage({ contextChat: newMessage, sender: user?.name });
    messagerForm.setFieldsValue({ message: "" });
  };


      
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
            {user?.family_name} {user?.name || localStrings.Public.Username}
          </Text>
        </View>

        {/* Body */}
        <View style={{ flex: 1, padding: 10 }}>
          {/* Chat */}
          <FlatList
            data={messages}
            extraData={messages} 
            keyExtractor={(item, index) =>
              item.id ? item.id.toString() : index.toString()
            }
            renderItem={({ item }) => (
              // <
              //   style={{
              //    display: "flex",
              //     flexDirection: "row",
              //     justifyContent: isUserMessage(item) ? "flex-end" : "flex-start",
              //     marginBottom: 5,
              //   }}>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: item.sender === user?.name
                    ? "flex-end"
                    : "flex-start",
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
                  <Text style={{ fontSize: 16 }}>{item.contextChat}</Text>
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
                  {/* {loading ? (
                      <ActivityIndicator size="small" color={brandPrimary} />
                    ) : ( */}
                  <FontAwesome name="send-o" size={30} color={brandPrimary} />
                  {/* )} */}
                </TouchableOpacity>
              </View>
            </View>
          </Form>
        </View>
      </View>
      {/* <Toast /> */}
    </KeyboardAvoidingView>
  );
};

export default Chat;
