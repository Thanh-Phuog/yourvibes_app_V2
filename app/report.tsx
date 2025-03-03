import ReportScreen from "@/src/components/screens/reportPost/views/ReportScreen";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { View } from "react-native";
import Toast from "react-native-toast-message";

const report = () => {
  const { postId, userId, commentId } = useLocalSearchParams();
  const getPostID = () => {
    if (Array.isArray(postId)) {
      return postId[0];
    } else {
      return postId;
    }
  };
  const getUserID = () => {
    if (Array.isArray(userId)) {
      return userId[0];
    } else {
      return userId;
    }
  };
  const getCommentID = () => {
    if (Array.isArray(commentId)) {
      return commentId[0];
    } else {
      return commentId;
    }
  };
  return (
    <ReportScreen
      postId={getPostID()}
      userId={getUserID()}
      commentId={getCommentID()}
    />
  );
};

export default report;
