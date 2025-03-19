import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Image } from 'expo-image'
import { router } from 'expo-router'
import { getTimeDiff } from '@/src/utils/helper/DateTransfer'
import { useAuth } from '@/src/context/auth/useAuth'
import { MessageResponseModel } from '@/src/api/features/messages/models/Messages'
import { ConversationDetailResponseModel } from '@/src/api/features/messages/models/ConversationDetail'

const MessagerItem = ({conversationDetail} : {conversationDetail: ConversationDetailResponseModel }) => {
  const {localStrings} = useAuth()
    const {conversation, user } = conversationDetail
  return (
    <TouchableOpacity onPress={() => {router.push(`/chat?conversation_id=${conversation.id}`) }}> 
    <View style={{ flexDirection: 'row', padding: 10, justifyContent: 'space-between', alignItems: 'center' }}>
        <View style={{ flexDirection: 'row' }}>
            <Image
            source={{ uri: conversation.image }}
        style={{
          width: 50,
          height: 50,
          borderRadius: 25,
        }}/>
        <View style={{ marginLeft: 10, display: 'flex', justifyContent: 'center' }}>
          <Text>{conversation.name}</Text>
          {/* <Text>{content}</Text> */}
        </View>
        </View>
      
        <View>
            {/* <Text>{getTimeDiff(created_at, localStrings)}</Text> */}
        </View>
    </View>
      </TouchableOpacity>
   
  )
}

export default MessagerItem