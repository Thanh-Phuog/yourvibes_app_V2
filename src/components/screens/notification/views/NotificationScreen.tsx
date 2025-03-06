import { View, Text, StatusBar, TouchableOpacity, FlatList, Platform } from 'react-native'
import React from 'react'
import useColor from '@/src/hooks/useColor';
import { router, useFocusEffect } from 'expo-router';
import { Entypo, Ionicons } from '@expo/vector-icons';
import NotificationItem from '../components/NotificationItem';

import { ActivityIndicator } from '@ant-design/react-native';
import NotifiCationViewModel from '../viewModel/NotifiCationViewModel';
import { defaultNotificationRepo } from '@/src/api/features/notification/NotifiCationRepo';
import { useAuth } from '@/src/context/auth/useAuth';
import Toast from 'react-native-toast-message';



const NotificationScreen = () => {
  const { brandPrimary, backgroundColor } = useColor();
  const { notifications, loading, fetchNotifications, loadMoreNotifi, updateNotification, updateAllNotification } = NotifiCationViewModel(defaultNotificationRepo);
  const { localStrings } = useAuth();

  useFocusEffect(
    React.useCallback(() => {
      fetchNotifications();
    }, [])
  )

  const isToday = (create_at: string) => {
    const today = new Date();
    const date = new Date(create_at);
    return today.getDate() === date.getDate() && today.getMonth() === date.getMonth() && today.getFullYear() === date.getFullYear();
  }

  const todayNotifi = notifications.filter((item) => item.created_at && isToday(item.created_at));
  const yesterdayNotifi = notifications.filter((item) => item.created_at && !isToday(item.created_at));


  // const groupByDate = [];

  // if (todayNotifi.length > 0) {
  //   groupByDate.push({type:"header", title:"Hôm nay"});
  //   groupByDate.push(...todayNotifi);
  // }

  // if (yesterdayNotifi.length > 0) {
  //   groupByDate.push({type:"header", title:"Hôm qua"});
  //   groupByDate.push(...yesterdayNotifi);
  // }


  // Render footer (Hiển thị loading ở cuối danh sách nếu đang tải)
  const renderFooter = () => {
    if (!loading) return null;
    return (
      <View style={{ paddingVertical: 10, alignItems: 'center' }}>
        <ActivityIndicator size="large" color={brandPrimary} />
      </View>
    );
  };

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
              {localStrings.Notification.Notification}
            </Text>

          </View>
          <TouchableOpacity style={{ paddingHorizontal: 10 }} onPress={updateAllNotification}>
            <Entypo name="check" size={24} color={brandPrimary} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={{ borderBottomWidth: 1, borderColor: '#000' }} />
      {/* content */}
      {notifications.length > 0 ? (
        <FlatList
        data={[{ type: "today", data: todayNotifi }, { type: "previous", data: yesterdayNotifi }]}
        keyExtractor={(item) => item.type}
        renderItem={({ item }) => {
          if (item.data.length === 0) return null;
          return (
            <View style={{ backgroundColor: '#f0f0f0', padding: 10 }}>
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 5 }}>
                {item.type === "today" ? "Hôm nay" : "Trước đó"}
              </Text>
              <FlatList
                data={item.data}
                renderItem={({ item }) => (
                  <NotificationItem
                    notification={item}
                    onUpdate={() => updateNotification(item)}
                  />
                )}
                keyExtractor={(noti) => noti.id as string}
                ListFooterComponent={renderFooter}
              />
            </View>
          );
        }}
          ListFooterComponent={renderFooter}
          onEndReached={loadMoreNotifi}
          onEndReachedThreshold={0.5}
          removeClippedSubviews={true}
          showsVerticalScrollIndicator={false}
          onRefresh={() => fetchNotifications(1)}
          refreshing={loading}
        />
      ) : (
        loading ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color={brandPrimary} />
          </View>
        ) : (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 16, color: '#333' }}>{localStrings.Notification.NoNotification}</Text>
          </View>
        )
      )}
      <Toast />
    </View>
  )
}

export default NotificationScreen