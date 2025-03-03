import { useLocalSearchParams } from 'expo-router';
import React from 'react'
import EditPostScreen from '@/src/components/screens/editPost/views/EditPostScreen';

const editPost = () => {
  const { id } = useLocalSearchParams();

  const getPostId = () => {
    if (Array.isArray(id)) {
      return id[0]
    } else {
      return id
    }
  }

  return (
    <EditPostScreen id={getPostId()} />
  )
}

export default editPost