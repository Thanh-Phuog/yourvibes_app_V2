import React, { useCallback, useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  View,
  Text,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import useColor from "@/src/hooks/useColor";
import ProfileHeader from "../components/ProfileHeader";
import ProfileTabs from "../components/ProfileTabs";
import { useAuth } from "@/src/context/auth/useAuth";
import { useFocusEffect, useRouter } from "expo-router";
import ProfileViewModel from "../viewModel/ProfileViewModel";
import { UserModel } from "@/src/api/features/authenticate/model/LoginModel";
import Toast from "react-native-toast-message";

const ProfileFeatures = ({ tab }: { tab: number }) => {
  const { backGround, backgroundColor, brandPrimary } = useColor();
  const { user, localStrings } = useAuth();
  const router = useRouter();
  const {
    loading,
    posts,
    fetchUserPosts,
    loadMorePosts,
    total,
    friends,
    friendCount,
    resultCode,
    fetchUserProfile,
    page,
    fetchMyFriends,
    visibleItems,
    onViewableItemsChanged
  } = ProfileViewModel();

  useFocusEffect(
    useCallback(() => {
      if (user) {
        if (tab === 0 || tab === 1) {
          fetchUserPosts();
        }
        fetchUserProfile(user?.id as string);
        fetchMyFriends(page);
      }
    }, [tab, user])
  );

  const renderTab = useCallback(() => {
    return (
      <View>
        <ProfileHeader
          total={total}
          friendCount={friendCount}
          userInfo={user as UserModel}
          loading={false}
        />
        <ProfileTabs
          tabNum={tab}
          posts={posts}
          loading={loading}
          profileLoading={false}
          loadMorePosts={loadMorePosts}
          userInfo={user as UserModel}
          friends={friends}
          friendCount={friendCount}
          resultCode={resultCode}
          onViewableItemsChanged={onViewableItemsChanged}
          visibleItems={visibleItems}
        />
      </View>
    )
  }, [tab, posts, loading, friends, resultCode, visibleItems, user, total, friendCount]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: backGround, width: "100%" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={{ flex: 1 }}>
        {/* Header Cố Định */}
        <View
          style={{
            marginTop: Platform.OS === 'ios' ? 30 : 0,
            height: 50,
            paddingHorizontal: 16,
            paddingTop: 16,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: backgroundColor,
            zIndex: 10,
            borderBottomColor: "black",
            borderBottomWidth: 1,
          }}
        >
          <TouchableOpacity onPress={() => router.push("/home")}>
            <Feather name="arrow-left" size={24} color={brandPrimary} />
          </TouchableOpacity>
          <Text
            style={{
              textAlign: "center",
              fontSize: 18,
              fontWeight: "bold",
              flex: 1,
              color: brandPrimary,
            }}
          >
            {user?.family_name} {user?.name || localStrings.Public.Username}
          </Text>
        </View>

        {/* Content */}
        <FlatList
          data={null}
          ListHeaderComponent={
            <View>
              {renderTab()}
              <Toast />
            </View>
          }
          renderItem={() => null}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
          onRefresh={() => {
            fetchUserProfile(user?.id || "");
            fetchMyFriends(page);
            (tab === 0 || tab === 1) && fetchUserPosts();
          }}
          refreshing={loading}
        />
      </View>
      <Toast />
    </KeyboardAvoidingView>
  );
};

export default ProfileFeatures;