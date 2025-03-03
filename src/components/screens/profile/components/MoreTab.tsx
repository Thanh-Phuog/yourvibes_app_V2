import { View, Text, ScrollView } from 'react-native'
import React, { useCallback, useEffect } from 'react'
import { ActivityIndicator, Button, Modal } from '@ant-design/react-native';
import { router } from 'expo-router';
import useColor from '@/src/hooks/useColor';
import { useAuth } from '@/src/context/auth/useAuth';
import { UserModel } from '@/src/api/features/authenticate/model/LoginModel';
import { FriendStatus } from '@/src/api/baseApiResponseModel/baseApiResponseModel';
import UserProfileViewModel from '../viewModel/UserProfileViewModel';

const MoreTab = ({ userInfoProps }: { userInfoProps: UserModel }) => {
  const { brandPrimary, backgroundColor } = useColor();
  const { localStrings } = useAuth();
  const {
    sendFriendRequest,
    sendRequestLoading,
    refuseFriendRequest,
    cancelFriendRequest,
    newFriendStatus,
    setNewFriendStatus,
    acceptFriendRequest,
    unFriend
  } = UserProfileViewModel();

  useEffect(() => {
    console.log("newFriendStatus: ", newFriendStatus);

    if (!newFriendStatus && userInfoProps) {
      setNewFriendStatus(userInfoProps?.friend_status);
    }
  }, [newFriendStatus]);

  const renderFriendButton = useCallback(() => {
    switch (newFriendStatus) {
      case FriendStatus.NotFriend:
        return (
          <Button
            type="ghost"
            onPress={() => {
              sendFriendRequest(userInfoProps?.id as string);
            }}
          >
            <Text style={{ color: brandPrimary, fontSize: 16 }}>
              {localStrings.Public.AddFriend}
            </Text>
          </Button>
        )
      case FriendStatus.IsFriend:
        return (
          <Button
            type="ghost"
            onPress={() => {
              Modal.alert(
                localStrings.Public.Confirm,
                localStrings.Profile.Friend.UnfriendConfirm,
                [
                  { text: localStrings.Public.Cancel, style: 'cancel' },
                  { text: localStrings.Public.Confirm, onPress: () => unFriend(userInfoProps?.id as string) },
                ]
              );
            }}
          >
            <Text style={{ color: brandPrimary, fontSize: 16 }}>
              {localStrings.Public.UnFriend}
            </Text>
          </Button>
        )
      case FriendStatus.SendFriendRequest:
        return (
          <Button
            type="ghost"
            onPress={() => {
              cancelFriendRequest(userInfoProps?.id as string);
            }}
          >
            <Text style={{ color: brandPrimary, fontSize: 16 }}>
              {localStrings.Public.CancelFriendRequest}
            </Text>
          </Button>
        )
      case FriendStatus.ReceiveFriendRequest:
        return (
          <View style={{ flexDirection: 'row', alignItems: 'center', display: 'flex', justifyContent: 'space-between' }}>
            <Button
              style={{ width: '48%' }}
              type="primary"
              onPress={() => {
                acceptFriendRequest(userInfoProps?.id as string);
              }}
            >
              {localStrings.Public.AcceptFriendRequest}
            </Button>
            <Button
              style={{ width: '48%' }}
              type="ghost"
              onPress={() => {
                refuseFriendRequest(userInfoProps?.id as string);
              }}
            >
              {localStrings.Public.RefuseFriendRequest}
            </Button>
          </View>
        )
      default:
        return (
          <Button
            type="ghost"
            onPress={() => {

            }}
          >
            <Text style={{ color: brandPrimary, fontSize: 16 }}>
              {localStrings.Public.AddFriend}
            </Text>
          </Button>
        )
    }
  }, [userInfoProps, newFriendStatus])

  return (
    <View style={{ padding: 20, flex: 1 }}>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {renderFriendButton()}
        <Button
          type="ghost"
          onPress={() => {

          }}
          style={{ marginTop: 10 }}
        >
          <Text style={{ color: brandPrimary, fontSize: 16 }}>
            {localStrings.Public.ReportFriend}
          </Text>
        </Button>
        <Button
          type="ghost"
          style={{ marginTop: 10 }}
          onPress={() => {

          }}
        >
          <Text style={{ color: brandPrimary, fontSize: 16 }}>
            {localStrings.Public.Block}
          </Text>
        </Button>
      </ScrollView>
      <ActivityIndicator
        toast
        animating={sendRequestLoading}
        size="large"
        color={backgroundColor}
      />
    </View>
  )
}

export default MoreTab