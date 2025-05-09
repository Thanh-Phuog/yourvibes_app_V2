import { View, Text, TouchableOpacity, ActivityIndicator, Image, SectionList, Platform } from 'react-native'
import React, { useEffect } from 'react'
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import useListFriendsViewModel from '../viewModel/ListFriendsViewModel';
import { useAuth } from '@/src/context/auth/useAuth';
import Toast from 'react-native-toast-message';
import useColor from '@/src/hooks/useColor';

const ListFriendsScreen = ({ userId }: { userId: string }) => {
  const {
    loading,
    friends,
    handleEndReached,
    hasMore,
    page,
    handleMoreOptions,
    fetchFriends,
  } = useListFriendsViewModel();
  const {colorOnl} = useColor();

  const { localStrings } = useAuth();
  const renderFriend = ({
    item,
  }: {
    item: { id: string; avatar_url: string; family_name: string; name: string,   ative_status: boolean; };
  }) => (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderColor: "#e0e0e0",
      }}
    >
      <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", flex: 1 }} onPress={() => {
        router.push(`/(tabs)/user/${item?.id}`);
      }}>
        <View style={{ position: "relative", flexDirection: "row" }}>
             <Image
          source={{ uri: item.avatar_url }}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: "#e0e0e0",
            marginRight: 10,
            shadowColor: '#BA8DA7',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
          }}
        />
        {item?.ative_status && (
           <View
           style={{
             position: "absolute",
             bottom: 0,
             right: 0,
             width: 12,
             height: 12,
             backgroundColor: colorOnl || "#00CED1",
             borderRadius: 6,
             borderWidth: 2,
             borderColor: 'white',
           }}
         />
        )}
        </View>
     
        <Text style={{ fontSize: 16, color: "black" }}>
          {item.family_name} {item.name}
        </Text>
      </TouchableOpacity>

      {/* <TouchableOpacity
        style={{ paddingHorizontal: 10 }}
        onPress={() => handleMoreOptions(item)}
      >
        <Ionicons name="ellipsis-vertical" size={24} color="black" />
      </TouchableOpacity> */}
    </View>
  );

  const Header = () => (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 10,
        paddingHorizontal: 16,
        backgroundColor: "white",
        borderBottomWidth: 1,
        borderColor: "#e0e0e0",
        marginTop: Platform.OS === 'ios' ? 30 : 0,
      }}
    >
      <TouchableOpacity onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
      <Text style={{ fontSize: 18, fontWeight: "bold" }}>
        {localStrings.ListFriends.ListFriends}
      </Text>
      <View />
    </View>
  );
  useEffect(() => {
    if (userId) {
      fetchFriends(page, userId);
    }
  }, [userId]);
  return (
    <ActionSheetProvider>
      <View style={{ flex: 1, backgroundColor: "white" }}>
        <Header />
        <View style={{ flex: 1, paddingHorizontal: 16 }}>
          {loading && page === 1 ? (
            <ActivityIndicator size="large" color="blue" />
          ) : (
            <SectionList
              sections={[{ title: "", data: friends as any }]}
              renderItem={renderFriend}
              keyExtractor={(item) => item.id}
              onEndReached={handleEndReached}
              onEndReachedThreshold={0.5}
              ListFooterComponent={
                loading && hasMore ? (
                  <ActivityIndicator size="small" color="blue" />
                ) : friends?.length === 0 ?
                  (
                    <>
                      <Image
                        source={{
                          uri: "https://res.cloudinary.com/dkf51e57t/image/upload/v1729847545/Search-rafiki_uuq8tx.png",
                        }}
                        style={{
                          width: "100%",
                          height: 280,
                          resizeMode: "contain",
                        }}
                      />
                      <TouchableOpacity onPress={() => router.push("/(tabs)/search")}>
                        <Text
                          style={{
                            paddingHorizontal: 20,
                            color: "gray",
                            textAlign: "center",
                            fontSize: 16,
                          }}
                        >
                          {localStrings.Public.FriendFind}
                        </Text>
                      </TouchableOpacity>
                    </>
                  ) : null
              }
            />
          )}
        </View>
        <Toast />
      </View>
    </ActionSheetProvider>
  );
};

export default ListFriendsScreen