import React, { useState } from "react";
import { View, Platform } from "react-native";
import { Tabs } from "@ant-design/react-native";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import Toast from "react-native-toast-message";
import useColor from "@/src/hooks/useColor";
import { useAuth } from "@/src/context/auth/useAuth";
import { router } from "expo-router";
import NewFeed from "../compoment/NewFeed";
import Triending from "../compoment/Triending";
import FriendRequestAndBirth from "../compoment/FriendRequestAndBirth";

const HomeScreen = () => {
  const { brandPrimary, backgroundColor, backGround } = useColor();
  const { user, localStrings, theme } = useAuth();

  const tabs = [
    { title: localStrings.Public.NewFeed },
    { title: localStrings.Public.Trending },
    { title: localStrings.Public.BirthdayFriend },
  ];

  const [activeTab, setActiveTab] = useState(0);
  const [loadedTabs, setLoadedTabs] = useState([true, false, false]);

  const handleTabChange = (tab: { title: React.ReactNode }, index: number) => {
    setActiveTab(index);
    if (!loadedTabs[index]) {
      const updated = [...loadedTabs];
      updated[index] = true;
      setLoadedTabs(updated);
    }
  };


  return (
    <View style={{ flex: 1, backgroundColor:backGround }}>
      {/* Header */}
      <View style={{ backgroundColor: backgroundColor, paddingTop: Platform.OS === "ios" ? 40 : 0 }}>
        <View
          style={{
            height: 70,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Image
            source={theme === "dark" ? require("@/assets/images/yourvibes_white.png") : require("@/assets/images/yourvibes_black.png")}
            style={{
              width: 140,
              height: "65%",
              objectFit: "contain",
              marginLeft: 10,
            }}
          />
          <Ionicons
            size={25}
            name="chatbubble-ellipses"
            style={{ marginRight: 15, color: brandPrimary }}
            onPress={() => user && router.push(`/messages?userId=${user.id}`)}
          />
        </View>
      </View>

      {/* Tabs */}
      <View style={{ flex: 1 }}>
        <Tabs
          tabs={tabs}
          onChange={handleTabChange}
          swipeable={false}
          tabBarBackgroundColor={backgroundColor}
          tabBarActiveTextColor={brandPrimary}
          tabBarTextStyle={{ fontWeight: "bold", fontSize: 13 }}
          tabBarInactiveTextColor="gray"
          tabBarUnderlineStyle={{
            backgroundColor: brandPrimary,
            height: 2,
            borderRadius: 2,
          }}
          renderTabBar={(props) => (
            <Tabs.DefaultTabBar
              {...props}
              styles={{
                container: {
                  backgroundColor: backgroundColor,
                  borderTopLeftRadius: 16,
                  borderTopRightRadius: 16,
                  overflow: "hidden",
                },
              }}
            />
          )}
        
          style={{
            marginTop: 10,
            // marginHorizontal: 10,
            borderRadius: 16, // 👈 Bo góc ở đây
            overflow: "hidden", // 👈 Quan trọng để bo góc có hiệu lực
          }}
        
        >
          <View style={{ flex: 1 }}>
          {loadedTabs[0] && <NewFeed isActive={activeTab === 0} />}
          </View>

          <View style={{ flex: 1 }}>
          {loadedTabs[1] && <Triending isActive={activeTab === 1} />}
          </View>

          <View style={{ flex: 1 }}>
          {loadedTabs[2] && <FriendRequestAndBirth isActive={activeTab === 2} />}
          </View>
        </Tabs>
      </View>

      <Toast />
    </View>
  );
};

export default HomeScreen;
