import React, { useCallback, useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, View, Text, TouchableOpacity, FlatList } from 'react-native';
import { Entypo, Feather } from '@expo/vector-icons';
import useColor from '@/src/hooks/useColor';
import ProfileHeader from '../components/ProfileHeader';
import ProfileTabs from '../components/ProfileTabs';
import { useAuth } from '@/src/context/auth/useAuth';
import { useRouter } from 'expo-router';
import UserProfileViewModel from '../viewModel/UserProfileViewModel';
import { UserModel } from '@/src/api/features/authenticate/model/LoginModel';
import { useActionSheet } from '@expo/react-native-action-sheet';
import Toast from 'react-native-toast-message';

const UserProfileScreen = ({ id }: { id: string }) => {
  const { backgroundColor } = useColor();
  const { localStrings } = useAuth();
  const [tab, setTab] = useState(0);
  const { showActionSheetWithOptions } = useActionSheet();
  const router = useRouter();
  const {
    loading,
    posts,
    loadMorePosts,
    total,
    fetchUserProfile,
    profileLoading,
    userInfo,
    friends,
    friendCount,
    resultCode,
    visibleItems,
    onViewableItemsChanged,
    fetchFriends,
    fetchUserPosts,
    //profile
    sendFriendRequest,
    sendRequestLoading,
    refuseFriendRequest,
    cancelFriendRequest,
    acceptFriendRequest,
    unFriend,
    newFriendStatus,
    setNewFriendStatus,
  } = UserProfileViewModel();

  const showFriendAction = useCallback(() => {
    const options = [
      localStrings.Public.ReportFriend,
      localStrings.Public.Block,
      localStrings.Public.Cancel,
    ];

    showActionSheetWithOptions(
      {
        title: localStrings.Public.Action,
        options: options,
        cancelButtonIndex: options.length - 1,
        cancelButtonTintColor: "#F95454"
      },
      (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            router.push(`/report?userId=${id}`);
            break;
          case 1:
            // TODO: block user
            break;
          default:
            break;
        }
      }
    );
  }, [localStrings, id]);

  useEffect(() => {
    if (!id) return;
    fetchUserProfile(id);
    setTab(0);
  }, [id])

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: backgroundColor, width: '100%' }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={{ flex: 1 }}>
        {/* Header Cố Định */}
        <View
          style={{
            marginTop: Platform.OS === 'ios' ? 30 : 0,
            height: 50,
            paddingHorizontal: 16,
            paddingTop: 16,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#fff',
            zIndex: 10,
            borderBottomColor: 'black',
            borderBottomWidth: 1,
          }}
        >
          <TouchableOpacity onPress={() => router.back()}>
            <Feather name="arrow-left" size={24} color="black" />
          </TouchableOpacity>
          <Text style={{ textAlign: 'center', fontSize: 18, fontWeight: 'bold', flex: 1 }}>
            {userInfo?.family_name} {userInfo?.name || localStrings.Public.Username}
          </Text>
          <TouchableOpacity
            style={{ width: '8%', display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}
            onPress={showFriendAction}
          >
            <Entypo name="dots-three-vertical" size={16} />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <FlatList
          data={null}
          ListHeaderComponent={
            <>
              <ProfileHeader
                total={total}
                friendCount={friendCount}
                user={userInfo as UserModel}
                loading={profileLoading}
                sendFriendRequest={sendFriendRequest}
                sendRequestLoading={sendRequestLoading}
                refuseFriendRequest={refuseFriendRequest}
                cancelFriendRequest={cancelFriendRequest}
                acceptFriendRequest={acceptFriendRequest}
                unFriend={unFriend}
                newFriendStatus={newFriendStatus}
                setNewFriendStatus={setNewFriendStatus}
              />
              <ProfileTabs
                onViewableItemsChanged={onViewableItemsChanged}
                friendCount={friendCount}
                visibleItems={visibleItems}
                tabNum={tab} posts={posts}
                loading={loading}
                profileLoading={profileLoading}
                loadMorePosts={loadMorePosts}
                userInfo={userInfo as UserModel}
                friends={friends}
                resultCode={resultCode}
              />
              <Toast />
            </>
          }
          renderItem={() => null}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
          onRefresh={() => {
            if (tab === 0 || tab === 1) {
              fetchUserProfile(id)
            }
          }}
          refreshing={loading}
        />
      </View>
      <Toast />
    </KeyboardAvoidingView>
  );
};

export default UserProfileScreen;