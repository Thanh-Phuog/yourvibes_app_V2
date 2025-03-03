import React, { useCallback } from 'react';
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native'; // Thay ScrollView bằng FlatList
import { Image } from 'expo-image';
import useColor from '@/src/hooks/useColor';
import { useRouter } from 'expo-router';
import Post from '@/src/components/common/Post';
import { useAuth } from '@/src/context/auth/useAuth';
import { PostResponseModel } from '@/src/api/features/post/models/PostResponseModel';
import { UserModel } from '@/src/api/features/authenticate/model/LoginModel';

const PostList = React.memo(({
  loading,
  posts,
  loadMorePosts,
  userProfile,
  onViewableItemsChanged,
  visibleItems
}: {
  loading: boolean;
  posts: PostResponseModel[];
  loadMorePosts: () => void;
  userProfile: UserModel;
  onViewableItemsChanged: React.MutableRefObject<({ viewableItems }: any) => void>;
  visibleItems: string[];
}) => {
  const { backgroundColor, lightGray, grayBackground, brandPrimary } = useColor();
  const router = useRouter();
  const { localStrings, user } = useAuth();

  const renderFooter = useCallback(() => {
    return (
      <>
        {loading ? (
          <View style={{ paddingVertical: 20 }}>
            <ActivityIndicator size="large" color={brandPrimary} />
          </View>
        ) : (
          <></>
        )}
      </>
    );
  }, [loading]);

  const renderFlatList = useCallback(() => {
    return (
      <FlatList
        data={posts}
        renderItem={({ item }) => (
          <Post key={item?.id} post={item} isVisible={visibleItems.includes(item?.id as string)}>
            {item?.parent_post && (
              <Post post={item?.parent_post} isParentPost isVisible={visibleItems.includes(item?.parent_post?.id as string)}/>
            )}
          </Post>
        )}
        keyExtractor={(item) => item?.id as string}
        ListFooterComponent={renderFooter}
        onEndReached={loadMorePosts}
        onEndReachedThreshold={0.5}
        removeClippedSubviews={true}
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged.current}
        viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
      />
    )
  }, [posts, loading, visibleItems]);

  return (
    <View style={{ flex: 1, backgroundColor: grayBackground }}>
      {userProfile?.id === user?.id && (
        <TouchableOpacity
          onPress={() => router.push({ pathname: '/add' })}
        >
          <View
            style={{
              padding: 10,
              flexDirection: 'row',
              alignItems: 'center',
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
                uri: userProfile?.avatar_url || 'https://static2.yan.vn/YanNews/2167221/202102/facebook-cap-nhat-avatar-doi-voi-tai-khoan-khong-su-dung-anh-dai-dien-e4abd14d.jpg',
              }}
              style={{
                width: 50,
                height: 50,
                borderRadius: 25,
                backgroundColor: lightGray,
              }}
            />
            <View style={{ marginLeft: 10, flex: 1 }}>
              <Text>{userProfile?.family_name + ' ' + userProfile?.name || localStrings.Public.Username}</Text>
              <Text style={{ color: 'gray' }}>{localStrings.Public.Today}</Text>
            </View>
          </View>
        </TouchableOpacity>
      )}

      {renderFlatList()}
    </View>
  );
});

export default PostList;