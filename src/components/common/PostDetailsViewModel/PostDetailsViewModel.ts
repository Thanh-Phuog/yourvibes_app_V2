import { useState, useRef, useEffect } from "react";
import { TextInput } from "react-native";
import { Modal } from '@ant-design/react-native';
import { useActionSheet } from "@expo/react-native-action-sheet";
import { useAuth } from "@/src/context/auth/useAuth";
import Toast from "react-native-toast-message";
//Comments
import { CommentsResponseModel } from "@/src/api/features/comment/models/CommentResponseModel";
import { defaultCommentRepo } from "@/src/api/features/comment/CommentRepo";
import { CreateCommentsRequestModel } from "@/src/api/features/comment/models/CreateCommentsModel";
//LikeComments
import { defaultLikeCommentRepo } from "@/src/api/features/likeComment/LikeCommentRepo";
import { LikeCommentResponseModel } from "@/src/api/features/likeComment/models/LikeCommentResponses";
//UserLikePost

import { router } from "expo-router";
import { defaultPostRepo } from "@/src/api/features/post/PostRepo";
import { LikeUsersModel } from "@/src/api/features/post/models/LikeUsersModel";

const usePostDetailsViewModel = (
  postId: string,
  replyToCommentId: string | null
) => {
  const { showActionSheetWithOptions } = useActionSheet();
  const [comments, setComments] = useState<CommentsResponseModel[]>([]);

  const [replyMap, setReplyMap] = useState<{
    [key: string]: CommentsResponseModel[];
  }>({});

  const [likeCount, setLikeCount] = useState<{ [key: string]: number }>({});
  const [userLikes, setUserLikes] = useState<{ [key: string]: boolean }>({});
  const [newComment, setNewComment] = useState("");
  const [replyToReplyId, setReplyToReplyId] = useState<string | null>(null);
  const [setReplyToCommentId] = useState<string | null>(null);

  const [likeIcon, setLikeIcon] = useState("heart-outline");
  const textInputRef = useRef<TextInput>(null);
  const [renderLikeIconState, setRenderLikeIconState] = useState(false);

  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [editCommentContent, setEditCommentContent] = useState("");
  const [currentCommentId, setCurrentCommentId] = useState("");
  const [userLikePost, setUserLikePost] = useState<LikeUsersModel[]>([]);
  const { user, localStrings } = useAuth();
  const [lastChange, setLastChange] = useState(false);
  const [showMoreReplies, setShowMoreReplies] = useState<{
    [key: string]: boolean;
  }>({});

  const fetchComments = async () => {
    const response = await defaultCommentRepo.getComments({
      PostId: postId,
      page: 1,
      limit: 10,
    });
    if (response && response?.message === "Success") {
      setComments(response?.data);
    }
  };

  const fetchReplies = async (postId: string, parentId: string) => {
    try {
      const replies = await defaultCommentRepo.getReplies(postId, parentId);
      if (replies && replies.data) {
        setReplyMap((prevReplyMap) => {
          return {
            ...prevReplyMap,
            [parentId]: replies.data,
          };
        });
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: `${localStrings.PostDetails.ErrorReplies}`,
      });
      console.error("Error fetching replies:", error);
    }
  };

  const handleAction = (comment: CommentsResponseModel) => {
    const options = [
      `${localStrings.PostDetails.ReportComment}`,
      `${localStrings.PostDetails.EditComment}`,
      `${localStrings.PostDetails.DeleteComment}`,
      `${localStrings.PostDetails.Cancel}`,
    ];
    const reply = replyMap[comment?.id];

    if (comment && comment.user?.id !== user?.id) {
      options.splice(1, 2);
    } else if (reply && reply.length > 0 && reply[0].user?.id !== user?.id) {
      options.splice(1, 2);
    }

    showActionSheetWithOptions(
      {
        title: `${localStrings.PostDetails.ActionOptions}`,
        options: options,
        cancelButtonIndex: options.length - 1,
        cancelButtonTintColor: "#F95454",
      },
      (buttonIndex) => {
        if (comment.user?.id === user?.id || (reply && reply.length > 0 && reply[0].user?.id === user?.id)) {
          switch (buttonIndex) {
            case 0:
              router.push(`/report?commentId=${comment.id}`);
              break;
            case 1:
              setEditCommentContent(comment.content);
              setCurrentCommentId(comment.id);
              setEditModalVisible(true);
              break;
            case 2:
              handleDelete(comment.id);
              break;
            default:
              break;
          }
        } else {
          switch (buttonIndex) {
            case 0:
              router.push(`/report?commentId=${comment.id}`);
              break;
            default:
              break;
          }
        }
      }
    );
  };

  const handleLike = async (commentOrReplyId: string) => {
    const isLike =
      userLikes[commentOrReplyId] === undefined
        ? true
        : !userLikes[commentOrReplyId];

    try {
      const response = await defaultLikeCommentRepo.postLikeComment({
        commentId: commentOrReplyId,
        isLike,
      });

      if (response && response.data) {
        const likeCommentResponse: LikeCommentResponseModel = response.data;
        // Cập nhật trạng thái like dựa trên response trả về
        setUserLikes((prevUserLikes) => ({
          ...prevUserLikes,
          [commentOrReplyId]: likeCommentResponse.is_liked ?? false,
        }));
        setLikeCount((prevLikes) => ({
          ...prevLikes,
          [commentOrReplyId]: likeCommentResponse.like_count,
        }));

        // Cập nhật biến renderLikeIconState
        setRenderLikeIconState(Boolean(likeCommentResponse.is_liked));
      }
    } catch (error) {
      console.error("Error liking comment:", error);
    }
  };

  const handleEditComment = async (commentId: string) => {
    if (!currentCommentId || !editCommentContent) {
      console.error("Invalid comment ID or content");
      return;
    }

    await handleUpdate(currentCommentId, editCommentContent, commentId);
    setEditModalVisible(false); // Close modal
    setEditCommentContent("");
    setCurrentCommentId("");
  };

  const handleUpdate = async (
    commentId: string,
    updatedContent: string,
    parentId: string,
    isReply = false
  ) => {
    try {
      const updateCommentData = {
        comments_id: commentId,
        content: updatedContent,
      };

      const response = await defaultCommentRepo.updateComment(
        commentId,
        updateCommentData
      );
      if (response && response.data) {
        fetchComments();
        const parentCommentID = findParentId(replyMap, commentId);
        const rootCommentID = findParentId(replyMap, parentCommentID ?? "");
        parentCommentID && fetchReplies(postId, parentCommentID);
        rootCommentID && fetchReplies(postId, rootCommentID);
        Toast.show({
          type: "success",
          text1: `${localStrings.PostDetails.EditCommentSuccess}`,
        });
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: `${localStrings.PostDetails.EditCommentFailed}`,
      });
    }
  };

  const handleDelete = (commentId: string) => {
    Modal.alert(
      localStrings.PostDetails.DeleteComment + "?", "",
      [
        { text: localStrings.Public.Cancel, style: 'cancel' },
        { text: localStrings.Public.Confirm, onPress: () => handleDeleteLogic(commentId) },
      ]
    )
  };

  const handleDeleteLogic = async (commentId: string) => {
    try {
      const res = await defaultCommentRepo.deleteComment(commentId);
      if (res && res?.message === 'Success') {
        const parentCommentID = findParentId(replyMap, commentId);
        fetchComments();
        const rootCommentID = findParentId(replyMap, parentCommentID ?? "");
        console.log("parentCommentID", parentCommentID);
        console.log("rootCommentID", rootCommentID);
        setReplyMap((prev) => {
          return {
            ...prev,
            [commentId]: prev[commentId]?.filter(
              (comment) => comment.id !== commentId
            ) || [],
          }
        });
        parentCommentID && setShowMoreReplies((prev) => {
          return {
            ...prev,
            [parentCommentID]: false,
          }
        });
        parentCommentID && fetchReplies(postId, parentCommentID);
        rootCommentID && fetchReplies(postId, rootCommentID);
        Toast.show({
          type: "success",
          text1: `${localStrings.PostDetails.DeteleReplySuccess}`,
        });
      }
    } catch (error) {
      console.error(error);
      Toast.show({
        type: "error",
        text1: `${localStrings.PostDetails.DeteleReplyFailed}`,
      });
    }
  }

  const handleAddComment = async (comment: string) => {
    if (comment.trim()) {
      const commentData: CreateCommentsRequestModel = {
        post_id: postId,
        content: comment,
      };
      try {
        const response = await defaultCommentRepo.createComment(commentData);
        if (!response.error) {
          fetchComments(); // Gọi lại hàm fetchComments để cập nhật lại danh sách comment
        } else {
          Toast.show({
            type: "error",
            text1: `${localStrings.PostDetails.CommentFailed}`,
          });
        }
      } catch (error) {
        console.error("Error adding comment:", error);
        Toast.show({
          type: "error",
          text1: `${localStrings.PostDetails.CommentFailed}`,
        });
      } finally {
        setNewComment("");
        textInputRef.current?.blur();
      }
    }
  };

  const handleAddReply = async (comment: string) => {
    if (comment.trim()) {
      const parentId = replyToReplyId || replyToCommentId;

      const commentData: CreateCommentsRequestModel = {
        post_id: postId,
        content: comment,
        parent_id: parentId,
      };
      const rootCommentID = findParentId(replyMap, parentId || "");
      try {
        const response = await defaultCommentRepo.createComment(commentData);
        if (!response.error) {
          fetchComments();
          parentId && fetchReplies(postId, parentId);
          rootCommentID && fetchReplies(postId, rootCommentID);
        } else {
          Toast.show({
            type: "error",
            text1: `${localStrings.PostDetails.ReplyFailed}`,
          });
        }
      } catch (error) {
        console.error("Error adding comment:", error);
        Toast.show({
          type: "error",
          text1: `${localStrings.PostDetails.ReplyFailed}`,
        });
      } finally {
        setNewComment("");
        setReplyToReplyId(null);
        textInputRef.current?.blur();
      }
    }
  };

  const fetchUserLikePosts = async (postId: string) => {
    const response = await defaultPostRepo.getPostLikes({
      postId: postId,
      page: 1,
      limit: 10,
    });
    setUserLikePost(response.data);
  };

  const findParentId = (
    hashMap: { [key: string]: CommentsResponseModel[] },
    commentId: string
  ) => {
    for (const key in hashMap) {
      const comments = hashMap[key];
      for (const comment of comments) {
        if (comment.id === commentId) {
          return key; // Trả về parent_id (key của hashMap)
        }
      }
    }
    return null;
  };

  useEffect(() => {
    if (!lastChange) {
      setLastChange(true);
    }
  }, [editCommentContent]);

  useEffect(() => {
    fetchComments();
  }, []);

  return {
    comments,
    likeCount,
    userLikes,
    newComment,
    replyToCommentId,
    replyToReplyId,
    textInputRef,
    handleLike,
    handleAddComment,
    handleAddReply,
    setNewComment,
    setReplyToCommentId,
    setReplyToReplyId,
    fetchReplies,
    handleUpdate,
    handleDelete,
    handleAction,
    isEditModalVisible,
    setEditModalVisible,
    editCommentContent,
    setEditCommentContent,
    handleEditComment,
    currentCommentId,
    replyMap,
    likeIcon,
    fetchComments,
    userLikePost,
    fetchUserLikePosts,
    showMoreReplies,
    setShowMoreReplies,
    findParentId
  };
};

export default usePostDetailsViewModel;