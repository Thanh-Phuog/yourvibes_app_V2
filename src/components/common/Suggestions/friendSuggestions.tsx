import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from "react-native";
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
    hasMoreFriend,
    handleLoadMore,
    onViewableItemsChanged,
    visibleItems,
  } = friendSuggestionsViewModel(defaultNewFeedRepo);

  const renderFriendButton = useCallback(
    (suggestion: FriendSuggestionWithStatus) => {
      const userId = suggestion.id!;
      const isLoading = friendRequestLoading[userId];


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
    [friendRequestLoading, localStrings, handleFriendRequest, backgroundColor, brandPrimary]
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
  const renderFooter = () => {
    if (!hasMoreFriend) return null;
    return (
      <View style={{ paddingVertical: 10, alignItems: "center" }}>
        <ActivityIndicator size="large" color={brandPrimary} />
      </View>
    );
  };

  useEffect(() => {
    fetchSuggestions();
  }, []);

  return (
    <>
      {friendSuggestions.length > 0 && (
        <View
          className="friend-suggestions"
          style={{
            // padding: 10,
            // backgroundColor: backgroundColor,
            borderRadius: 10,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 5,
            marginTop: 10,
            marginHorizontal: 10,
          }}
        >
          {/* <View
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 10,
              flexDirection: "row",
            }}
          > */}
            {/* <View
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                flexDirection: "row",
              }}
            > */}
              {/* <UsergroupAddOutlined style={{ fontSize: "18px" }} /> */}
              {/* <FontAwesome5
                name="user-friends"
                size={18}
                color={brandPrimary}
              />
              <Text style={{ fontWeight: "bold", fontSize: 14, color: brandPrimary }}>
                {localStrings.Suggested.SuggestedFriends}
              </Text> */}
            {/* </View> */}
            {/* <TouchableOpacity onPress={showAction} >
              <Entypo name="dots-three-vertical" size={16} color={brandPrimary}/>
            </TouchableOpacity> */}
          {/* </View> */}
            <>
              <FlatList
                data={friendSuggestions}
                horizontal={true}
                keyExtractor={(item, index) => item?.id as string}
                renderItem={({ item }) => (
                  <Card
                    key={item.id}
                    style={{
                      width: 125,
                      height: 200,
                      marginRight: 10,
                      borderRadius: 10,
                      padding: 10,
                      backgroundColor: backgroundColor,
                    }}
                  >
                    <TouchableOpacity
                      className="suggestion-item"
                      onPress={() => router.push(`/user/${item.id}`)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Image
                        source={item.avatar_url}
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
                          color: brandPrimary,
                        }}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        {item.family_name} {item.name}
                      </Text>
                    </TouchableOpacity>

                    {renderFriendButton(item)}

                    <TouchableOpacity
                      style={{
                        alignItems: "center",
                        marginTop: 10,
                      }}
                      onPress={() => handleRemoveSuggestion(item.id!)}
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
                )}
                showsHorizontalScrollIndicator={false}
                ListFooterComponent={renderFooter} // ✅ bật lại
                ListFooterComponentStyle={{
                  width: 125, // ⚠️ cùng chiều ngang 1 card
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onEndReached={handleLoadMore}
                contentContainerStyle={{ paddingRight: 20 }}
                onEndReachedThreshold={0.5}
                removeClippedSubviews={true}
                showsVerticalScrollIndicator={false}
                onViewableItemsChanged={onViewableItemsChanged.current}
                viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
              />

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
          {/* )} */}
        </View>
      )}
    </>
  );
};

export default FriendSuggestions;
