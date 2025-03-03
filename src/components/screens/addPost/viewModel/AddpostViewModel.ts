import { Privacy } from "@/src/api/baseApiResponseModel/baseApiResponseModel";
import { CreatePostRequestModel } from "@/src/api/features/post/models/CreatePostRequestModel";
import { PostRepo } from "@/src/api/features/post/PostRepo";
import { useAuth } from "@/src/context/auth/useAuth";
import { usePostContext } from "@/src/context/post/usePostContext";
import { ImagePickerAsset } from "expo-image-picker";
import { router } from "expo-router";
import { useState } from "react";
import Toast from "react-native-toast-message";

const AddPostViewModel = (repo: PostRepo) => {
  const { localStrings } = useAuth();
  const { clearSavedPost } = usePostContext();
  const [createLoading, setCreateLoading] = useState<boolean>(false);
  const [postContent, setPostContent] = useState('');
  const [selectedImageFiles, setSelectedImageFiles] = useState<ImagePickerAsset[]>([]);
  const [privacy, setPrivacy] = useState<Privacy | undefined>(Privacy.PUBLIC);

  const createPost = async (data: CreatePostRequestModel) => {
    try {
      setCreateLoading(true);
      const response = await repo.createPost(data);
      if (!response?.error) {
        setPostContent('');
        setSelectedImageFiles([]);
        clearSavedPost!();
        router.push('/(tabs)/profile?tabNum=1');
        Toast.show({
          type: "success",
          text1: localStrings.AddPost.CreatePostSuccess,
        })
      } else {
        Toast.show({
          type: "error",
          text1: localStrings.AddPost.CreatePostFailed,
          text2: response?.error?.message
        })
      }
    } catch (err: any) {
      console.error( err);
      Toast.show({
        type: "error",
        text1: localStrings.AddPost.CreatePostFailed,
        text2: err.message
      })
    } finally {
      setCreateLoading(false);
    }
  };

  return {
    createLoading,
    createPost,
    postContent,
    setPostContent,
    selectedImageFiles,
    setSelectedImageFiles,
    privacy,
    setPrivacy
  };
};

export default AddPostViewModel;