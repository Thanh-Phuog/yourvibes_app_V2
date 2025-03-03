import { NewFeedResponseModel } from "@/src/api/features/newFeed/Model/NewFeedModel";
import { NewFeedRepo } from "@/src/api/features/newFeed/NewFeedRepo"
import { useAuth } from "@/src/context/auth/useAuth";
import { useRef, useState } from "react";
import Toast from "react-native-toast-message";

const HomeViewModel = (repo: NewFeedRepo) => {
  const [newFeeds, setNewFeeds] = useState<NewFeedResponseModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const { localStrings } = useAuth();
  const limit = 20;
  const [refeshLoading, setRefeshLoading] = useState(false);
  const [visibleItems, setVisibleItems] = useState<string[]>([]);

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {    
    const visibleIds = viewableItems.map((item: any) => item.item.id);
    setVisibleItems(visibleIds);
  });

  const fetchNewFeeds = async (newPage: number = 1) => {
    try {
      setLoading(true);
      const response = await repo.getNewFeed({
        page: newPage,
        limit: limit,
      });

      if (!response?.error) {
        if (newPage === 1) {
          setNewFeeds(response?.data || []);
        } else {
          setNewFeeds((prevNewFeeds) => [...prevNewFeeds, ...response?.data || []]);
        }
        const { page: currentPage, limit: currentLimit, total: totalRecords } = response?.paging;

        setTotal(totalRecords);
        setPage(currentPage);
        setHasMore(currentPage * currentLimit < totalRecords);
      } else {
        Toast.show({
          type: 'error',
          text1: "Get NewFeeds Failed",
          text2: response?.error?.message,
        });
      }
    } catch (error: any) {
      console.error(error);
      Toast.show({
        type: 'error',
        text1: "Get NewFeeds Failed catch",
        text2: error?.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteNewFeed = async (id: string) => {
    try {
      setLoading(true);
      const res = await repo.deleteNewFeed(id);
       // Cập nhậtlại danh sách
      setNewFeeds(newFeeds => newFeeds.filter(post => post.id !== id));
      if (!res?.error) {
        Toast.show({
          type: "success",
          text1: localStrings.DeletePost.DeleteSuccess
        })
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
      setLoading(false);
    }
  }

  const refreshNewFeeds = async (newPage: number = 1) => {
    try {
      setRefeshLoading(true);
      const response = await repo.getNewFeed({
        page: newPage,
        limit: limit,
      });

      if (!response?.error) {
        if (newPage === 1) {
          setNewFeeds(response?.data || []);
        } else {
          setNewFeeds((prevNewFeeds) => [...prevNewFeeds, ...response?.data || []]);
        }
        const { page: currentPage, limit: currentLimit, total: totalRecords } = response?.paging;

        setTotal(totalRecords);
        setPage(currentPage);
        setHasMore(currentPage * currentLimit < totalRecords);
      } else {
        Toast.show({
          type: 'error',
          text1: "Get NewFeeds Failed",
          text2: response?.error?.message,
        });
      }
    } catch (error: any) {
      console.error(error);
      Toast.show({
        type: 'error',
        text1: "Get NewFeeds Failed catch",
        text2: error?.message,
      });
    } finally {
      setRefeshLoading(false);
    }
  };

  const loadMoreNewFeeds = () => {
    if (!loading && hasMore) {
      setPage((prevPage) => prevPage + 1);
      fetchNewFeeds(page + 1);
    }
  };

  return {
    newFeeds,
    loading,
    fetchNewFeeds,
    loadMoreNewFeeds,
    deleteNewFeed,
    refreshNewFeeds,
    refeshLoading,
    onViewableItemsChanged,
    visibleItems,
  }
}

export default HomeViewModel