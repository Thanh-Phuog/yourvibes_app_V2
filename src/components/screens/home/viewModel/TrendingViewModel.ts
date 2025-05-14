import { View, Text } from "react-native";
import React, { useRef, useState } from "react";
import { PostRepo } from "@/src/api/features/post/PostRepo";
import { PostResponseModel } from "@/src/api/features/post/models/PostResponseModel";
import Toast from "react-native-toast-message";

const TrendingViewModel = (repo: PostRepo) => {
  const [triendingPosts, setTrendingPosts] = useState<PostResponseModel[]>([]);
  const [loadingTrending, setLoadingTrending] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const [pageTrend, setPageTrend] = useState(1);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [visibleItems, setVisibleItems] = useState<string[]>([]);
  const limit = 20;

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    const visibleIds = viewableItems.map((item: any) => item.item.id);
    setVisibleItems(visibleIds);
  });
  const fetchTrendingPosts = async (newPageTrend: number = 1) => {
    try {
      setLoadingTrending(true);
      setIsLoadingMore(true);
      const response = await repo.getPostsTrending({
        page: newPageTrend,
        limit: limit,
      });
      if (!response?.error) {
        if (newPageTrend === 1) {
          setTrendingPosts(response?.data || []);
        } else {
          setTrendingPosts((prevPosts) => [
            ...prevPosts,
            ...(response?.data || []),
          ]);
        }
        const {
          page: currentPage,
          limit: currentLimit,
          total: totalRecords,
        } = response?.paging;
        setTotal(totalRecords);
        setPageTrend(currentPage);
        setHasMore(currentPage * currentLimit < totalRecords);
      } else {
        Toast.show({
          type: "error",
          text1: "Get Trending Posts Failed",
          text2: response?.error?.message,
        });
      }
    } catch (error: any) {
      console.error(error);
      Toast.show({
        type: "error",
        text1: "Get Trending Posts Failed catch",
        text2: error?.message,
      });
    } finally {
      setLoadingTrending(false);
      setIsLoadingMore(false);
    }
  };

  const onRefresh = () => {
    // setLoadingTrending(true)
    setIsLoadingMore(true);
    fetchTrendingPosts(1);
  };``

const loadMoreTriendingPosts = () => {
  if (hasMore && !loadingTrending && !isLoadingMore) {
    const nextPage = pageTrend + 1;
    console.log("Calling trending API page:", nextPage);
    fetchTrendingPosts(nextPage); // 👈 gọi fetch đúng page
  }
};

  return {
    triendingPosts,
    loadingTrending,
    pageTrend,
    total,
    hasMore,
    fetchTrendingPosts,
    onRefresh,
    loadMoreTriendingPosts,
    onViewableItemsChanged,
    visibleItems,
    isLoadingMore,
  };
};

export default TrendingViewModel;
