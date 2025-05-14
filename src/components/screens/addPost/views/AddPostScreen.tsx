import {
  View,
  StatusBar,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  Alert,
} from "react-native";
import { Image } from "expo-image";
import React, { useEffect, useState } from "react";
import useColor from "@/src/hooks/useColor";
import MyInput from "@/src/components/foundation/MyInput";
import { ActivityIndicator, Button } from "@ant-design/react-native";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { Video } from "expo-av";

import { defaultPostRepo } from "@/src/api/features/post/PostRepo";
import AddPostViewModel from "@/src/components/screens/addPost/viewModel/AddpostViewModel";
import { useAuth } from "@/src/context/auth/useAuth";
import { CreatePostRequestModel } from "@/src/api/features/post/models/CreatePostRequestModel";
import { convertMediaToFiles } from "@/src/utils/helper/TransferToFormData";
import Toast from "react-native-toast-message";
import { Privacy } from "@/src/api/baseApiResponseModel/baseApiResponseModel";
import { usePostContext } from "@/src/context/post/usePostContext";

const AddPostScreen = () => {
  const { user, localStrings } = useAuth();
  const savedPost = usePostContext();
  const {
    brandPrimary,
    backgroundColor,
    brandPrimaryTap,
    lightGray,
    backGround,
    darkSlate,
  } = useColor();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  // const [image, setImage] = useState<string | null>(null);
  const {
    postContent,
    setPostContent,
    selectedImageFiles,
    setSelectedImageFiles,
    createPost,
    createLoading,
    privacy,
    setPrivacy,
  } = AddPostViewModel(defaultPostRepo);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Bạn cần cấp quyền truy cập thư viện ảnh!");
      return;
    }
    setLoading(true);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsMultipleSelection: true, // Allow multiple images if needed
        quality: 1,
      });

      if (!result?.canceled && result?.assets) {
        setSelectedImageFiles([...selectedImageFiles, ...result.assets]);
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: localStrings.AddPost.PickImgFailed,
      });
    } finally {
      setLoading(false);
    }
  };

  const takePhoto = async () => {
    // Yêu cầu quyền truy cập camera khi nhấn nút
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Quyền bị từ chối", "Bạn cần cấp quyền để chụp ảnh!");
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      quality: 1,
    });

    if (!result.canceled) {
      // setImage(result.assets[0].uri);
      setSelectedImageFiles([...selectedImageFiles, ...result.assets]);
    }
  };

  const removeImage = (index: number) => {
    const updatedImageFile = [...selectedImageFiles];
    updatedImageFile.splice(index, 1);
    setSelectedImageFiles(updatedImageFile);
  };

  const handleSubmitPost = async () => {
    if (postContent.trim() === "" && selectedImageFiles.length === 0) {
      Toast.show({
        type: "error",
        text1: localStrings.AddPost.CreatePostFailed,
        text2: localStrings.AddPost.EmptyContent,
      });
      return;
    }
    const mediaFiles = await convertMediaToFiles(selectedImageFiles);
    const newPost: CreatePostRequestModel = {
      content: postContent,
      privacy: privacy,
      location: "HCM",
      media: mediaFiles.length > 0 ? mediaFiles : undefined,
    };
    await createPost(newPost);
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
    if (savedPost.savedPostContent) {
      setPostContent(savedPost.savedPostContent);
    }
    if (savedPost.savedPrivacy) {
      setPrivacy(savedPost.savedPrivacy);
    }
  }, [savedPost]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={{ flex: 1, backgroundColor: backGround }}>
        {/* Header */}
        <View
          style={{
            backgroundColor: backgroundColor,
            paddingTop: Platform.OS === "ios" ? 30 : 0,
          }}
        >
          <StatusBar barStyle="dark-content" />
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "flex-end",
              height: 60,
              paddingBottom: 10,
            }}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                paddingHorizontal: 10,
                alignItems: "center",
                backgroundColor: backgroundColor,
                justifyContent: "space-between",
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  router.back();
                }}
              >
                <Ionicons name="close" size={24} color={brandPrimary} />
              </TouchableOpacity>
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 20,
                  marginLeft: 10,
                  color: brandPrimary,
                }}
              >
                {localStrings.AddPost.NewPost}
              </Text>
            </View>
          </View>
        </View>

        {/* Avatar anh Input */}
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            margin: 10,
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
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 16,
                  color: brandPrimary,
                }}
              >
                {user?.family_name + " " + user?.name ||
                  localStrings.Public.UnknownUser}
              </Text>
              <MyInput
                placeholder={localStrings.AddPost.WhatDoYouThink}
                inputStyle={{
                  color: brandPrimary,
                }}
                placeholderTextColor="gray"
                variant="outlined"
                moreStyle={{
                  paddingLeft: 10,
                  marginTop: 10,
                  marginBottom: 5,
                  borderColor: brandPrimaryTap,
                }}
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
        <View style={{ paddingRight: 10, paddingLeft: 60 }}>
          <View
            style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}
          >
            {selectedImageFiles.map((file, index) => (
              <View
                key={index}
                style={{
                  position: "relative",
                  marginRight: 10,
                  marginBottom: 10,
                }}
              >
                {file?.type?.includes("video") ? (
                  <Video
                    source={{ uri: file?.uri }}
                    useNativeControls
                    style={{
                      width: 75,
                      height: 75,
                      borderRadius: 10,
                      backgroundColor: "#f0f0f0",
                    }}
                  />
                ) : (
                  <Image
                    source={{ uri: file?.uri }}
                    style={{
                      width: 75,
                      height: 75,
                      borderRadius: 10,
                      backgroundColor: "#f0f0f0",
                    }}
                  />
                )}
                <TouchableOpacity
                  onPress={() => removeImage(index)}
                  style={{
                    position: "absolute",
                    top: -10,
                    right: -10,
                    backgroundColor: "white",
                    borderRadius: 12,
                    padding: 2,
                  }}
                >
                  <Ionicons name="close" size={18} color={darkSlate} />
                </TouchableOpacity>
              </View>
            ))}
            {/* Take Photo Button  */}
            <TouchableOpacity
              onPress={takePhoto}
              style={{
                width: 75,
                height: 75,
                borderRadius: 10,
                backgroundColor: lightGray,
                alignItems: "center",
                justifyContent: "center",
                marginRight: 10,
              }}
              disabled={loading} // Disable the button while loading
            >
              {loading ? (
                <ActivityIndicator size="small" color={brandPrimary} /> // Show loader when loading
              ) : (
                <FontAwesome5
                  name="camera-retro"
                  size={30}
                  color={brandPrimary}
                />
              )}
            </TouchableOpacity>
            {/* Add Image Button */}
            <TouchableOpacity
              onPress={pickImage}
              style={{
                width: 75,
                height: 75,
                borderRadius: 10,
                backgroundColor: lightGray,
                alignItems: "center",
                justifyContent: "center",
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

        {/* Buttons */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            marginHorizontal: 10,
            marginTop: 20,
          }}
        >
          {/* Privacy Section */}
          <Text style={{ color: "gray", fontSize: 14, paddingRight: 5 }}>
            {localStrings.AddPost.PrivacyText}
          </Text>
          <TouchableOpacity
            onPress={() => {
              savedPost?.setSavedPostContent!(postContent as string);
              savedPost?.setSavedPrivacy!(privacy);
              savedPost?.setSavedSelectedImageFiles!(selectedImageFiles);
              router.push("/object");
            }}
          >
            <Text style={{ color: "gray", fontSize: 14, fontWeight: "bold" }}>
              {renderPrivacyText()}
            </Text>
          </TouchableOpacity>
          <Text style={{ color: "gray", fontSize: 14, paddingRight: 5 }}>
            !
          </Text>

          {/* Post Button */}
          <Button
            style={{
              borderWidth: 1,
              borderColor: "black",
              borderRadius: 20,
              height: 30,
            }}
            size="large"
            onPress={handleSubmitPost}
            loading={createLoading}
          >
            <Text style={{ fontWeight: "bold", fontSize: 16 }}>
              {localStrings.AddPost.PostNow}
            </Text>
          </Button>
        </View>
        <Toast />
      </View>
    </TouchableWithoutFeedback>
  );
};

export default AddPostScreen;
