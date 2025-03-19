import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { ConversationDetailResponseModel } from '@/src/api/features/messages/models/ConversationDetail';
import { router } from 'expo-router';

const MemberMessage = ({conversationDetail} : {conversationDetail: ConversationDetailResponseModel }) => {
    const {conversation, user } = conversationDetail
  return (
    <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: 10,
            borderBottomWidth: 1,
            borderColor: "#e0e0e0",
          }}
        >
          <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", flex: 1 }} onPress={() => {
            router.push(`/(tabs)/user/${user?.id}`);
          }}>
            <Image
              source={{ uri: user?.avatar_url }}
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: "#e0e0e0",
                marginRight: 10,
              }}
            />
            <Text style={{ fontSize: 16, color: "black" }}>
              {user.family_name} {user.name}
            </Text>
          </TouchableOpacity>
    
          {/* <TouchableOpacity
            style={{ paddingHorizontal: 10 }}
            onPress={() => handleMoreOptions(item)}
          >
            <Ionicons name="ellipsis-vertical" size={24} color="black" />
          </TouchableOpacity> */}
        </View>
  )
}

export default MemberMessage