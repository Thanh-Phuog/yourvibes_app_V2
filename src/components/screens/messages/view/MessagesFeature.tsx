import { View, Text, Platform, StatusBar, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import React, { useEffect } from 'react';
import { useAuth } from '@/src/context/auth/useAuth';
import MessagerItem from '../component/MessagesItem';
import useColor from '@/src/hooks/useColor';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import useMessagesViewModel from '../viewModel/MessagesViewModel';
import { Image } from 'expo-image';
import { MessagesResponse } from '@/src/api/features/messages/models/Messages';

const MessagesFeature = ({ userId }: { userId: string }) => {
  const { user, localStrings } = useAuth();
  const { backgroundColor, brandPrimary } = useColor();
  
  const { 
    messages, 
    friends, 
    loadingFriends, 
    fetchFriends 
  } = useMessagesViewModel({
    getMessages: () => user?.id || ""
  });

  const friendMessages: MessagesResponse[] = friends.map(friend => ({
    id: friend.id,
    sender: `${friend.family_name || ''} ${friend.name || ''}`.trim(),
    contextChat: 'Bắt đầu cuộc trò chuyện...',
    lastOnline: new Date().toISOString(),
    avatar_url: friend.avatar_url || 'https://thumbs.dreamstime.com/b/avatar-icon-avatar-flat-symbol-isolated-white-avatar-icon-avatar-flat-symbol-isolated-white-background-avatar-simple-icon-124920496.jpg',
  }));

  useEffect(() => {
    if (userId) {
      // Giả sử trang đầu tiên là 1
      fetchFriends(1, userId);
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
      
      {/* Hiển thị loading khi đang tải danh sách bạn bè */}
      {loadingFriends ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={brandPrimary} />
          <Text style={{ marginTop: 10 }}>Đang tải danh sách bạn bè...</Text>
        </View>
      ) : friendMessages.length > 0 ? (
        <FlatList 
          data={friendMessages}
          renderItem={({item}) => <MessagerItem messages={item} />}
          keyExtractor={item => item.id || ''}
          ListEmptyComponent={
            <View style={{ padding: 20, alignItems: 'center' }}>
              <Text>Không có bạn bè nào.</Text>
            </View>
          }
        />
      ) : (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Bạn chưa có bạn bè nào.</Text>
          <TouchableOpacity 
            style={{ 
              marginTop: 10, 
              backgroundColor: brandPrimary, 
              padding: 10, 
              borderRadius: 5 
            }}
            // onPress={() => router.push('/(tabs)/friends')}
          >
            <Text style={{ color: 'white' }}>Tìm bạn bè</Text>
          </TouchableOpacity>
        </View>
      )}

      <Toast />
    </View>
  );
};

export default MessagesFeature;