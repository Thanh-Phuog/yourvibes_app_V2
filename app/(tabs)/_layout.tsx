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
  const { brandPrimary, brandPrimaryTap, backgroundColor, borderBirth } = useColor();
  const iconSize = 25;
  const addIconSize = 28;
  const {theme } = useAuth();
  const pathname = usePathname();
  const [statusNotifi, setStatusNotifi] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // Hàm kiểm tra trạng thái thông báo (nếu có thông báo nào chưa đọc thì đặt statusNotifi thành true)
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

  const tabs: { name: string; icon: ReactNode; focusIcon: ReactNode; href?: Href | null }[] = [
    {
      name: "home",
      icon: <Ionicons size={iconSize} name="home-outline" color={brandPrimary} />,
      focusIcon: <Ionicons size={iconSize} name="home" color={brandPrimary} />,
      href: "/home",
    },
    {
      name: "search",
      icon: <AntDesign size={iconSize} name="search1" color={brandPrimary} />,
      focusIcon: <FontAwesome5 size={iconSize} name="search" color={brandPrimary} />,
      href: "/search",
    },
    {
      name: "add",
      icon: <AntDesign size={addIconSize} name="pluscircle" color={brandPrimary} />,
      focusIcon: <AntDesign size={addIconSize} name="pluscircle" color={brandPrimary} />,
      href: "/add",
    },
    {
      name: "notification",
      icon: (
        <Badge dot={statusNotifi}>
          <FontAwesome size={iconSize} name="bell-o" color={brandPrimary} />
        </Badge>
      ),
      focusIcon: <FontAwesome size={iconSize} name="bell" color={brandPrimary} />,
      href: "/notification",
    },
    {
      name: "profile",
      icon: <FontAwesome size={iconSize} name="user-circle-o" color={brandPrimary} />,
      focusIcon: <FontAwesome size={iconSize} name="user-circle" color={brandPrimary} />,
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
      // connectWebSocket();
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
          tabBarItemStyle: {
            backgroundColor: brandPrimaryTap,
          },
          headerShown: false,
          headerStyle: { height: 80 },
          headerTitle: "",
          tabBarShowLabel: false,
          tabBarStyle: {
            height: Platform.OS === 'ios' ? 60 : 40,
            backgroundColor: backgroundColor, 
          },
          headerLeft: () => (
            <View>
              <Image
                source={
                  theme === "dark"
                    ? require("@/assets/images/yourvibes_white.png")
                    : require("@/assets/images/yourvibes_black.png")
                }
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