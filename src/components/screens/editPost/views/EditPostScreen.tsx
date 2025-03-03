import {
  View,
  StatusBar,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from 'react-native';
import { Image } from 'expo-image';
import React, { useEffect, useState } from 'react';
import useColor from '@/src/hooks/useColor';
import MyInput from '@/src/components/foundation/MyInput';
import { ActivityIndicator, Button } from '@ant-design/react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Video } from 'expo-av';
import { defaultPostRepo } from '@/src/api/features/post/PostRepo';
import { useAuth } from '@/src/context/auth/useAuth';
import { CreatePostRequestModel } from '@/src/api/features/post/models/CreatePostRequestModel';
import { convertMediaToFiles } from '@/src/utils/helper/TransferToFormData';
import Toast from 'react-native-toast-message';
import { Privacy } from '@/src/api/baseApiResponseModel/baseApiResponseModel';
import { usePostContext } from '@/src/context/post/usePostContext';
import EditPostViewModel from '../viewModel/EditPostViewModel';
import { UpdatePostRequestModel } from '@/src/api/features/post/models/UpdatePostRequestModel';
import Post from '@/src/components/common/Post';

const EditPostScreen = ({ id }: { id: string }) => {
  const { user, localStrings } = useAuth()
  const savedPost = usePostContext()
  const { brandPrimary, backgroundColor, brandPrimaryTap, lightGray } = useColor();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const {
    postContent,
    setPostContent,
    updatePost,
    updateLoading,
    privacy,
    setPrivacy,
    getDetailPost,
    post,
    mediaIds,
    originalImageFiles,
    setOriginalImageFiles,
    handleMedias,
  } = EditPostViewModel(defaultPostRepo);

  const pickImage = async () => {
    setLoading(true);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsMultipleSelection: true,
        quality: 1,
      });

      if (!result?.canceled && result?.assets) {
        setOriginalImageFiles([...originalImageFiles, ...result.assets]);
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: localStrings.AddPost.PickImgFailed,
      })
    } finally {
      setLoading(false);
    }
  };

  const removeImage = (index: number) => {
    const updatedImageFile = [...originalImageFiles];
    updatedImageFile.splice(index, 1);
    setOriginalImageFiles(updatedImageFile);
  };

  const handleSubmitPost = async () => {
    if (postContent.trim() === '' && originalImageFiles.length === 0) {
      Toast.show({
        type: 'error',
        text1: localStrings.AddPost.CreatePostFailed,
        text2: localStrings.AddPost.EmptyContent,
      })
      return;
    }
    const { detetedMedias, newMediaFiles } = handleMedias(mediaIds, originalImageFiles);

    const mediaFiles = await convertMediaToFiles(newMediaFiles);
    const updatedPost: UpdatePostRequestModel = {
      postId: id,
      content: postContent,
      privacy: privacy,
      location: 'HCM',
      media: mediaFiles.length > 0 ? mediaFiles : undefined,
      media_ids: detetedMedias.length > 0 ? detetedMedias : undefined,
    };
    await updatePost(updatedPost);
  };

  const renderPrivacyText = () => {
    switch (privacy) {
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

  useEffect(() => {
    if (!post) {
      getDetailPost(id)
    }
  }, [post])

  useEffect(() => {
    if (savedPost.savedPostContent) {
      setPostContent(savedPost.savedPostContent)
    }
    if (savedPost.savedPrivacy) {
      setPrivacy(savedPost.savedPrivacy)
    }
  }, [savedPost])

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={{ flex: 1 }}>
        {/* Header */}
        <View style={{ backgroundColor: backgroundColor, paddingTop: Platform.OS === 'ios' ? 30 : 0 }}>
          <StatusBar barStyle="dark-content" />
          <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end', height: 60, paddingBottom: 10 }}>
            <View style={{
              display: 'flex',
              flexDirection: 'row',
              paddingHorizontal: 10,
              alignItems: 'center',
              backgroundColor: backgroundColor,
              justifyContent: 'space-between',
            }}>
              <TouchableOpacity onPress={() => {
                router.back();
              }}>
                <Ionicons name="close" size={24} color={brandPrimary} />
              </TouchableOpacity>
              <Text style={{
                fontWeight: 'bold',
                fontSize: 20,
                marginLeft: 10,
              }}>
                {localStrings.Post.EditPost}
              </Text>
            </View>
          </View>
        </View>

        {/* Avatar anh Input */}
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            margin: 10,
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
              <MyInput
                placeholder={localStrings.AddPost.WhatDoYouThink}
                variant='outlined'
                moreStyle={{ paddingLeft: 10, marginTop: 10, borderColor: brandPrimaryTap }}
                textArea={{
                  autoSize: { minRows: 3 },
                }}
                autoFocus
                value={postContent}
                onChangeText={setPostContent}
              />
            </View>
          </View>
        </View>

        {/* Image Upload Section */}
        {!post?.parent_post ? (
          <>
            <View style={{ paddingRight: 10, paddingLeft: 60 }}>
              <View style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                {originalImageFiles.map((file, index) => (
                  <View key={index} style={{ position: 'relative', marginRight: 10, marginBottom: 10 }}>
                    {file?.uri?.includes('mp4') || file?.uri?.includes('mov') ? (
                      <Video
                        source={{ uri: file?.uri }}
                        useNativeControls
                        style={{ width: 75, height: 75, borderRadius: 10, backgroundColor: '#f0f0f0' }}
                      />
                    ) : (
                      <Image
                        source={{ uri: file?.uri }}
                        style={{ width: 75, height: 75, borderRadius: 10, backgroundColor: '#f0f0f0' }}
                      />
                    )}
                    <TouchableOpacity
                      onPress={() => removeImage(index)}
                      style={{
                        position: 'absolute',
                        top: -10,
                        right: -10,
                        backgroundColor: 'white',
                        borderRadius: 12,
                        padding: 2
                      }}
                    >
                      <Ionicons name="close" size={18} color={brandPrimary} />
                    </TouchableOpacity>
                  </View>
                ))}
                {/* Add Image Button */}
                <TouchableOpacity
                  onPress={pickImage}
                  style={{
                    width: 75,
                    height: 75,
                    borderRadius: 10,
                    backgroundColor: lightGray,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  disabled={loading} // Disable the button while loading
                >
                  {loading ? (
                    <ActivityIndicator size="small" color={brandPrimary} /> // Show loader when loading
                  ) : (
                    <Ionicons name="image-outline" size={30} color={brandPrimary} />
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </>
        ) : (
          <Post post={post?.parent_post} isParentPost />
        )}

        {/* Buttons */}
        <View style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          marginHorizontal: 10,
          marginTop: 20
        }}>
          {/* Privacy Section */}
          <Text style={{ color: 'gray', fontSize: 14, paddingRight: 5 }}>
            {localStrings.AddPost.PrivacyText}
          </Text>
          <TouchableOpacity
            onPress={() => {
              savedPost?.setSavedPostContent!(postContent as string);
              savedPost?.setSavedPrivacy!(privacy);
              savedPost?.setSavedSelectedImageFiles!(originalImageFiles);
              router.push('/object');
            }}
          >
            <Text style={{ color: 'gray', fontSize: 14, fontWeight: 'bold' }}>
              {renderPrivacyText()}
            </Text>
          </TouchableOpacity>
          <Text style={{ color: 'gray', fontSize: 14, paddingRight: 5 }}>
            !
          </Text>

          {/* Post Button */}
          <Button
            style={{
              borderWidth: 1,
              borderColor: 'black',
              borderRadius: 20,
              height: 30,
            }}
            size='large'
            onPress={handleSubmitPost}
            loading={updateLoading}
          >
            <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{localStrings.Public.Save}</Text>
          </Button>
        </View>
        <Toast />
      </View>
    </TouchableWithoutFeedback>
  );
}

export default EditPostScreen