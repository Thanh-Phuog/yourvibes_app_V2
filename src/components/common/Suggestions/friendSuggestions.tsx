import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import friendSuggestionsViewModel, {
  FriendSuggestionWithStatus,
} from "./friendSuggestionsViewModel";
import { defaultNewFeedRepo } from "@/src/api/features/newFeed/NewFeedRepo";
import { useAuth } from "@/src/context/auth/useAuth";
import { useRouter } from "expo-router";
import { FriendStatus } from "@/src/api/baseApiResponseModel/baseApiResponseModel";
import useColor from "@/src/hooks/useColor";
import { Entypo, FontAwesome5 } from "@expo/vector-icons";
import { useActionSheet } from "@expo/react-native-action-sheet";
import {
  ActivityIndicator,
  Card,
  Modal,
  Button,
} from "@ant-design/react-native";
import { Image } from "expo-image";
import { use } from "i18next";

const FriendSuggestions = () => {
  const router = useRouter();
  const { localStrings } = useAuth();
  const { brandPrimary, backgroundColor } = useColor();
  const [isWhyModalVisible, setIsWhyModalVisible] = useState(false);
  const { showActionSheetWithOptions } = useActionSheet();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const {
    friendSuggestions,
    fetchSuggestions,
    handleFriendRequest,
    friendRequestLoading,
    setFriendSuggestions,
    handleRemoveSuggestion,
    loading,
  } = friendSuggestionsViewModel(defaultNewFeedRepo);

  const renderFriendButton = useCallback(
    (suggestion: FriendSuggestionWithStatus) => {
      const userId = suggestion.id!;
      const isLoading = friendRequestLoading[userId];
      // const buttonStyles = {
      //   flexDirection: "row",
      //   alignItems: "center" as const,
      //   justifyContent: "center",
      //   width: "100%",
      //   paddingHorizontal: 10,
      // };

      switch (suggestion.friendStatus) {
        case FriendStatus.NotFriend:
          return (
            <Button
              type="primary"
              onPress={() => handleFriendRequest(userId, "send")}
              loading={isLoading}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <FontAwesome5
                  name="user-plus"
                  size={16}
                  color={backgroundColor}
                />
                <Text
                  style={{
                    color: backgroundColor,
                    fontSize: 14,
                  }}
                >
                  {localStrings.Public.AddFriend}
                </Text>
              </View>
            </Button>
          );
        // case FriendStatus.IsFriend:
        //   return (
        //     <TouchableOpacity
        //       style={{
        //         height: 36,
        //         flexDirection: "row",
        //         alignItems: "center",
        //         justifyContent: "center",
        //       }}
        //       onPress={() => handleFriendRequest(userId, "send")}
        //     >
        //       <FontAwesome5 name="user-check" size={16} color={brandPrimary} />
        //       <Text
        //         style={{
        //           color: brandPrimary,
        //           fontSize: 16,
        //           marginHorizontal: 10,
        //           fontWeight: "bold",
        //         }}
        //       >
        //         {localStrings.Public.Friend}
        //       </Text>
        //     </TouchableOpacity>
        //   );
        case FriendStatus.SendFriendRequest:
          return (
            <Button
              type="ghost"
              onPress={() => handleFriendRequest(userId, "cancel")}
              loading={isLoading}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Entypo name="cross" size={24} color={brandPrimary} />
                <Text
                  style={{
                    color: brandPrimary,
                    fontSize: 14,
                    marginHorizontal: 10,
                  }}
                >
                  {localStrings.Public.CancelFriendRequest}
                </Text>
              </View>
            </Button>
          );

        default:
          return (
            <TouchableOpacity
              style={{
                height: 36,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
              onPress={() => {}}
            >
              <Text style={{ color: brandPrimary, fontSize: 16 }}>
                {localStrings.Public.AddFriend}
              </Text>
            </TouchableOpacity>
          );
      }
    },
    [friendRequestLoading, localStrings, handleFriendRequest]
  );

  const showAction = useCallback(() => {
    const options = [
      localStrings.Suggested.Why,
      localStrings.Suggested.Dont,
      localStrings.Public.Cancel,
    ];

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
            setIsWhyModalVisible(true);

            break;
          case 1:
            setFriendSuggestions((prev) =>
              prev.map((s) => ({ ...s, hidden: true }))
            );

            fetchSuggestions();
            break;
          case 2:
            // Cancel action
            break;
          default:
            break;
        }
      }
    );
  }, [localStrings]);

  useEffect(() => {
    fetchSuggestions();
  }, []);

  return (
    <View
      className="friend-suggestions"
      style={{
        // padding: 10,
        // backgroundColor: "#fff",
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        marginTop: 10,
        marginHorizontal: 10,
      }}
    >
      <View
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 10,
          flexDirection: "row",
        }}
      >
        <View
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            flexDirection: "row",
          }}
        >
          {/* <UsergroupAddOutlined style={{ fontSize: "18px" }} /> */}
          <FontAwesome5 name="user-friends" size={24} color={brandPrimary} />
          <Text style={{ fontWeight: "bold", fontSize: 18 }}>
            {localStrings.Suggested.SuggestedFriends}
          </Text>
        </View>
        <TouchableOpacity
          onPress={showAction}
        >
          <Entypo name="dots-three-vertical" size={16} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: 100,
          }}
        >
          <ActivityIndicator size="large" color={brandPrimary} />
        </View>
      ) : (
        <>
        <ScrollView
  horizontal={true}
  showsHorizontalScrollIndicator={false}
  contentContainerStyle={{
  }}
>
  {friendSuggestions
    .filter((s) => !s.hidden)
    .map((suggestion) => (
      <Card
        key={suggestion.id}
        style={{
          width: 125,
          height: 200,
          marginRight: 10,
          borderRadius: 10,
          padding: 10,
        }}
      >
        <TouchableOpacity
          className="suggestion-item"
          onPress={() => router.push(`/user/${suggestion.id}`)}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Image
            source={suggestion.avatar_url}
            style={{
              width: 64,
              height: 64,
              borderRadius: 32,
              marginBottom: 10,
            }}
            alt="Avatar"
          />
          <Text
            style={{
              fontWeight: "bold",
              marginTop: 5,
              marginBottom: 5,
            }}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {suggestion.family_name} {suggestion.name}
          </Text>
        </TouchableOpacity>

        {renderFriendButton(suggestion)}

        <TouchableOpacity
          style={{
            alignItems: "center",
            marginTop: 10,
          }}
          onPress={() => handleRemoveSuggestion(suggestion.id!)}
        >
          <Text
            style={{
              color: brandPrimary,
              fontSize: 14,
            }}
          >
            {localStrings.Suggested.Hide}
          </Text>
        </TouchableOpacity>
      </Card>
    ))}
</ScrollView>

            {/* <TouchableOpacity
              onPress={() => setIsModalVisible(true)}
              style={{ padding: 10, alignItems: "center" }}
            >
              <Text
                style={{ color: brandPrimary, textDecorationLine: "underline" }}
              >
                {localStrings.Suggested.SeeMore}
              </Text>
            </TouchableOpacity> */}

          <Modal
            title={localStrings.Suggested.SuggestedFriends}
            visible={isModalVisible}
            onClose={() => setIsModalVisible(false)}
          >
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "space-between",
                paddingHorizontal: 10,
              }}
            >
              {friendSuggestions
                .filter((s) => !s.hidden)
                .slice(0, 9)
                .map((suggestion) => (
                  <Card
                    key={suggestion.id}
                    style={{
                      width: "30%", // khoảng 1/3 chiều ngang
                      height: 200,
                      borderRadius: 10,
                      padding: 10,
                      marginBottom: 15,
                    }}
                  >
                    <TouchableOpacity
                      className="suggestion-item"
                      onPress={() => router.push(`/user/${suggestion.id}`)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Image
                        source={suggestion.avatar_url}
                        style={{
                          width: 64,
                          height: 64,
                          borderRadius: 32,
                          marginBottom: 10,
                        }}
                        alt="Avatar"
                      />
                      <Text
                        style={{
                          fontWeight: "bold",
                          marginTop: 5,
                          marginBottom: 5,
                        }}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        {suggestion.family_name} {suggestion.name}
                      </Text>
                    </TouchableOpacity>

                    {renderFriendButton(suggestion)}

                    <TouchableOpacity
                      style={{
                        alignItems: "center",
                        marginTop: 10,
                      }}
                      onPress={() => handleRemoveSuggestion(suggestion.id!)}
                    >
                      <Text
                        style={{
                          color: brandPrimary,
                          fontSize: 14,
                        }}
                      >
                        {localStrings.Suggested.Hide}
                      </Text>
                    </TouchableOpacity>
                  </Card>
                ))}
            </View>
          </Modal>

          <Modal
            title={localStrings.Suggested.Why}
            transparent
            visible={isWhyModalVisible}
            onClose={() => setIsWhyModalVisible(false)}
            closable
            maskClosable
          >
            <Text style={{ fontWeight: "bold" }}>
              {localStrings.Suggested.WhyExplanation}
            </Text>
            <View>
              <Text>{localStrings.Suggested.WhyFactor1}</Text>
              <Text>{localStrings.Suggested.WhyFactor2}</Text>
              <Text>{localStrings.Suggested.WhyFactor3}</Text>
            </View>
            <Text>{localStrings.Suggested.WhyConclusion}</Text>
          </Modal>
        </>
      )}
    </View>
  );
};

export default FriendSuggestions;
