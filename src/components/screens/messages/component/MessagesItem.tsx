import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Image } from "expo-image";
import { router } from "expo-router";
import { getTimeDiff } from "@/src/utils/helper/DateTransfer";
import { useAuth } from "@/src/context/auth/useAuth";
import { ConversationResponseModel } from "@/src/api/features/messages/models/Conversation";
import a from "@ant-design/react-native/lib/modal/alert";

const MessagerItem = ({
  conversation,
}: {
  conversation: ConversationResponseModel;
}) => {
  const { localStrings } = useAuth();
  const {
    name,
    family_name,
    image,
    avatar,
    last_message,
    last_message_status,
  } = conversation;

  return (
    <TouchableOpacity
      onPress={() => {
        router.push(`/chat?conversation_id=${conversation.id}`);
      }}
      style={{
        backgroundColor: "#f0f0f0",
        padding: 10,
        marginBottom: 2,
        borderRadius: 8,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Image
          source={{ uri: image ? image : avatar }}
          style={{
            width: 50,
            height: 50,
            borderRadius: 25,
            borderColor: "gray",
            borderWidth: 1,
          }}
        />
        <View
          style={{
            flexDirection: "row",
            marginLeft: 10,
            justifyContent: "space-between",
            alignItems: "center",
            flex: 1,
          }}
        >
          <View>
            <Text style={{ fontWeight: "bold" }}>
              {family_name} {name}
            </Text>
            <Text
              style={{
                color: last_message_status === false ? "gray" : "black",
                fontWeight: last_message_status === false ? "normal" : "bold",
              }}
            >
              {last_message}
            </Text>
          </View>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {/* Thời gian tin nhắn */}
          {/* <Text style={{ color: "gray", marginRight: 5 }}>
              {getTimeDiff(lastMessageAt)}
            </Text> */}

          {/* Chấm đỏ nếu chưa đọc */}
          {last_message_status === true && (
            <View
              style={{
                width: 10,
                height: 10,
                borderRadius: 5,
                backgroundColor: "red",
              }}
            />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default MessagerItem;
