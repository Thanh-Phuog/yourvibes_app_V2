import { ApiPath } from '@/src/api/ApiPath';
import { defaultNotificationRepo } from '@/src/api/features/notification/NotifiCationRepo';
import { useAuth } from '@/src/context/auth/useAuth';
import useColor from '@/src/hooks/useColor';
import { Badge } from '@ant-design/react-native';
import { AntDesign, FontAwesome, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { Href, Tabs, useFocusEffect, usePathname } from 'expo-router';
import React, { useEffect, useState, ReactNode } from 'react';
import { Image, View, Platform, StatusBar, Alert } from 'react-native';
import Toast from 'react-native-toast-message';

const TabLayout = () => {
  const { brandPrimary, brandPrimaryTap } = useColor();
  const iconSize = 25;
  const addIconSize = 28;
  const { user, localStrings } = useAuth();
  const pathname = usePathname();
  const [statusNotifi, setStatusNotifi] = useState(false);
  const [initialized, setInitialized] = useState(false);

  const mapNotifiCationContent = (type: string) => {
    switch (type) {
      case 'like_post':
        return localStrings.Notification.Items.LikePost;
      case 'new_share':
        return localStrings.Notification.Items.SharePost;
      case 'new_comment':
        return localStrings.Notification.Items.CommentPost;
      case 'friend_request':
        return localStrings.Notification.Items.Friend;
      case 'accept_friend_request':
        return localStrings.Notification.Items.AcceptFriend;
      case 'new_post':
        return localStrings.Notification.Items.NewPost;
      case 'like_comment':
        return localStrings.Notification.Items.LikeComment;
      default:
        return 'notifications';
    }
  };

  // Hàm kiểm tra trạng thái thông báo (nếu có thông báo nào chưa đọc thì đặt `statusNotifi` thành `true`)
  const checkNotificationStatus = async () => {
    const response = await defaultNotificationRepo.getNotifications({
      sort_by: 'created_at',
      isDescending: true,
      page: 1,
      limit: 10,
    });

    if (response?.data) {
      // // Kiểm tra trạng thái thông báo
      const statusTrue = response?.data.some((item) => item.status === true);
      setStatusNotifi(statusTrue);
    }
  };

  const connectWebSocket = async () => {
    const ws = new WebSocket(`${ApiPath.GET_WS_PATH}${user?.id}`);

    ws.onopen = () => {
      console.log('Web Socket connected');

    };

    ws.onmessage = (e) => {
      const notification = JSON.parse(e.data);
      const userName = notification?.from;
      const content = notification?.content;
      const type = notification?.notification_type;
      const status = notification?.status;

      setStatusNotifi(status);

      const mapType = mapNotifiCationContent(type);
      Toast.show({
        type: 'info',
        text1: `${userName} ${mapType}`,
        text2: `${content}`,
      });
    };

    ws.onclose = (e) => {
      console.log('WebSocket disconnected:', e.reason);
    };

    ws.onerror = (error) => {
      console.log('WebSocket error:', error);
      Toast.show({
        type: 'error',
        text1: localStrings.webSocker.WebSocketError,
        text2: localStrings.webSocker.WebSocketErrorText,
      });

    };

    return () => {
      ws.close();
    };
  };

  const tabs: { name: string; icon: ReactNode; focusIcon: ReactNode; href?: Href | null }[] = [
    {
      name: "home",
      icon: <Ionicons size={iconSize} name="home-outline" />,
      focusIcon: <Ionicons size={iconSize} name="home" />,
      href: "/home",
    },
    {
      name: "search",
      icon: <AntDesign size={iconSize} name="search1" />,
      focusIcon: <FontAwesome5 size={iconSize} name="search" />,
      href: "/search",
    },
    {
      name: "add",
      icon: <AntDesign size={addIconSize} name="pluscircle" />,
      focusIcon: <AntDesign size={addIconSize} name="pluscircle" />,
      href: "/add",
    },
    {
      name: "notification",
      icon: (
        <Badge dot={statusNotifi}>
          <FontAwesome size={iconSize} name="bell-o" />
        </Badge>
      ),
      focusIcon: <FontAwesome size={iconSize} name="bell" />,
      href: "/notification",
    },
    {
      name: "profile",
      icon: <FontAwesome size={iconSize} name="user-circle-o" />,
      focusIcon: <FontAwesome size={iconSize} name="user-circle" />,
      href: "/profile",
    },
    {
      name: "user/[id]",
      icon: null,
      focusIcon: null,
      href: null,
    }
  ];

  useEffect(() => {
    if (!initialized) {
      checkNotificationStatus();
      connectWebSocket();
      setInitialized(true); // Đặt biến trạng thái thành true sau khi gọi hàm
    }
    
  }, [initialized]);

  useFocusEffect(
    React.useCallback(() => {
      // Kiểm tra nếu người dùng đang ở trang thông báo
      if (pathname === '/notification') {
        setStatusNotifi(false); // Đặt statusNotifi thành false
      }
    }, [pathname]) // Thêm pathname vào dependencies array
  );

  return (
    <>

      <Tabs
        screenOptions={{
          tabBarActiveTintColor: brandPrimary,
          headerShown: false,
          headerStyle: { height: 80 },
          headerTitle: "",
          headerLeft: () => (
            <View>
              <Image
                source={require('@/assets/images/yourvibes_black.png')}
                style={{
                  width: 120,
                  objectFit: 'contain',
                  marginLeft: 10,
                }}
              />
            </View>
          ),
        }}
      >
        {tabs.map((tab) => (
          <Tabs.Screen
            key={tab.name}
            name={tab.name}
            options={{
              tabBarIcon: ({ focused }) => (tab.href && focused ? tab.focusIcon : tab.icon),
              tabBarShowLabel: false,
              tabBarInactiveTintColor: brandPrimaryTap,
              tabBarStyle: { height: Platform.OS === 'ios' ? 60 : 40 },
              href: tab.href,
            }}
          />
        ))}
      </Tabs>
      <Toast />
    </>
  );
}

export default TabLayout;
