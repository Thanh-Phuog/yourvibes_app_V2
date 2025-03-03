import { AdvertisePostRequestModel, AdvertisePostResponseModel } from "@/src/api/features/post/models/AdvertisePostModel";
import { PostResponseModel } from "@/src/api/features/post/models/PostResponseModel"
import { PostRepo } from "@/src/api/features/post/PostRepo";
import { useAuth } from "@/src/context/auth/useAuth";
import { useState } from "react"
import Toast from "react-native-toast-message";
import * as WebBrowser from 'expo-web-browser';

const AdsViewModel = (repo: PostRepo) => {
  const { localStrings } = useAuth();
  const [loading, setLoading] = useState(false);
  const [adsLoading, setAdsLoading] = useState(false);
  const [post, setPost] = useState<PostResponseModel | undefined>(undefined);
  const [ads, setAdsPost] = useState<AdvertisePostResponseModel | undefined>(undefined);
  const [adsAll, setAdsAll] = useState<AdvertisePostResponseModel[] | undefined>(undefined);
  const [page, setPage] = useState<number>(1);

  const getPostDetail = async (id: string, newAds = false) => {
    try {
      setLoading(true);
      const res = await repo.getPostById(id);
      if (!res?.error) {
        setPost(res?.data);
        if (newAds && res?.data?.is_advertisement) {
          Toast.show({
            type: 'success',
            text1: localStrings.Ads.AdvertisePostSuccess,
          })
        }
      } else {
        Toast.show({
          type: 'error',
          text1: "Get Post Detail Failed",
          text2: res?.error?.message,
        })
      }
    } catch (error: any) {
      console.error(error);
      Toast.show({
        type: 'error',
        text1: "Get Post Detail Failed",
        text2: error?.error?.message,
      })
    } finally {
      setLoading(false);
    }
  }

  const advertisePost = async (params: AdvertisePostRequestModel) => {
    try {
      setAdsLoading(true);
      const res = await repo.advertisePost(params);
      if (!res?.error) {
        if (res?.data) {
          const result = await WebBrowser.openAuthSessionAsync(res.data, params?.redirect_url);
          console.log("result", result);
          getPostDetail(params?.post_id || "", true);
          getAdvertisePost(1, params?.post_id || "");
        }
      } else {
        Toast.show({
          type: 'error',
          text1: localStrings.Ads.AdvertisePostFailed,
          text2: res?.error?.message,
        })
      }
    } catch (error: any) {
      console.error(error);
      Toast.show({
        type: 'error',
        text1: localStrings.Ads.AdvertisePostFailed,
        text2: error?.error?.message,
      })
    } finally {
      setAdsLoading(false);
    }
  }

  const getAdvertisePost = async (page: number, post_id: string) => {
    try {
      setLoading(true);
      const res = await repo.getAdvertisePost(
        {
          post_id: post_id,
          page: page,
          limit: 10
        }
      );
      if (res?.data?.length > 0) {
        setAdsPost(res?.data?.[0]); // Lưu quảng cáo đang chạy.
        setAdsAll(Array.isArray(res?.data) ? res?.data : []); // Lưu toàn bộ danh sách quảng cáo.
      } else {
        setAdsPost(undefined);
        setAdsAll([]);
      }
    } catch (error: any) {
      console.error(error);
      Toast.show({
        type: 'error',
        text1: localStrings.Ads.AdvertisePostFailed,
        text2: error?.error?.message,
      })
    } finally {
      setLoading(false);
    }
  }

  return {
    loading,
    post,
    getPostDetail,
    advertisePost,
    adsLoading,
    getAdvertisePost,
    ads,
    setAdsPost,
    page,
    setPage,
    adsAll,
    setAdsAll

  }
}

export default AdsViewModel