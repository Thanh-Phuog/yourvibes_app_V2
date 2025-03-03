import React, { useCallback, useMemo } from 'react';
import { View } from 'react-native';
import { Tabs } from '@ant-design/react-native';
import { useAuth } from '@/src/context/auth/useAuth';
import useColor from '@/src/hooks/useColor';
import AboutTab from './AboutTab';
import SettingsTab from './SettingsTab';
import PostList from './PostList';
import { PostResponseModel } from '@/src/api/features/post/models/PostResponseModel';
import { UserModel } from '@/src/api/features/authenticate/model/LoginModel';
import { FriendResponseModel } from '@/src/api/features/profile/model/FriendReponseModel';
import Toast from 'react-native-toast-message';

const ProfileTabs = ({
  tabNum,
  posts,
  loading,
  profileLoading,
  loadMorePosts,
  userInfo,
  friends,
  friendCount,
  resultCode,
  onViewableItemsChanged,
  visibleItems
}: {
  tabNum: number,
  posts: PostResponseModel[],
  loading: boolean,
  profileLoading: boolean,
  loadMorePosts: () => void,
  userInfo: UserModel,
  friends: FriendResponseModel[];
  friendCount: number;
  resultCode: number;
  onViewableItemsChanged: React.MutableRefObject<({ viewableItems }: any) => void>;
  visibleItems: string[];
}) => {
  const { brandPrimary } = useColor();
  const { localStrings, user } = useAuth();
  const [tab, setTab] = React.useState(tabNum);

  const tabs = useMemo(() => {
    if (userInfo?.id === user?.id) {
      return [
        { title: localStrings.Public.About },
        { title: localStrings.Public.Post },
        { title: localStrings.Public.SetingProfile },
      ]
    } else {
      return [
        { title: localStrings.Public.About },
        { title: localStrings.Public.Post },
      ]
    }
  }, [tabNum, localStrings, user, userInfo]);

  const renderBody = useCallback(() => {
    switch (tab) {
      case 0:
        return <AboutTab user={userInfo} loading={profileLoading} friends={friends} friendCount={friendCount} resultCode={resultCode} />;
      case 1:
        return <PostList posts={posts} loading={loading} loadMorePosts={loadMorePosts} userProfile={userInfo} onViewableItemsChanged={onViewableItemsChanged} visibleItems={visibleItems} />;
      case 2:
        return userInfo?.id === user?.id ? <SettingsTab /> : null;
      default:
        return <AboutTab user={userInfo} loading={profileLoading} friends={friends} friendCount={friendCount} resultCode={resultCode} />;
    }
  }, [tab, posts, loading, profileLoading, userInfo, user, visibleItems, friends, friendCount, resultCode]);

  return (
    <View style={{ flex: 1, marginTop: 20 }}>
      <Tabs
        tabs={tabs}
        initialPage={tab}
        tabBarPosition="top"
        tabBarActiveTextColor={brandPrimary}
        onChange={(_, index) => setTab(index)}
        animated={false}
        style={{ height: '100%' }}
      />
      {renderBody()}
      <Toast />
    </View>
  );
};

export default ProfileTabs;