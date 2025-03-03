import React from "react";
import { useLocalSearchParams } from "expo-router";
import Ads from "@/src/components/screens/ads/views/AdsScreen";

const ads = () => {
  const { postId } = useLocalSearchParams();
  const getPostID = () => {
    if (Array.isArray(postId)) {
      return postId[0];
    } else {
      return postId;
    }
  };

  return <Ads postId={getPostID()} />;
};

export default ads;
