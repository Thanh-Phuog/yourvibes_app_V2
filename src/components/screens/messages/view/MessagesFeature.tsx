import { View, Text, Platform, StatusBar, TouchableOpacity, FlatList, Image } from 'react-native'
import React, { useCallback, useEffect } from 'react'
import { useAuth } from '@/src/context/auth/useAuth';

import { ListView } from '@ant-design/react-native';
import MessagerItem from '../component/MessagesItem';
import useColor from '@/src/hooks/useColor';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import useListFriendsViewModel from '../../listFriends/viewModel/ListFriendsViewModel';
import { defaultMessagesRepo } from '@/src/api/features/messages/MessagesRepo';
import { ConversationDetailResponseModel } from '@/src/api/features/messages/models/ConversationDetail';
import useConversationDetailViewModel from '../viewModel/ConversationDetailsViewModel';

const MessagesFeature = () => {
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

    const {conversationsDetail, fetchConversationsDetail, pageDetail } = useConversationDetailViewModel(defaultMessagesRepo);

    

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
    if (user) {
      fetchFriends(page, user.id);
      fetchConversationsDetail(pageDetail, user.id, undefined);

    }
  }, [user]);

  

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
        data={conversationsDetail}
        renderItem={({ item }) => <MessagerItem conversationDetail={item} />}
        keyExtractor={(item, index) => item.conversation.id?.toString() || index.toString()} 
      />


      <Toast />
    </View>
  )
}

export default MessagesFeature