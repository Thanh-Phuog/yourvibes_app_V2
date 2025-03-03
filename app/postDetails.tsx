import PostDetails from "@/src/components/common/PostDetails";
import { useLocalSearchParams } from "expo-router";
import React from "react";

const postDetails = () => {
  const {postId} = useLocalSearchParams()
  const getPostID = () => {
    if (Array.isArray(postId)) {
      return postId[0];
    } else {
      return postId;
    }
  };
  return (
    <PostDetails postId={getPostID()} isModal={false} />
  )
}

export default postDetails;
