import { View, Text, TouchableOpacity, ActivityIndicator, Image, SectionList, Platform, FlatList } from 'react-native'
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
  const {colorOnl, backGround, backgroundColor, brandPrimary} = useColor();

  const { localStrings } = useAuth();


       const renderFooter = () => {
            if (!loading) return null;
            return (
              <View style={{ paddingVertical: 10, alignItems: "center" }}>
                <ActivityIndicator size="large" color={brandPrimary} />
              </View>
            );
          };

  const Header = () => (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 10,
        paddingHorizontal: 16,
        backgroundColor: backgroundColor,
        borderBottomWidth: 1,
        borderColor: "#e0e0e0",
        marginTop: Platform.OS === 'ios' ? 30 : 0,
      }}
    >
      <TouchableOpacity onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color={brandPrimary} />
      </TouchableOpacity>
      <Text style={{ fontSize: 18, fontWeight: "bold", color: brandPrimary }}>
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
      <View style={{ flex: 1, backgroundColor: backGround}}>
        <Header />
        <View style={{ flex: 1}}>
          <FlatList 
            data={friends}
            renderItem={({ item }) => {
              return (
                 <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderColor: "#e0e0e0",
        backgroundColor: backgroundColor,
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
     
        <Text style={{ fontSize: 16, color: brandPrimary }}>
          {item.family_name} {item.name}
        </Text>
      </TouchableOpacity>
    </View>
              )}
            }
            keyExtractor={(item) => item?.id as string}
            ListFooterComponent={renderFooter}
            onEndReached={() => handleEndReached(userId)}
            onEndReachedThreshold={0.5}
            removeClippedSubviews={true}
            showsVerticalScrollIndicator={false}
            onRefresh={() => fetchFriends(1, userId)}
            refreshing={loading}/>

           
        </View>
        <Toast />
      </View>
    </ActionSheetProvider>
  );
};

export default ListFriendsScreen