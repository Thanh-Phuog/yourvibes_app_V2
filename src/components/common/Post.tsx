import { View, Text, TouchableOpacity, TouchableWithoutFeedback, Keyboard, Platform, KeyboardAvoidingView } from 'react-native';
import { Image } from 'expo-image';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Button, Card, Form, Modal } from '@ant-design/react-native';
import { Entypo, AntDesign, FontAwesome, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import useColor from '@/src/hooks/useColor';
import { PostResponseModel } from '@/src/api/features/post/models/PostResponseModel';
import MediaView from '../foundation/MediaView';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { useAuth } from '@/src/context/auth/useAuth';
import { router } from 'expo-router';
import { getTimeDiff } from '../../utils/helper/DateTransfer';
import EditPostViewModel from '../screens/editPost/viewModel/EditPostViewModel';
import { defaultPostRepo } from '@/src/api/features/post/PostRepo';
import { Privacy } from '@/src/api/baseApiResponseModel/baseApiResponseModel';
import MyInput from '../foundation/MyInput';
import HomeViewModel from '../screens/home/viewModel/HomeViewModel';
import { defaultNewFeedRepo } from '@/src/api/features/newFeed/NewFeedRepo';
import PostDetails from './PostDetails';

interface IPost {
  post?: PostResponseModel,
  isParentPost?: boolean,
  noFooter?: boolean,
  children?: React.ReactNode,
  noComment?: boolean,
  isVisible?: boolean
}

const Post: React.FC<IPost> = React.memo(({
  post,
  isParentPost = false,
  noFooter = false,
  children,
  noComment = false,
  isVisible = false,
}) => {
  const { brandPrimary, brandPrimaryTap, lightGray, backgroundColor } = useColor();
  const { user, localStrings } = useAuth();
  const [shareForm] = Form.useForm();
  const { showActionSheetWithOptions } = useActionSheet();
  const [showSharePopup, setShowSharePopup] = useState(false);
  const [showCommentPopup, setShowCommentPopup] = useState(false);
  const [sharePostPrivacy, setSharePostPrivacy] = useState<Privacy | undefined>(Privacy.PUBLIC);
  const {
    deleteLoading,
    likePost,
    likedPost,
    setLikedPost,
    sharePost,
    shareLoading,
    deletePost,
  } = EditPostViewModel(defaultPostRepo);
  const { deleteNewFeed } = HomeViewModel(defaultNewFeedRepo)

  const showAction = () => {
    const options = user?.id === post?.user?.id ? [
      localStrings.Post.EditPost,
      localStrings.Post.DeletePost,
      localStrings.Post.Advertisement,
      localStrings.Public.Cancel
    ] : [
      localStrings.Post.ReportPost,
      localStrings.Post.DeleteNewFeed,
      localStrings.Public.Cancel
    ];

    showActionSheetWithOptions(
      {
        title: localStrings.Public.Action,
        options: options,
        cancelButtonIndex: options.length - 1,
        cancelButtonTintColor: "#F95454"
      },
      (buttonIndex) => {
        if (user?.id === post?.user?.id) {
          switch (buttonIndex) {
            case 0:
              router.push(`/edit-post/${post?.id}`);
              break;
            case 1:
              Modal.alert(
                localStrings.Public.Confirm,
                localStrings.DeletePost.DeleteConfirm,
                [
                  { text: localStrings.Public.Cancel, style: 'cancel' },
                  { text: localStrings.Public.Confirm, onPress: () => deletePost && deletePost(post?.id as string) },
                ]
              );
              break;
            case 2:
              router.push(`/ads?postId=${post?.id}`);
              break;
            default:
              break;
          }
        } else {
          switch (buttonIndex) {
            case 0:
              router.push(`/report?postId=${post?.id}`);
              break;
            case 1:
              Modal.alert(
                localStrings.Public.Confirm,
                localStrings.DeletePost.DeleteConfirm,
                [
                  { text: localStrings.Public.Cancel, style: 'cancel' },
                  { text: localStrings.Public.Confirm, onPress: () => deleteNewFeed && deleteNewFeed(post?.id as string) },

                ]
              );
              break;
            default:
              break;
          }
        }
      }
    );
  };

  useEffect(() => {
    setLikedPost(post);
  }, [post]);

  const renderPrivacyIcon = () => {
    switch (likedPost?.privacy) {
      case Privacy.PUBLIC:
        return <Ionicons name="globe" size={16} color={brandPrimaryTap} />;
      case Privacy.FRIEND_ONLY:
        return <Ionicons name="people" size={16} color={brandPrimaryTap} />;
      case Privacy.PRIVATE:
        return <Ionicons name="lock-closed" size={16} color={brandPrimaryTap} />;
      default:
        return null;
    }
  }

  const renderPrivacyText = () => {
    switch (sharePostPrivacy) {
      case Privacy.PUBLIC:
        return localStrings.Public.Everyone.toLowerCase();
      case Privacy.FRIEND_ONLY:
        return localStrings.Public.Friend.toLowerCase();
      case Privacy.PRIVATE:
        return localStrings.Public.Private.toLowerCase();
      default:
        return localStrings.Public.Everyone.toLowerCase();
    }
  };

  const renderLikeIcon = useCallback(() => {
    if (likedPost?.is_liked) {
      return <AntDesign name="heart" size={16} color={"red"} />;
    } else {
      return <AntDesign name="hearto" size={16} color={brandPrimaryTap} />;
    }
  }, [likedPost?.is_liked]);

  return (
    <Card style={{
      margin: 10,
      borderColor: isParentPost ? brandPrimary : "white",
    }}
    >
      {/* Header */}
      <Card.Header
        style={{
          height: 60,
          width: '100%',
        }}
        title={
          <View style={{ flexDirection: 'row', marginRight: 8 }}>
            <View style={{ flexDirection: 'column', marginLeft: 8, width: '92%' }}>
              <TouchableOpacity
                onPress={() => router.push(`/(tabs)/user/${likedPost?.user?.id}`)}
              >
                <Text style={{ fontWeight: 'bold', fontSize: 14 }}>{likedPost?.user?.family_name} {likedPost?.user?.name}</Text>
              </TouchableOpacity>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {likedPost?.is_advertisement ? (
                  <>
                    <Text style={{ color: brandPrimaryTap, fontSize: 12, opacity: 0.5, marginRight: 10 }}>{localStrings.Post.Sponsor}</Text>
                    <MaterialCommunityIcons name="advertisements" size={16} color={brandPrimaryTap} />
                  </>)
                  : (
                    <>
                      <Text style={{ color: brandPrimaryTap, fontSize: 12, opacity: 0.5, marginRight: 10 }}>{getTimeDiff(likedPost?.created_at, localStrings)}</Text>
                      {renderPrivacyIcon()}
                    </>
                  )
                }

              </View>
            </View>
            {isParentPost || noFooter ? null : (
              <TouchableOpacity
                style={{ width: '8%', display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}
                onPress={showAction}
              >
                <Entypo name="dots-three-vertical" size={16} />
              </TouchableOpacity>
            )}
          </View>
        }
        thumb={
          <TouchableOpacity
            onPress={() => router.push(`/(tabs)/user/${likedPost?.user?.id}`)}
          >
            <Image
              source={{ uri: likedPost?.user?.avatar_url }}
              style={{
                width: 40,
                height: 40,
                borderRadius: 30
              }}
            />
          </TouchableOpacity>
        }
      />

      {/* Content */}
      {!isParentPost && children ? (
         <View>
         {likedPost?.content && (
           <View style={{ paddingLeft: 10 }}>
            <TouchableOpacity onPress={() => router.push(`/postDetails?postId=${likedPost?.id}`)}>
             <Text>{likedPost?.content}</Text>
            </TouchableOpacity>
           </View>
         )}
         {children}
       </View>
      ): (likedPost?.content &&
        likedPost?.parent_id ? (
        <View>
                  <View style={{ paddingLeft: 10 }}>
                  <TouchableOpacity onPress={() => router.push(`/postDetails?postId=${likedPost?.id}`)}>
                    <Text>{likedPost?.content}</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={{padding: 5}}>
                    <View style={{ padding: 30, borderColor: "#000", borderWidth: 1, borderRadius: 5 }}>
                      <Text style={{ textAlign: 'center', fontWeight: "bold", fontSize: 16 }}>
                        {localStrings.Post.NoContent}
                      </Text>
                      <Text style={{ textAlign: 'center', color: "gray" }}>
                       <Entypo name="emoji-sad" size={24} color="gray" />
                      </Text>
                      <Text style={{ textAlign: 'center', fontSize: 14, color: "gray" }}>
                        Nội dung đã bị xoá hoặc cài đặt quyền riêng tư bởi người dùng
                      </Text>
                    </View>
                  </View>
                </View>
        ):(
          (
            <View style={{ paddingHorizontal: 20 }}>
            {likedPost?.content && (
              <View style={{ paddingBottom: 5, paddingLeft: 0 }}>
                 <TouchableOpacity onPress={() => router.push(`/postDetails?postId=${likedPost?.id}`)}>
                  <Text>{likedPost?.content}</Text>
                 </TouchableOpacity>
                
              </View>
            )}
            {likedPost?.media && likedPost?.media?.length > 0 &&
              <MediaView
                mediaItems={likedPost?.media}
                isVisible={isVisible}
              />
            }
          </View>
    
          )
        )
      )
    }

      {/* Footer */}
      {isParentPost || noFooter ? (
        <></>
      ) : (
        <Card.Footer
          content={
            <View style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              height: 30,
              marginTop: 10,
              paddingLeft: 50,
              paddingRight: 20
            }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <TouchableOpacity onPress={() => {
                  likePost(likedPost?.id as string)
                }}
                >
                  {renderLikeIcon()}
                </TouchableOpacity>
                <TouchableOpacity style={{ marginLeft: 5 }}>
                  <Text style={{ color: brandPrimary }}>{likedPost?.like_count}</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity disabled={noComment} style={{ flexDirection: "row", alignItems: "center" }} onPress={() => {setShowCommentPopup(true); console.log("Modal Post ID:", likedPost?.id);
              }} >
                <FontAwesome name="comments-o" size={20} color={brandPrimary} />
                <Text style={{ marginLeft: 5, color: brandPrimary }}>{likedPost?.comment_count}</Text>
              </TouchableOpacity>

              {shareLoading ? (
                <>
                  <ActivityIndicator size={'small'} />
                </>
              ) : (
                <>
                  <TouchableOpacity
                    onPress={() => {
                      // sharePost(likedPost?.id as string);
                      setShowSharePopup(true);
                      shareForm.setFieldValue("privacy", Privacy.PUBLIC);
                    }}
                  >
                    <AntDesign name="sharealt" size={20} color={brandPrimary} />
                  </TouchableOpacity>
                </>
              )}
            </View>
          }
        />
      )}

      {/* Loading */}
      <ActivityIndicator
        animating={deleteLoading}
        toast
        size="large"
        text="Deleting..."
      />
      
      {/* Comment popup */}
      <Modal 
        popup
        visible={showCommentPopup}
        animationType="slide-up"
        maskClosable
        onClose={() => setShowCommentPopup(false)}
      >
        {/* <View style={{height:600 }}> */}
        <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10, textAlign: "center" }}> 
            {localStrings.Public.Comment}
          </Text>
        <PostDetails postId={likedPost?.id as string} isModal={true} />
        {/* </View> */}
      </Modal>

      {/* Share popup */}
      <Modal
        popup
        visible={showSharePopup}
        animationType="slide-up"
        maskClosable
        onClose={() => setShowSharePopup(false)}>
        <KeyboardAvoidingView
          style={{ backgroundColor: backgroundColor, width: '100%' }}
          behavior={'height'}
        >
          <View style={{ paddingVertical: 20, height: Platform.OS === 'ios' ? 600 : 600 }}>
            <Form form={shareForm} style={{ backgroundColor, borderWidth: 0 }}>
              {/* Avatar anh Input */}
              <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    marginHorizontal: 10,
                  }}>
                  <View>
                    <Image
                      source={{ uri: user?.avatar_url || "https://res.cloudinary.com/dfqgxpk50/image/upload/v1712331876/samples/look-up.jpg" }}
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 30
                      }}
                    />
                  </View>
                  <View style={{ marginLeft: 10, flex: 1 }}>
                    <View style={{ flexDirection: 'column' }}>
                      <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{user?.family_name + " " + user?.name || localStrings.Public.UnknownUser}</Text>
                      <Form.Item name="content" noStyle>
                        <MyInput
                          placeholder={localStrings.AddPost.WhatDoYouThink}
                          variant='outlined'
                          moreStyle={{ paddingLeft: 10, marginTop: 10, borderColor: brandPrimaryTap }}
                          textArea={{
                            autoSize: { minRows: 3, maxRows: 3 },
                          }}
                          autoFocus
                        />
                      </Form.Item>
                    </View>
                  </View>
                </View>
              </TouchableWithoutFeedback>

              {/* Buttons */}
              <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginHorizontal: 10,
                marginTop: 20
              }}>
                {/* Privacy Section */}
                <View style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  alignItems: 'center'
                }}>
                  <Text style={{ color: 'gray', fontSize: 14, paddingRight: 5 }}>
                    {localStrings.AddPost.PrivacyText}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      Modal.operation([
                        { text: localStrings.Public.Everyone, onPress: () => setSharePostPrivacy(Privacy.PUBLIC) },
                        { text: localStrings.Public.Friend, onPress: () => setSharePostPrivacy(Privacy.FRIEND_ONLY) },
                        { text: localStrings.Public.Private, onPress: () => setSharePostPrivacy(Privacy.PRIVATE) },
                      ])
                    }}
                    style={{ flexDirection: 'row', alignItems: 'center' }}
                  >
                    <Text style={{ color: 'gray', fontSize: 14, fontWeight: 'bold' }}>
                      {renderPrivacyText()}!
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Post Button */}
                <Button
                  style={{
                    borderWidth: 1,
                    borderColor: 'black',
                    borderRadius: 20,
                    height: 30,
                  }}
                  size='large'
                  onPress={() => {
                    sharePost(likedPost?.id as string, {
                      content: shareForm.getFieldValue("content"),
                      privacy: sharePostPrivacy,
                    }).then(() => {
                      setShowSharePopup(false)
                    });
                  }}
                  loading={shareLoading}
                >
                  <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{localStrings.Post.SharePost}</Text>
                </Button>
              </View>

              {/* Parent Post */}
              <Post post={likedPost?.parent_post || likedPost} isParentPost />
            </Form>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </Card >
  );
})

export default Post;