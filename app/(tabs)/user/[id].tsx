import { useLocalSearchParams } from 'expo-router';
import React from 'react'
import UserProfileScreen from '@/src/components/screens/profile/view/UserProfileScreen';

const userProfile = () => {
  const { id } = useLocalSearchParams();

  const getUserId = () => {
    if (Array.isArray(id)) {
      return id[0]
    } else {
      return id
    }
  }

  return (
    <UserProfileScreen id={getUserId()} />
  )
}

export default userProfile