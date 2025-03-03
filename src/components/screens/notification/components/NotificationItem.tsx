import { View, Text, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import React from 'react';
import { NotificationResponseModel } from '@/src/api/features/notification/models/NotifiCationModel';
import { Ionicons } from '@expo/vector-icons';
import { getTimeDiff } from '@/src/utils/helper/DateTransfer';
import { useAuth } from '@/src/context/auth/useAuth';
import { router } from 'expo-router';

const NotificationItem = ({ notification, onUpdate  }: { notification: NotificationResponseModel, onUpdate: () => void}) => {
  const { from, from_url, content, created_at, notification_type, status, content_id } = notification;
  const { user, localStrings } = useAuth();

  const type = mapNotifiCationType(notification_type || '');

  function mapNotifiCationType(type: string) {
    switch (type) {
      case 'like_post':
        return 'like';
      case 'new_share':
        return 'share';
      case 'new_comment':
        return 'comment';
      case 'friend_request':
        return 'friend';
      case 'accept_friend_request':
        return 'friend';  
      case 'new_post':
        return 'post';
      case 'like_comment':
        return 'like_comment';
      default:
        return 'notifications';
    }
  }

  const getIcons = () => {
    switch (type) {
      case 'like':
        return 'heart-circle';
      case 'share':
        return 'arrow-redo-circle';
      case 'comment':
        return 'chatbubble-ellipses';
      case 'friend':
        return 'person-circle';
      case 'post':
        return 'notifications';
      case 'like_comment':
        return 'heart-circle';
      default:
        return 'notifications';
    }
  };

  const getColor = () => {
    switch (type) {
      case 'like':
        return '#CC0033';
      case 'share':
        return '#004073';
      case 'comment':
        return '#008800';
      case 'friend':
        return '#54473F';
      case 'post':
        return '#000';
      case 'like_comment':
        return '#CC0033';
      default:
        return '#000';
    }
  };
   
  const mapNotifiCationContent = (type: string) => {
    switch (type) {
      case 'like_post':
        return `${localStrings.Notification.Items.LikePost}`;
      case 'new_share':
        return `${localStrings.Notification.Items.SharePost}`;
      case 'new_comment':
        return `${localStrings.Notification.Items.CommentPost}`;
      case 'friend_request':
        return `${localStrings.Notification.Items.Friend}`;
      case 'accept_friend_request':
        return `${localStrings.Notification.Items.AcceptFriend}`;
      case 'new_post':
        return `${localStrings.Notification.Items.NewPost}`;
      case 'like_comment':
        return `${localStrings.Notification.Items.LikeComment}`;
      default:
        return 'notifications';
    }
  };

  return (
    <TouchableOpacity onPress={()=>{onUpdate();
      if( notification_type === "friend_request" || notification_type === "accept_friend_request"){
        router.push(`/(tabs)/user/${content_id}`);
      }
      if (notification_type === "like_post" || notification_type === "new_comment" || notification_type === "new_share" || notification_type === "new_post") {
        router.push(`/postDetails?postId=${content_id}`);
      }
    }} style={{ backgroundColor: status ? '#fff' : '#f0f0f0' }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 5 }}>
        <View style={{ position: 'relative' }}>
          {/* Avatar */}
          <Image
            source={{ uri: from_url }}
            style={{ width: 40, height: 40, borderRadius: 20, marginRight: 10, backgroundColor: '#ccc' }}
          />
          {/* Icon hiển thị cho từng hành động */}
          <Ionicons
            name={getIcons()}
            size={20}
            color={getColor()}
            style={{ position: 'absolute', top: type === 'friend' ? 22 : 25, right: 5 }}
          />
        </View>

        {/* Nội dung thông báo */}
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 14, color: '#333' }}>
            <Text style={{ fontWeight: 'bold' }}>{from}</Text> {mapNotifiCationContent(notification_type || '')}
          </Text>
          {content ? (
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{ fontSize: 14, color: '#333' }}
            >
              {content}
            </Text>
          ) : null}
          <Text style={{ fontSize: 12, color: '#888', marginTop: 4 }}>
            {getTimeDiff(created_at, localStrings)}
          </Text>
        </View>
      </View>
      <View style={{ borderBottomWidth: 1, borderColor: '#fff' }} />
    </TouchableOpacity>
  );
};

export default NotificationItem;
