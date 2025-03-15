import { View, Text, Platform, StatusBar, TouchableOpacity, FlatList, Image } from 'react-native'
import React, { useCallback, useEffect } from 'react'
import { useAuth } from '@/src/context/auth/useAuth';

import { ListView } from '@ant-design/react-native';
import MessagerItem from '../component/MessagesItem';
import useColor from '@/src/hooks/useColor';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { create } from 'react-test-renderer';
import { MessagesResponse } from '@/src/api/features/messages/models/Messages';
import useListFriendsViewModel from '../../listFriends/viewModel/ListFriendsViewModel';

const MessagesFeature = ({ userId }: { userId: string }) => {
    const {user} = useAuth();
    const {backgroundColor, brandPrimary} = useColor();
    const {localStrings} = useAuth();
    const {
      loading,
      friends,
      handleEndReached,
      hasMore,
      page,
      handleMoreOptions,
      fetchFriends,
    } = useListFriendsViewModel();

    const fakeMessages: MessagesResponse[] = [
      {
        id: '1',
        sender: 'Nguyễn Văn A',
        contextChat: 'Hello!',
        lastOnline: new Date().toISOString(),
        avatar_url: 'https://thumbs.dreamstime.com/b/avatar-icon-avatar-flat-symbol-isolated-white-avatar-icon-avatar-flat-symbol-isolated-white-background-avatar-simple-icon-124920496.jpg',
        timestamp: new Date().toISOString(),
      },
      {
        id: '2',
      sender: 'Trần Thị B',
        contextChat: 'Hello!',
        lastOnline: new Date(Date.now() - 5 * 60000).toISOString(), // 5 phút trước
        avatar_url: 'https://thumbs.dreamstime.com/b/avatar-icon-avatar-flat-symbol-isolated-white-avatar-icon-avatar-flat-symbol-isolated-white-background-avatar-simple-icon-124920496.jpg',
        timestamp: new Date().toISOString(),
      }
    ];
    const renderFriend = useCallback(() => {
      return (
        <View style={{ paddingVertical: 20, overscrollBehavior: 'auto' }}>
          <View
            style={{
              flexDirection: "row",
              // flexWrap: "wrap",
              // justifyContent: "space-between",
            }}
          >
            {friends?.map((friend, index) => (
              <TouchableOpacity
                key={index}
                style={{
                  width: "23%",
                  alignItems: "center",
                  marginBottom: 10,
                  marginRight: 4,
                  marginLeft: 4,
                }}
                onPress={() => {
                  router.push(`/(tabs)/user/${friend.id}`);
                }}
              >
                <Image
                  source={{
                    uri: friend.avatar_url,
                  }}
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 25,
                    backgroundColor: "#e0e0e0",
                    marginRight: 10,
                  }}
                />
                <Text style={{ marginTop: 5 }}>
                  {friend.name}
                </Text>
              </TouchableOpacity>))}
          </View>
          
        </View>
      )
    }, [friends, user]);
    

useEffect(() => {
    if (userId) {
      fetchFriends(page, userId);
    }
  }, [userId]);

  

  return (
    <View style={{ flex: 1 }}>
      {/* Header */}

      <View style={{ backgroundColor: backgroundColor, paddingTop: Platform.OS === 'ios' ? 30 : 0 }}>
        <StatusBar barStyle="dark-content" />
        <View style={{ flexDirection: 'row', alignItems: 'flex-end', height: 60, paddingBottom: 10 }}>
          <View style={{ flexDirection: 'row', paddingHorizontal: 10, alignItems: 'center', flex: 1 }}>
            <TouchableOpacity onPress={() => { router.back(); }}>
              <Ionicons name="arrow-back-outline" size={24} color={brandPrimary} />
            </TouchableOpacity>

            <Text style={{ fontWeight: 'bold', fontSize: 20, marginLeft: 10 }}>
              {localStrings.Messages.Messages}
            </Text>

          </View>
        </View>
      </View>
      <View style={{ borderBottomWidth: 1, borderColor: '#000' }} />

      {renderFriend()}
      {/* <MessagerItem messages={fakeMessages} /> */}
      <FlatList 
        data={fakeMessages}
        renderItem={({item}) => <MessagerItem messages={item} />}
        // keyExtractor={item => item.id} 
      />

      <Toast />
    </View>
  )
}

export default MessagesFeature