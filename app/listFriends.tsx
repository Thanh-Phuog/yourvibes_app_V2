import ListFriendsScreen from "@/src/components/screens/listFriends/views/ListFriendsScreen";
import { useLocalSearchParams } from "expo-router";
import React from "react";

const listFriends = () => {
  const {userId} = useLocalSearchParams()
  const getUserID = () => {
    if (Array.isArray(userId)) {
      return userId[0];
    } else {
      return userId;
    }
  };
  return <ListFriendsScreen userId={getUserID()} />;
};

export default listFriends