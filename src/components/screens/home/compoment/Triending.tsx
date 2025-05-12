import { View, Text, TouchableOpacity, FlatList } from "react-native";
import React, { useEffect } from "react";
import useColor from "@/src/hooks/useColor";
import { useAuth } from "@/src/context/auth/useAuth";
import TrendingViewModel from "../viewModel/TrendingViewModel";
import { defaultPostRepo } from "@/src/api/features/post/PostRepo";
import { Image } from "expo-image";
import { router } from "expo-router";
import { ActivityIndicator } from "@ant-design/react-native";
import Post from "@/src/components/common/Post";

const Triending = ({ isActive }: { isActive: boolean }) => {
  const { brandPrimary, backgroundColor, lightGray } = useColor();
  const { user, localStrings } = useAuth();
  const {
    loadingTrending,
    loadMoreTriendingPosts,
    fetchTrendingPosts,
    onRefresh,
    triendingPosts,
    visibleItems,
    onViewableItemsChanged,
    pageTrend,
  } = TrendingViewModel(defaultPostRepo);
  const renderAddPost = () => {
    return (
      <TouchableOpacity onPress={() => router.push({ pathname: "/add" })}>
        <View
          style={{
            padding: 10,
            flexDirection: "row",
            alignItems: "center",
            marginHorizontal: 10,
            marginTop: 10,
            backgroundColor: backgroundColor,
            borderWidth: 1,
            borderColor: lightGray,
            borderRadius: 10,
          }}
        >
          <Image
            source={{
              uri:
                user?.avatar_url ||
                "https://static2.yan.vn/YanNews/2167221/202102/facebook-cap-nhat-avatar-doi-voi-tai-khoan-khong-su-dung-anh-dai-dien-e4abd14d.jpg",
            }}
            style={{
              width: 50,
              height: 50,
              borderRadius: 25,
              backgroundColor: lightGray,
            }}
          />
          <View style={{ marginLeft: 10, flex: 1 }}>
            <Text>
              {user?.family_name + " " + user?.name ||
                localStrings.Public.Username}
            </Text>
            <Text style={{ color: "gray" }}>{localStrings.Public.Today}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  const renderFooter = () => {
    if (!loadingTrending) return null;
    return (
      <View style={{ paddingVertical: 10, alignItems: "center" }}>
        <ActivityIndicator size="large" color={brandPrimary} />
      </View>
    );
  };
  useEffect(() => {
    if (isActive) {
      fetchTrendingPosts(pageTrend);
    }
  }, [isActive]);
  return (
    <View> {triendingPosts.length === 0 && !loadingTrending ? (
      <View>
      {renderAddPost()}
      <View
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: 100,
        }}
      >
        <Text>{localStrings.Post.NoTrendingPosts}</Text>
      </View>
      </View>
    ) : (
       <FlatList
      ListHeaderComponent={<View>{renderAddPost()}</View>}
      data={triendingPosts}
      renderItem={({ item }) => (
        <Post
          key={item?.id}
          post={item}
          isVisible={visibleItems.includes(item?.id as string)}
        >
          {item?.parent_post && (
            <Post
              post={item?.parent_post}
              isParentPost
              isVisible={visibleItems.includes(item?.parent_post?.id as string)}
            />
          )}
        </Post>
      )}
      keyExtractor={(item) => item?.id as string}
      ListFooterComponent={renderFooter}
      // onEndReached={loadMoreTriendingPosts}
      onEndReachedThreshold={0.5}
      removeClippedSubviews={true}
      showsVerticalScrollIndicator={false}
      onRefresh={onRefresh}
      refreshing={loadingTrending}
      onViewableItemsChanged={onViewableItemsChanged.current}
      viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
    />
    )

    }
   
    </View>
   
  );
};

export default Triending;
