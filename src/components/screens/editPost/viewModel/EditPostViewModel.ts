import { Privacy } from "@/src/api/baseApiResponseModel/baseApiResponseModel";
import { PostResponseModel } from "@/src/api/features/post/models/PostResponseModel";
import { SharePostRequestModel } from "@/src/api/features/post/models/SharePostRequestModel";
import { UpdatePostRequestModel } from "@/src/api/features/post/models/UpdatePostRequestModel";
import { PostRepo } from "@/src/api/features/post/PostRepo"
import { useAuth } from "@/src/context/auth/useAuth";
import { ImagePickerAsset } from "expo-image-picker";
import { router } from "expo-router";
import { useState } from "react";
import Toast from "react-native-toast-message";

const EditPostViewModel = (repo: PostRepo) => {
  const { localStrings } = useAuth();
  const [updateLoading, setUpdateLoading] = useState<boolean>(false);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const [postContent, setPostContent] = useState('');
  const [originalImageFiles, setOriginalImageFiles] = useState<ImagePickerAsset[]>([]);
  const [privacy, setPrivacy] = useState<Privacy | undefined>(Privacy.PUBLIC);
  const [post, setPost] = useState<PostResponseModel | undefined>(undefined);
  const [mediaIds, setMediaIds] = useState<string[]>([]);
  const [likedPost, setLikedPost] = useState<PostResponseModel | undefined>(undefined);
  const [shareLoading, setShareLoading] = useState<boolean>(false);
  const [hidePost, setHidePost] = useState<PostResponseModel[]>([]);

  const updatePost = async (data: UpdatePostRequestModel) => {
    try {
      setUpdateLoading(true);
      const res = await repo.updatePost(data);
      console.log("Update Post Response: ", res);
      
      if (!res?.error) {
        Toast.show({
          type: "success",
          text1: localStrings.UpdatePost.UpdatePostSuccess
        })
        setPostContent('');
        setOriginalImageFiles([]);
        setMediaIds([]);
        setPrivacy(Privacy.PUBLIC);
        router.push("/(tabs)/profile?tabNum=1");
      } else {
        Toast.show({
          type: "error",
          text1: localStrings.UpdatePost.UpdatePostFailed,
          text2: res?.error?.message
        })
      }
    } catch (err: any) {
      console.error(err);
      Toast.show({
        type: "error",
        text1: localStrings.UpdatePost.UpdatePostFailed,
        text2: err.message
      })
    } finally {
      setUpdateLoading(false);
    }
  };

  const getDetailPost = async (id: string) => {
    try {
      setUpdateLoading(true);
      const res = await repo.getPostById(id);
      if (!res?.error) {
        setPost(res?.data);
        setPostContent(res?.data?.content || '')
        setPrivacy(res?.data?.privacy)
        setMediaIds(res?.data?.media?.map((item) => item?.id?.toString() || '') || [])
        const mediaFiles = res?.data?.media?.map((item) => ({ uri: item?.media_url || '', fileName: item?.id?.toString() || '' })) as ImagePickerAsset[] || []
        setOriginalImageFiles(mediaFiles)
      } else {
        Toast.show({
          type: "error",
          text1: localStrings.Profile.Posts.GetOnePostFailed,
          text2: res?.error?.message
        })
        router.back();
      }
    } catch (err: any) {
      console.error(err);
      Toast.show({
        type: "error",
        text1: localStrings.Profile.Posts.GetOnePostFailed,
        text2: err.message
      })
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleMedias = (mediaIds: string[], newMedias: ImagePickerAsset[]) => {
    let detetedMedias: string[] = []
    let savedMedias: string[] = []
    let newMediaFiles: ImagePickerAsset[] = []

    newMedias?.forEach((item) => {
      if (!mediaIds.includes(item?.fileName as string)) {
        newMediaFiles.push(item)
      } else {
        const ids = mediaIds.find((id) => id === item?.fileName) as string
        savedMedias.push(ids)
      }
    })

    detetedMedias = mediaIds?.filter((id) => !savedMedias.includes(id))

    return {
      detetedMedias,
      newMediaFiles
    }
  }

  const deletePost = async (id: string) => {
    try {
      setDeleteLoading(true);
      const res = await repo.deletePost(id);
      // cập nhật lại danh sách không cần reload lại trang
      setHidePost(hidePost => hidePost.filter(post => post.id !== id));
      if (!res?.error) {
        Toast.show({
          type: "success",
          text1: localStrings.DeletePost.DeleteSuccess
        })
        router.push('/(tabs)/profile?tabNum=1');
      } else {
        Toast.show({
          type: "error",
          text1: localStrings.DeletePost.DeleteFailed,
          text2: res?.error?.message
        })
      }
    } catch (err: any) {
      console.error(err);
      Toast.show({
        type: "error",
        text1: localStrings.DeletePost.DeleteFailed,
        text2: err.message
      })
    } finally {
      setDeleteLoading(false);
    }
  }

  const likePost = async (id: string) => {
    try {
      const res = await repo.likePost(id);
      if (!res?.error) {
        setLikedPost(res?.data);
      } else {
        Toast.show({
          type: "error",
          text1: localStrings.Post.LikePostFailed,
          text2: res?.error?.message
        })
      }
    } catch (error: any) {
      console.error(error);
      Toast.show({
        type: "error",
        text1: localStrings.Post.LikePostFailed,
        text2: error?.error?.message
      })
    }
  }

  const sharePost = async (id: string, data: SharePostRequestModel) => {
    try {
      setShareLoading(true);
      const res = await repo.sharePost(id, data);
      if (!res?.error) {
        Toast.show({
          type: "success",
          text1: localStrings.Post.SharePostSuccess
        })
        router.push('/(tabs)/profile?tabNum=1');
      } else {
        Toast.show({
          type: "error",
          text1: localStrings.Post.SharePostFailed,
          text2: res?.error?.message
        })
      }
    } catch (error: any) {
      console.error(error);
      Toast.show({
        type: "error",
        text1: localStrings.Post.SharePostFailed,
        text2: error?.error?.message
      })
    } finally {
      setShareLoading(false);
    }
  }

  return {
    updateLoading,
    postContent,
    setPostContent,
    originalImageFiles,
    setOriginalImageFiles,
    privacy,
    setPrivacy,
    updatePost,
    getDetailPost,
    post,
    mediaIds,
    handleMedias,
    deletePost,
    deleteLoading,
    likePost,
    likedPost,
    setLikedPost,
    sharePost,
    shareLoading
  }
}

export default EditPostViewModel