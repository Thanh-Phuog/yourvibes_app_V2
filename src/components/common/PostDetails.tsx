import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
} from "react-native";
import { Image } from "expo-image";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import useColor from "@/src/hooks/useColor";
import usePostDetailsViewModel from "./PostDetailsViewModel/PostDetailsViewModel";
import { useRouter } from "expo-router";
import { useAuth } from "@/src/context/auth/useAuth";
import { useLocalSearchParams } from "expo-router";
import { CommentsResponseModel } from "@/src/api/features/comment/models/CommentResponseModel";
import { ActivityIndicator, Form, Button } from "@ant-design/react-native";
import Post from "./Post";
import { defaultPostRepo } from "@/src/api/features/post/PostRepo";
import { PostResponseModel } from "@/src/api/features/post/models/PostResponseModel";
import dayjs from "dayjs";
import Toast from "react-native-toast-message";
import UserLikePostModal from "./UserLikePostModal";

function PostDetails({
  postId,
  isModal,
}: {
  postId: string;
  isModal: boolean;
}): React.JSX.Element {
  const {
    brandPrimary,
    brandPrimaryTap,
    backgroundColor,
    lightGray,
    backGround,
    borderColor,
  } = useColor();

  const router = useRouter();
  const [replyToCommentId, setReplyToCommentId] = useState<string | null>(null);
  // const postId = useLocalSearchParams().postId as string;
  const { user, localStrings } = useAuth();
  const [commentForm] = Form.useForm();
  // const isModal = useState(false);
  const {
    comments,
    textInputRef,
    userLikes,
    handleLike,
    handleAction,
    handleAddComment,
    handleAddReply,
    setNewComment,
    setReplyToReplyId,
    handleUpdate,
    fetchReplies,
    currentCommentId,
    isEditModalVisible,
    setEditModalVisible,
    replyMap,
    likeCount,
    fetchComments,
    replyToReplyId,
    setEditCommentContent,
    editCommentContent,
    fetchUserLikePosts,
    userLikePost,
    showMoreReplies,
    setShowMoreReplies,
  } = usePostDetailsViewModel(postId, replyToCommentId);
  const [likedComment, setLikedComment] = useState({ is_liked: false });
  const [loading, setLoading] = useState(false);
  const [loadingFetch, setLoadingFetch] = useState(false);
  const [post, setPost] = useState<PostResponseModel | null>(null);
  const parentId = replyToCommentId || replyToReplyId;
  const [isVisible, setIsVisible] = useState(false);

  const fetchPostDetails = async () => {
    try {
      setLoadingFetch(true);
      const fetchedPost = await defaultPostRepo.getPostById(postId);
      if (!fetchedPost?.error) {
        setPost(fetchedPost?.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingFetch(false);
    }
  };

  const renderLikeIcon = useCallback(
    (comment: CommentsResponseModel) => {
      const isLiked = userLikes[comment?.id] === true;
      return isLiked || comment?.is_liked ? (
        <AntDesign name="heart" size={16} color="red" />
      ) : (
        <AntDesign name="hearto" size={16} color={brandPrimaryTap} />
      );
    },
    [userLikes]
  );

  const renderReplies = useCallback(
    (replies: CommentsResponseModel[]) => {
      return (
        <FlatList
          data={replies}
          keyExtractor={(reply) => reply.id.toString()}
          renderItem={({ item: reply }) => {
            return (
              <View
                style={{
                  padding: 10,
                  borderBottomWidth: 1,
                  borderBottomColor: borderColor,
                  backgroundColor: backGround,
                  borderRadius: 5,
                  marginBottom: 10,
                  paddingLeft: 20, // Thụt lề cho các phản hồi lồng nhau
                }}
              >
                {/* Thông tin người dùng và nội dung phản hồi */}
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Image
                    source={{
                      uri:
                        reply?.user?.avatar_url ||
                        "https://i.pravatar.cc/150?img=1",
                    }}
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 15,
                      marginRight: 10,
                    }}
                  />
                  <View>
                    <Text style={{ fontWeight: "bold", color: brandPrimary }}>
                      {reply?.user?.family_name} {reply?.user?.name}
                    </Text>
                    <Text style={{ fontSize: 12, color: "#888" }}>
                      {dayjs(reply.created_at).format("DD/MM/YYYY")}{" "}
                    </Text>
                    <Text style={{ marginVertical: 5, color:brandPrimary }}>{reply.content}</Text>
                  </View>
                </View>
                {/* Nút Thích, Trả lời và Hành động */}
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: 5,
                  }}
                >
                  {/* Like */}
                  <TouchableOpacity
                    onPress={() =>
                      handleLike(reply.id).then(() =>
                        fetchReplies(postId, reply.parent_id as string)
                      )
                    }
                  >
                    {renderLikeIcon(reply)}
                  </TouchableOpacity>

                  <TouchableOpacity style={{ marginLeft: 5 }}>
                    <Text style={{ color: brandPrimary, marginRight: 20 }}>
                      {likeCount[reply.id] || reply.like_count}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => {
                      setReplyToCommentId(reply.parent_id ?? null);
                      setReplyToReplyId(reply.id);
                      textInputRef.current?.focus();
                      fetchReplies(postId, reply.id);
                    }}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginRight: 20,
                    }}
                  >
                    <FontAwesome
                      name="reply"
                      size={16}
                      color={brandPrimaryTap}
                    />
                    <Text style={{ marginLeft: 5, color:brandPrimary }}>
                      {localStrings.Public.Reply}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={{ flexDirection: "row", alignItems: "center" }}
                    onPress={() => handleAction(reply)}
                  >
                    <AntDesign name="bars" size={20} color={brandPrimaryTap} />
                    <Text style={{ marginLeft: 5, color:brandPrimary }}>
                      {localStrings.Public.Action}
                    </Text>
                  </TouchableOpacity>
                </View>
                {/* Nút để xem phản hồi lồng nhau */}
                {reply.rep_comment_count > 0 && (
                  <TouchableOpacity
                    onPress={() => {
                      fetchReplies(postId, reply.id);
                      setShowMoreReplies((prev) => ({
                        ...prev,
                        [reply.id]: !prev[reply.id],
                      }));
                    }}
                    style={{ marginTop: 10 }}
                  >
                    <View style={{ alignItems: "center" }}>
                      <AntDesign
                        name="down"
                        size={16}
                        color={brandPrimaryTap}
                      />
                      <Text style={{ fontSize: 12, color: brandPrimaryTap }}>
                        {showMoreReplies[reply.id]
                          ? `${localStrings.PostDetails.HideReplies}`
                          : `${localStrings.PostDetails.ViewReplies}`}
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}

                {/* Hiển thị các phản hồi lồng nhau */}
                {showMoreReplies[reply.id] && replyMap[reply.id] && (
                  <View style={{ marginTop: 10, paddingLeft: 20 }}>
                    {renderReplies(replyMap[reply.id])}
                  </View>
                )}
              </View>
            );
          }}
        />
      );
    },
    [replyMap, comments, showMoreReplies]
  );

  const renderCommentItem = useCallback(
    (comments: CommentsResponseModel) => {
      return (
        <View
          style={{
            padding: 10,
            borderBottomWidth: 1,
            borderBottomColor: borderColor,
            backgroundColor: backgroundColor,
            borderRadius: 5,
            marginBottom: 5,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Image
              source={{
                uri:
                  comments?.user?.avatar_url ||
                  "https://i.pravatar.cc/150?img=1",
              }}
              style={{
                width: 50,
                height: 50,
                borderRadius: 30,
                marginRight: 10,
              }}
            />
            <View>
              <Text style={{ fontWeight: "bold", color: brandPrimary }}>
                {comments?.user?.family_name} {comments?.user?.name}
              </Text>
              <Text style={{ fontSize: 12, color: "#888" }}>
                {dayjs(comments.created_at).format("DD/MM/YYYY")}
              </Text>
              <Text style={{ marginVertical: 5, color:brandPrimary }}>{comments.content} </Text>
            </View>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {/* Like */}
            <TouchableOpacity
              onPress={() =>
                handleLike(likedComment ? (comments.id as string) : "").then(
                  () => fetchComments()
                )
              }
            >
              {likedComment && comments && renderLikeIcon(comments)}
            </TouchableOpacity>

            <TouchableOpacity style={{ marginLeft: 5, marginRight: 20 }}>
              <Text style={{ color: brandPrimary }}>{comments.like_count}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginRight: 20,
              }}
              onPress={() => {
                setReplyToCommentId(comments.id);
                setReplyToReplyId(null);
                setNewComment("");
                textInputRef.current?.focus();
              }}
            >
              <FontAwesome name="reply" size={20} color={brandPrimaryTap} />
              <Text style={{ marginLeft: 5, color:brandPrimary }}>{localStrings.Public.Reply}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginRight: 20,
              }}
              onPress={() => handleAction(comments)}
            >
              <AntDesign name="bars" size={20} color={brandPrimaryTap} />
              <Text style={{ marginLeft: 5, color:brandPrimary }}>
                {localStrings.Public.Action}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Nút để xem phản hồi */}
          {comments.rep_comment_count > 0 && (
            <TouchableOpacity
              onPress={() => {
                fetchReplies(postId, comments.id);
                setShowMoreReplies((prev) => ({
                  ...prev,
                  [comments.id]: !prev[comments.id],
                }));
              }}
              style={{ marginTop: 10 }}
            >
              <View style={{ alignItems: "center" }}>
                <AntDesign name="down" size={16} color={brandPrimaryTap} />
                <Text style={{ fontSize: 12, color: brandPrimaryTap }}>
                  {showMoreReplies[comments.id]
                    ? `${localStrings.PostDetails.HideReplies}`
                    : `${localStrings.PostDetails.ViewReplies}`}
                </Text>
              </View>
            </TouchableOpacity>
          )}
          {/* Hiển thị các phản hồi */}
          {replyMap[comments.id] &&
            replyMap[comments.id].length > 0 &&
            showMoreReplies[comments.id] && (
              <View style={{ paddingLeft: 20 }}>
                {renderReplies(replyMap[comments.id])}
              </View>
            )}
        </View>
      );
    },
    [comments, replyMap, showMoreReplies]
  );

  const renderFlatList = useCallback(
    (comments: CommentsResponseModel[]) => {
      return (
        <FlatList
          data={comments}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => renderCommentItem(item)}
          ListHeaderComponent={
            isModal === false ? (
              <View style={{ paddingBottom: 5 }}>
                <View style={{ height: 1, backgroundColor: brandPrimaryTap }} />
                <Post noComment={true} post={post as PostResponseModel}>
                  {post?.parent_post && (
                    <Post
                      isParentPost
                      post={post?.parent_post as PostResponseModel}
                    />
                  )}
                </Post>
                
                <TouchableOpacity
                  onPress={() => setIsVisible(true)}
                  style={{
                    backgroundColor: backgroundColor,
                    padding: 10,
                    borderRadius: 5,
                    alignItems: "center",
                  }}
                >
                  <Text style={{ color: brandPrimary }}>
                    {localStrings.Public.WhoLike}
                  </Text>
                </TouchableOpacity>
                <View style={{ height: 1, backgroundColor: borderColor }} />
              </View>
            ) : null
          }
          showsVerticalScrollIndicator={false}
          onRefresh={fetchPostDetails}
          refreshing={loadingFetch}
        />
      );
    },
    [comments, post, replyMap, loadingFetch, showMoreReplies]
  );

  useEffect(() => {
    fetchPostDetails();
  }, [postId]);

  useEffect(() => {
    if (isVisible) {
      fetchUserLikePosts(postId);
    }
  }, [isVisible]);

  return (
<KeyboardAvoidingView
  style={{ flex: 1, backgroundColor: backGround, width: "100%" }}
  behavior={Platform.OS === "ios" ? "padding" : "height"}
>

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1 }}>
          {/* Header */}
          {isModal === false && (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                padding: 16,
              }}
            >
              <TouchableOpacity onPress={() => router.back()}>
                <AntDesign name="arrowleft" size={24} color={brandPrimary} />
              </TouchableOpacity>

              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  marginLeft: 10,
                  color: brandPrimary,
                }}
              >
                {localStrings.Public.Comment}
              </Text>
            </View>
          )}

          {/* FlatList */}
        {loadingFetch ? (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ActivityIndicator size="large" color="#0000ff" />
              <Text>Loading...</Text>
            </View>):!post ? (

<View
  style={{
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  }}
>
  <FontAwesome name="exclamation-circle" color="#ff4d4f" size={40}/>
  <Text style={{ fontSize: 18, color: "gray", marginTop: 10 }}>
    Không tìm thấy bài viết
  </Text>
</View>

          ) : (
           <View style={{ flex: 1, paddingBottom: 20 }}>
              {renderFlatList(comments)}

              {/* comment input */}
              <Form style={{ backgroundColor: backGround }} form={commentForm}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    padding: 10,
                  }}
                >
                  <Image
                    source={{ uri: user?.avatar_url }}
                    style={{
                      width: 45,
                      height: 45,
                      borderRadius: 25,
                      marginRight: 10,
                    }}
                  />
                  <Form.Item noStyle name="comment" layout="vertical">
                    <TextInput
                      ref={textInputRef}
                      style={{
                        flex: 1,
                        borderColor: borderColor,
                        borderWidth: 1,
                        borderRadius: 5,
                        padding: 10,
                        backgroundColor: backgroundColor,
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.25,
                        shadowRadius: 3.84,
                        elevation: 5,
                        color: brandPrimary,
                      }}
                      placeholder={localStrings.Public.CommonActions}
                      placeholderTextColor="gray"
                      value={commentForm.getFieldValue("comment")}
                      onChangeText={(value) =>
                        commentForm.setFieldValue("comment", value)
                      }
                      onBlur={() => setReplyToCommentId(null)}
                    />
                  </Form.Item>
                  <View
                    style={{
                      backgroundColor: backGround,
                      borderRadius: 50,
                      marginLeft: 10,
                      padding: 10,
                      justifyContent: "center",
                      alignItems: "center",
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 1 },
                      shadowOpacity: 0.2,
                      shadowRadius: 1.5,
                      elevation: 5,
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        const comment = commentForm.getFieldValue("comment");
                        if (!comment) {
                          return;
                        }
                        const parentId = setReplyToReplyId
                          ? String(setReplyToReplyId)
                          : replyToCommentId
                          ? String(replyToCommentId)
                          : null;
                        setLoading(true);
                        if (parentId) {
                          handleAddReply(comment).then(() => {
                            setNewComment("");
                            setReplyToReplyId(null);
                            setReplyToCommentId(null);
                            textInputRef.current?.blur();
                            commentForm.resetFields();
                            setLoading(false);
                          });
                        } else {
                          handleAddComment(comment).then(() => {
                            commentForm.resetFields();
                            setLoading(false);
                          });
                        }
                      }}
                    >
                      {loading ? (
                        <ActivityIndicator size="small" color={brandPrimary} />
                      ) : (
                        <FontAwesome
                          name="send-o"
                          size={30}
                          color={brandPrimary}
                        />
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              </Form>
               <UserLikePostModal
              isVisible={isVisible}
              setIsVisible={setIsVisible}
              userLikePost={userLikePost}
            />
            </View>
          )}
          {/* Modal edit comment */}
          <Modal visible={isEditModalVisible} transparent animationType="slide">
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
              }}
            >
              <View
                style={{
                  width: "80%",
                  backgroundColor: "#fff",
                  borderRadius: 10,
                  padding: 20,
                }}
              >
                {/* Avatar và Input chỉnh sửa bình luận */}
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      marginHorizontal: 10,
                    }}
                  >
                    <View>
                      <Image
                        source={{
                          uri:
                            user?.avatar_url ||
                            "https://res.cloudinary.com/dfqgxpk50/image/upload/v1712331876/samples/look-up.jpg",
                        }}
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 30,
                        }}
                      />
                    </View>

                    <View style={{ marginLeft: 10, flex: 1 }}>
                      <View style={{ flexDirection: "column" }}>
                        <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                          {user?.family_name + " " + user?.name ||
                            localStrings.Public.UnknownUser}
                        </Text>

                        <Form>
                          <Form.Item noStyle>
                            <TextInput
                              value={editCommentContent}
                              onChangeText={setEditCommentContent}
                              style={{
                                borderWidth: 1,
                                borderColor: lightGray,
                                borderRadius: 5,
                                padding: 10,
                                backgroundColor: backgroundColor,
                                marginTop: 10,
                              }}
                            />
                          </Form.Item>
                        </Form>
                      </View>
                    </View>
                  </View>
                </TouchableWithoutFeedback>

                {/* Nút lưu và hủy */}
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    marginTop: 20,
                  }}
                >
                  <Button
                    onPress={() => {
                      setEditModalVisible(false);
                      setEditCommentContent(""); // Clear TextInput
                    }}
                    style={{ marginRight: 10 }}
                  >
                    {localStrings.PostDetails.Cancel}
                  </Button>
                  <Button
                    loading={loading}
                    type="primary"
                    onPress={() => {
                      if (currentCommentId && editCommentContent) {
                        setLoading(true);
                        handleUpdate(
                          currentCommentId,
                          editCommentContent,
                          parentId || "",
                          !!parentId
                        ).then(() => {
                          setLoading(false);
                          setEditModalVisible(false);
                          setEditCommentContent(""); // Clear TextInput
                        });
                      } else {
                        console.error("Invalid comment ID or content");
                      }
                    }}
                  >
                    {localStrings.Public.Save}
                  </Button>
                </View>
              </View>
            </View>
          </Modal>
        </View>
      </TouchableWithoutFeedback>
      <Toast />
    </KeyboardAvoidingView>
  );
}
export default PostDetails;
