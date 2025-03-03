import React, { useCallback, useEffect } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { Image } from "expo-image";
import { useAuth } from "@/src/context/auth/useAuth";
import useColor from "@/src/hooks/useColor";
import { UserModel } from "@/src/api/features/authenticate/model/LoginModel";
import { Button, Modal } from "@ant-design/react-native";
import UserProfileViewModel from "../viewModel/UserProfileViewModel";
import { FriendStatus } from "@/src/api/baseApiResponseModel/baseApiResponseModel";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { Entypo, FontAwesome5 } from "@expo/vector-icons";
import Toast from "react-native-toast-message";

const ProfileHeader = ({
  total,
  friendCount,
  user,
  loading,
  sendFriendRequest,
  sendRequestLoading,
  refuseFriendRequest,
  cancelFriendRequest,
  acceptFriendRequest,
  unFriend,
  newFriendStatus,
  setNewFriendStatus,
}: {
  total: number;
  friendCount: number;
  user: UserModel;
  loading?: boolean;
  sendFriendRequest?: (userId: string) => void | Promise<void>;
  sendRequestLoading?: boolean;
  refuseFriendRequest?: (userId: string) => void | Promise<void>;
  cancelFriendRequest?: (userId: string) => void | Promise<void>;
  acceptFriendRequest?: (userId: string) => void | Promise<void>;
  unFriend?: (userId: string) => void | Promise<void>;
  newFriendStatus?: FriendStatus | undefined;
  setNewFriendStatus?: React.Dispatch<React.SetStateAction<FriendStatus | undefined>>
}) => {
  const { lightGray, brandPrimary, brandPrimaryTap, backgroundColor } =
    useColor();
  const { localStrings, language, isLoginUser } = useAuth();
  const { showActionSheetWithOptions } = useActionSheet();

  const showAction = useCallback(() => {
    const options = [localStrings.Public.UnFriend, localStrings.Public.Cancel];

    showActionSheetWithOptions(
      {
        title: localStrings.Public.Action,
        options: options,
        cancelButtonIndex: options.length - 1,
        cancelButtonTintColor: "#F95454",
      },
      (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            Modal.alert(
              localStrings.Public.Confirm,
              localStrings.Profile.Friend.UnfriendConfirm,
              [
                { text: localStrings.Public.Cancel, style: "cancel" },
                {
                  text: localStrings.Public.Confirm,
                  onPress: () => unFriend && unFriend(user?.id as string),
                },
              ]
            );
            break;
          case 1:
            // TODO: report friend
            break;
          case 2:
            // TODO: block user
            break;
          default:
            break;
        }
      }
    );
  }, [user, localStrings]);

  const renderFriendButton = useCallback(() => {
    switch (newFriendStatus) {
      case FriendStatus.NotFriend:
        return (
          <Button
            type="ghost"
            onPress={() => {
              sendFriendRequest && sendFriendRequest(user?.id as string);
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <FontAwesome5 name="user-plus" size={16} color={brandPrimary} />
              <Text
                style={{
                  color: brandPrimary,
                  fontSize: 16,
                  marginHorizontal: 10,
                  fontWeight: "bold",
                }}
              >
                {localStrings.Public.AddFriend}
              </Text>
            </View>
          </Button>
        );
      case FriendStatus.IsFriend:
        return (
          <Button type="primary" onPress={showAction}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <FontAwesome5
                name="user-check"
                size={16}
                color={backgroundColor}
              />
              <Text
                style={{
                  color: backgroundColor,
                  fontSize: 16,
                  marginHorizontal: 10,
                  fontWeight: "bold",
                }}
              >
                {localStrings.Public.Friend}
              </Text>
            </View>
          </Button>
        );
      case FriendStatus.SendFriendRequest:
        return (
          <View style={{ marginTop: 10 }}>
            <Text
              style={{
                marginBottom: 10,
                fontSize: 14,
                fontWeight: "bold",
              }}
            >
              {localStrings.Profile.Friend.SendARequest}
            </Text>
            <Button
              type="ghost"
              onPress={() => {
                cancelFriendRequest && cancelFriendRequest(user?.id as string);
              }}
              loading={sendRequestLoading}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Entypo name="cross" size={24} color={brandPrimary} />
                <Text
                  style={{
                    color: brandPrimary,
                    fontSize: 16,
                    marginHorizontal: 10,
                    fontWeight: "bold",
                  }}
                >
                  {localStrings.Public.CancelFriendRequest}
                </Text>
              </View>
            </Button>
          </View>
        );
      case FriendStatus.ReceiveFriendRequest:
        return (
          <View style={{ marginTop: 10 }}>
            <Text
              style={{
                marginBottom: 10,
                fontSize: 14,
                fontWeight: "bold",
              }}
            >
              {localStrings.Profile.Friend.SendYouARequest}
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Button
                style={{ width: "48%" }}
                type="primary"
                onPress={() => {
                  acceptFriendRequest && acceptFriendRequest(user?.id as string);
                }}
                loading={sendRequestLoading}
              >
                {localStrings.Public.AcceptFriendRequest}
              </Button>
              <Button
                style={{ width: "48%" }}
                type="ghost"
                onPress={() => {
                  refuseFriendRequest && refuseFriendRequest(user?.id as string);
                }}
              >
                {localStrings.Public.RefuseFriendRequest}
              </Button>
            </View>
          </View>
        );
      default:
        return (
          <Button type="ghost" onPress={() => { }}>
            <Text style={{ color: brandPrimary, fontSize: 16 }}>
              {localStrings.Public.AddFriend}
            </Text>
          </Button>
        );
    }
  }, [newFriendStatus, localStrings, sendRequestLoading, user]);

  const renderUserInformation = useCallback(() => {
    return (
      <>
          {/* Cover Image */}
          <View
            style={{ width: "100%", height: 200, backgroundColor: lightGray }}
          >
            <Image
              source={{ uri: user?.capwall_url }}
              style={{
                width: "100%",
                height: "100%",
                backgroundColor: lightGray,
              }}
            />
          </View>

          {/* Profile Image */}
          <View style={{ alignItems: "center", marginTop: -60 }}>
            <View style={{ position: "relative" }}>
              <Image
                source={{ uri: user?.avatar_url }}
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: 60,
                  backgroundColor: lightGray,
                }}
              />
            </View>
          </View>

          {/* User Information */}
          <View style={{ alignItems: "center", marginTop: 10 }}>
            <Text style={{ fontSize: 16, fontWeight: "bold" }}>
              {" "}
              {user?.family_name} {user?.name || localStrings.Public.Username}
            </Text>
            <Text style={{ color: "gray", marginTop: 4 }}>
              {user?.biography || localStrings.Public.Biography}
            </Text>
            <View style={{ flexDirection: "row", marginTop: 10 }}>
              <Text style={{ marginHorizontal: 20, fontWeight: "bold" }}>
                {" "}
                {total || user?.post_count} {localStrings.Public.Post}
                {language === "en" &&
                  (total || user?.post_count) &&
                  ((total && total > 1) ||
                    (user?.post_count && user?.post_count > 1))
                  ? "s"
                  : ""}
              </Text>
              <Text style={{ marginHorizontal: 20, fontWeight: "bold" }}>
                {friendCount} {localStrings.Public.Friend}
              </Text>
            </View>
          </View>

          {/* Friend Button */}
          {!isLoginUser(user?.id as string) && (
            <View style={{ marginHorizontal: 10, marginTop: 10 }}>
              {renderFriendButton()}
            </View>
          )}
        </>
    )
  }, [isLoginUser, language, renderFriendButton, total, user, friendCount, localStrings]);

  useEffect(() => {
    if (user && user?.friend_status && setNewFriendStatus) setNewFriendStatus(user?.friend_status);
  }, [user]);

  return (
    <>
      {loading ? (
        <ActivityIndicator size="large" color={lightGray} />
      ) : (
        <>
          {renderUserInformation()}
        </>
      )}
      <Toast />
    </>
  );
};

export default ProfileHeader;