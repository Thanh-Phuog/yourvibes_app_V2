import { View, Text, Platform, StatusBar, TouchableOpacity, FlatList } from 'react-native'
import React from 'react'
import { useAuth } from '@/src/context/auth/useAuth';

import { ListView } from '@ant-design/react-native';
import MessagerItem from '../component/MessagesItem';
import useColor from '@/src/hooks/useColor';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { create } from 'react-test-renderer';
import { MessagesResponse } from '@/src/api/features/messages/models/Messages';

const MessagesFeature = () => {
    const {user} = useAuth();
    const {backgroundColor, brandPrimary} = useColor();
    const {localStrings} = useAuth();
    const friends = [
        {id: '1', name: 'Nguyễn Văn A', avatar: 'https://thumbs.dreamstime.com/b/avatar-icon-avatar-flat-symbol-isolated-white-avatar-icon-avatar-flat-symbol-isolated-white-background-avatar-simple-icon-124920496.jpg', lastOnline: new Date(), },
        {id:'2', name: 'Trần Thị B', avatar: 'https://thumbs.dreamstime.com/b/avatar-icon-avatar-flat-symbol-isolated-white-avatar-icon-avatar-flat-symbol-isolated-white-background-avatar-simple-icon-124920496.jpg', lastOnline: new Date(Date.now() - 5 * 60000), } // 5 minutes ago
    ];

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