import { View, Text, ScrollView, TouchableOpacity, Platform, Modal } from 'react-native'
import React from 'react'
import { Image } from "expo-image";
import { AntDesign } from "@expo/vector-icons";
import { router } from 'expo-router';
import { useAuth } from '@/src/context/auth/useAuth';
import { LikeUsersModel } from '@/src/api/features/post/models/LikeUsersModel';
import useColor from '@/src/hooks/useColor';

const UserLikePostModal = ({ isVisible, setIsVisible, userLikePost }: {
  isVisible: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  userLikePost: LikeUsersModel[];
}) => {
  const { localStrings } = useAuth();
  const { brandPrimary, backGround, backgroundColor, borderColor, brandPrimaryTap } = useColor();
  return (
    <Modal
      visible={isVisible}
      transparent
      onRequestClose={() => setIsVisible(false)}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
      >
        <View
          style={{
            backgroundColor: backgroundColor,
            width: "100%",
            height: "100%",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              padding: 16,
              marginTop: Platform.OS === "ios" ? 30 : 0,

              borderBottomWidth: 1,
              borderBottomColor: borderColor,
              marginBottom: 10,
            }}
          >
            <TouchableOpacity onPress={() => setIsVisible(false)}>
              <AntDesign name="arrowleft" size={24} color={brandPrimary} />
            </TouchableOpacity>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                marginLeft: 10,
                color: brandPrimary,
              }}
            >
              {localStrings.Public.ListUserLikePost}
            </Text>
          </View>
          <ScrollView
            style={{
              backgroundColor: backGround,
            }}
          >
            <View
              style={{ flexDirection: "column", alignItems: "center", }}
            >
              {userLikePost?.map((like, index) => (
                <View
                  key={like.id}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingVertical: 10,
                    borderBottomWidth: 1,
                    borderColor: borderColor,
                  }}
                >
                  <TouchableOpacity
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      flex: 1,
                    }}
                    onPress={() => {
                      router.push(`/(tabs)/user/${like.id}`);
                    }}
                  >
                    <Image
                      source={{ uri: like.avatar_url }}
                      style={{
                        marginLeft: 10,
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        backgroundColor: "#e0e0e0",
                        marginRight: 10,
                      }}
                    />
                    <Text style={{ fontSize: 16, color: brandPrimaryTap }}>
                      {like.family_name} {like.name}
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  )
}

export default UserLikePostModal