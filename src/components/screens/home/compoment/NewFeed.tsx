import { View, Text, FlatList, TouchableOpacity } from 'react-native'
import React, { useEffect } from 'react'
import HomeViewModel from '../viewModel/HomeViewModel';
import { defaultNewFeedRepo } from '@/src/api/features/newFeed/NewFeedRepo';
import { ActivityIndicator } from '@ant-design/react-native';
import useColor from '@/src/hooks/useColor';
import { router } from 'expo-router';
import { Image } from "expo-image";
import { useAuth } from '@/src/context/auth/useAuth';
import FriendSuggestions from '@/src/components/common/Suggestions/friendSuggestions';
import Post from '@/src/components/common/Post';

const NewFeed = ({isActive}: {isActive: boolean}) => {
    const { brandPrimary, backgroundColor, lightGray } = useColor();
      const { user, localStrings } = useAuth();
    const {
        loading,
        newFeeds,
        fetchNewFeeds,
        loadMoreNewFeeds,
        refeshLoading,
        refreshNewFeeds,
        onViewableItemsChanged,
        visibleItems,
        page,
      } = HomeViewModel(defaultNewFeedRepo);

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
          if (!loading) return null;
          return (
            <View style={{ paddingVertical: 10, alignItems: "center" }}>
              <ActivityIndicator size="large" color={brandPrimary} />
            </View>
          );
        };
       useEffect(() => {
        if (isActive) {
          fetchNewFeeds(page);
        }
        }, [isActive]);
  return (
       <FlatList
            ListHeaderComponent={
              <View>
                {renderAddPost()}
                <FriendSuggestions />
              </View>
            }
            data={newFeeds}
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
                    isVisible={visibleItems.includes(
                      item?.parent_post?.id as string
                    )}
                  />
                )}
              </Post>
            )}
            keyExtractor={(item) => item?.id as string}
            ListFooterComponent={renderFooter}
            onEndReached={loadMoreNewFeeds}
            onEndReachedThreshold={0.5}
            removeClippedSubviews={true}
            showsVerticalScrollIndicator={false}
            onRefresh={refreshNewFeeds}
            refreshing={refeshLoading}
            onViewableItemsChanged={onViewableItemsChanged.current}
            viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
          />
  )
}

export default NewFeed