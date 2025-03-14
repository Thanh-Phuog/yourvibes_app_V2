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
    <TouchableOpacity onPress={() => {
      // Chuyển id người dùng qua màn hình chat để biết đang chat với ai
      router.push({
        pathname: '/chat',
        params: { friendId: id, friendName: sender }
      });
    }}> 
      <View style={{ flexDirection: 'row', padding: 10, justifyContent: 'space-between', alignItems: 'center' }}>
        <View style={{ flexDirection: 'row' }}>
          <Image
            source={{ uri: avatar_url }}
            style={{
              width: 50,
              height: 50,
              borderRadius: 25,
            }}
          />
          <View style={{ marginLeft: 10, display: 'flex', justifyContent: 'center' }}>
            <Text style={{ fontWeight: 'bold' }}>{sender}</Text>
            <Text style={{ color: '#555', fontSize: 13 }}>{contextChat}</Text>
          </View>
        </View>
      
        <View>
          <Text style={{ color: '#999', fontSize: 12 }}>{timestamp ? getTimeDiff(timestamp, localStrings) : ''}</Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default MessagerItem