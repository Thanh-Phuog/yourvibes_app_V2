import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Image } from 'expo-image'
import { MessagesResponse } from '@/src/api/features/messages/models/Messages'
import { router } from 'expo-router'
import { getTimeDiff } from '@/src/utils/helper/DateTransfer'
import { useAuth } from '@/src/context/auth/useAuth'

const MessagerItem = ({messages} : {messages: MessagesResponse }) => {
  const {localStrings} = useAuth()
    const {id, sender, avatar_url, lastOnline, contextChat, timestamp } = messages
  return (
    <TouchableOpacity onPress={() => {router.push('/chat')}}> 
    <View style={{ flexDirection: 'row', padding: 10, justifyContent: 'space-between', alignItems: 'center' }}>
        <View style={{ flexDirection: 'row' }}>
            <Image
            source={{ uri: avatar_url }}
        style={{
          width: 50,
          height: 50,
          borderRadius: 25,
        }}/>
        <View style={{ marginLeft: 10, display: 'flex', justifyContent: 'center' }}>
          <Text>{sender}</Text>
          <Text>{contextChat
            }</Text>
        </View>
        </View>
      
        <View>
            <Text>{getTimeDiff(timestamp, localStrings)}</Text>
        </View>
    </View>
      </TouchableOpacity>
   
  )
}

export default MessagerItem