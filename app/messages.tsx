import { View, Text } from 'react-native'
import React from 'react'
import MessagesFeature from '@/src/components/screens/messages/view/MessagesFeature'
import { useLocalSearchParams } from 'expo-router'

const messages = () => {
   const {userId} = useLocalSearchParams()
    const getUserID = () => {
      if (Array.isArray(userId)) {
        return userId[0];
      } else {
        return userId;
      }
    };
  return (
    <MessagesFeature userId={getUserID()}/>
  )
}

export default messages