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
import FriendRequestAndUser from "../compoment/FriendRequestAndUser";

const HomeScreen = () => {
  const { brandPrimary, backgroundColor, backGround, theme} = useColor();
  const { user, localStrings } = useAuth();

  const [activeTab, setActiveTab] = useState(0); // 👉 Theo dõi tab hiện tại

  const tabs = [
    { title: localStrings.Public.NewFeed },
    { title: localStrings.Public.Trending },
    { title: localStrings.People.People},
  ];

  return (
    <View style={{ flex: 1, backgroundColor: backGround }}>
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
            source={theme === "dark"
              ? require("@/assets/images/yourvibes_white.png")
              : require("@/assets/images/yourvibes_black.png")}
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

        <Tabs
          tabs={tabs}
          swipeable={false}
          tabBarBackgroundColor={backgroundColor}
          tabBarActiveTextColor={brandPrimary}
          tabBarTextStyle={{ fontWeight: "bold", fontSize: 13 }}
          tabBarInactiveTextColor="gray"
          page={activeTab}
          onChange={(tab, index) => setActiveTab(index)} // 👉 Lưu index của tab đang active
          tabBarUnderlineStyle={{
            backgroundColor: brandPrimary,
            height: 2,
            borderRadius: 2,
          }}

        >
          <View style={{ flex: 1 }}>
            <NewFeed isActive={activeTab === 0} />
          </View>

          <View style={{ flex: 1 }}>
            <Triending isActive={activeTab === 1} />
          </View>

          <View style={{ flex: 1 }}>
            <FriendRequestAndUser isActive={activeTab === 2} />
          </View>
        </Tabs>


      <Toast />
    </View>
  );
};

export default HomeScreen;
