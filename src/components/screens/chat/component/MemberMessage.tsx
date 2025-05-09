"use client";
import { View, Text, TouchableOpacity, Image } from "react-native";
import React, { useCallback } from "react";
import { ConversationDetailResponseModel } from "@/src/api/features/messages/models/ConversationDetail";
import { router } from "expo-router";
import useConversationDetailViewModel from "../../messages/viewModel/ConversationDetailsViewModel";
import { defaultMessagesRepo } from "@/src/api/features/messages/MessagesRepo";
import { Entypo } from "@expo/vector-icons";
import { useAuth } from "@/src/context/auth/useAuth";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { use } from "i18next";

const MemberMessage = ({
  conversationDetail,
  currentUserId,
}: {
  conversationDetail: ConversationDetailResponseModel;
  currentUserId: ConversationDetailResponseModel | undefined;
}) => {
  const { localStrings, user } = useAuth();
  // const {user, conversation, conversation_role } = conversationDetail
  const { DeleteConversationDetail } =
    useConversationDetailViewModel(defaultMessagesRepo);
  const { showActionSheetWithOptions } = useActionSheet();
  const handleDeleteConversationDetail = async () => {
    try {
      await DeleteConversationDetail({
        // conversation_id: conversation?.id,
        // user_id: user?.id,
        conversation_id: conversationDetail?.conversation?.id,
        user_id: conversationDetail?.user?.id,
      });
    } catch (error) {
      console.error("Error deleting conversation detail:", error);
    }
  };

  const showMemberAction = useCallback(() => {
    const options = [
      localStrings.Messages.DeleteMember,
      localStrings.Public.Cancel,
    ];

    showActionSheetWithOptions(
      {
        title: localStrings.Public.Action,
        options: options,
        cancelButtonIndex: options.length - 1,
        cancelButtonTintColor: "#F95454",
      },
      (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            handleDeleteConversationDetail();

            break;
          case 1:
            // Cancel action
            break;
          default:
            break;
        }
      }
    );
  }, [localStrings]);

  const isCurrentUser = conversationDetail?.user?.id === user?.id;
  

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderColor: "#e0e0e0",
      }}
      key={conversationDetail?.user?.id}
    >
      <TouchableOpacity
        style={{ flexDirection: "row", alignItems: "center", flex: 1 }}
        onPress={() => {
          // router.push(`/(tabs)/user/${user?.id}`);
          router.push(`/(tabs)/user/${conversationDetail?.user?.id}`);
        }}
      >
        <Image
          // source={{ uri: user?.avatar_url }}
          source={{ uri: conversationDetail?.user?.avatar_url }}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: "#e0e0e0",
            marginRight: 10,
          }}
        />
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 16, color: "black" }}>
            {/* {user?.name} {user?.family_name} */}
            {conversationDetail?.user?.name}{" "}
            {conversationDetail?.user?.family_name}
          </Text>
      
            <Text style={{ fontSize: 14, color: "#888" }}>
              {conversationDetail?.conversation_role === 0 ? localStrings.Messages.Admin : localStrings.Messages.Member}
            </Text>
        </View>
      </TouchableOpacity>

          {currentUserId?.conversation_role === 0 && (
            <TouchableOpacity
          style={{ paddingHorizontal: 10 }}
          onPress={showMemberAction}
        >
          {/* <Ionicons name="ellipsis-vertical" size={24} color="black" /> */}
          <Entypo name="dots-three-vertical" size={16} />
        </TouchableOpacity>) }
       

    </View>
  );
};

export default MemberMessage;
