import { View, Text } from 'react-native'
import React from 'react'
import MessagesFeature from '@/src/components/screens/messages/view/MessagesFeature'
import { useLocalSearchParams } from 'expo-router'

const messages = () => {
 
  return (
    <MessagesFeature/>
  )
}

export default messages