import { View, Text, Image, ActivityIndicator, SectionList, TouchableOpacity, Platform } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useAuth } from '@/src/context/auth/useAuth';
import { Checkbox, Form, Input } from '@ant-design/react-native';
import useColor from '@/src/hooks/useColor';
import useListFriendsViewModel from '../../listFriends/viewModel/ListFriendsViewModel';
import useConversationDetailViewModel from '../../messages/viewModel/ConversationDetailsViewModel';
import { defaultMessagesRepo } from '@/src/api/features/messages/MessagesRepo';
import { AntDesign } from '@expo/vector-icons';
import { ConversationDetailResponseModel } from '@/src/api/features/messages/models/ConversationDetail';

const AddUserGroup = ({conversationsDetail}: {conversationsDetail: ConversationDetailResponseModel[]}) => {
     const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
     const { user } = useAuth();
     const [groupForm] = Form.useForm();
     const { brandPrimary } = useColor();
     const { friends, page, fetchFriends, loading, hasMore, handleEndReached } =
       useListFriendsViewModel();
       const { createConversationDetail, } =
       useConversationDetailViewModel(defaultMessagesRepo);

    const toggleSelectFriend = (friendId: string) => {
        setSelectedFriends((prev) => {
          if (prev.includes(friendId)) {
            return prev.filter((id) => id !== friendId); // Bỏ chọn
          } else {
            return [...prev, friendId]; // Chọn
          }
        });
      };

      const filteredFriends = friends.filter(
        (friend) => !conversationsDetail.some((conversation) => conversation.user.id === friend.id)
      );
      

      const renderFriend = ({
        item,
      }: {
        item: { id: string; avatar: string; family_name: string; name: string };
      }) => (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: 10,
            paddingLeft: 10,
            borderBottomWidth: 1,
            borderColor: "#e0e0e0",
          }}
        >
          <Checkbox
            checked={selectedFriends.includes(item.id)}
            onChange={() => toggleSelectFriend(item.id)}
          />
          <Image
            source={{ uri: item.avatar }}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: "#e0e0e0",
              marginRight: 10,
            }}
          />
          <Text style={{ fontSize: 16, color: "black" }}>
            {item.family_name} {item.name}
          </Text>
        </View>
      );
    
      useEffect(() => {
        if (user) {
          fetchFriends(page, user.id);
        }
      }, [user]);
      const handleAddUserGroup = async () => {
        try {
            if (selectedFriends.length === 0) {
                alert("Please select at least one friend to add to the group.");
                return;
            }
    
            if (!conversationsDetail || conversationsDetail.length === 0) {
                alert("Không tìm thấy cuộc trò chuyện.");
                return;
            }
            await createConversationDetail({
                conversation_id: conversationsDetail[0].conversation.id,
                user_ids: selectedFriends,
            });
    
        } catch (error) {
            console.error("Error adding user to group:", error);
        }
    };
    
      
      
  return (
    <View>
      {filteredFriends.length === 0 ? (
        <Text style={{ textAlign: "center", marginTop: 20, fontSize: 20 }}>
          Không có bạn bè nào để thêm vào nhóm.
        </Text>
      ):(
        <>
        <Form
        style={{
          backgroundColor: "#fff",
        }}
        form={groupForm}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            padding: 10,
            paddingBottom: Platform.OS === "ios" ? 10 : 20,
          }}
        >

          <View
            style={{
              backgroundColor: "white",
              borderRadius: 50,
              // marginLeft: 10,
              padding: 10,
              justifyContent: "center",
              alignItems: "center",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.2,
              shadowRadius: 1.5,
              elevation: 5,
              width: "100%",
            }}
          >
            <TouchableOpacity
              onPress={() => {
                handleAddUserGroup();
              }}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
              }}
            >
              <Text>Thêm thành viên</Text>
              {/* <FontAwesome name="send-o" size={30} color={brandPrimary} /> */}
              <AntDesign
                name="addusergroup"
                size={24}
                color={brandPrimary}
                style={{ marginLeft: "auto" }}
              />
            </TouchableOpacity>
          </View>
        </View>
      </Form>
      <SectionList
        sections={[{ title: "", data: filteredFriends as any }]}
        renderItem={renderFriend}
        keyExtractor={(item) => item.id}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loading && hasMore ? (
            <ActivityIndicator size="small" color="blue" />
          ) : null
        }
      />
      </>
      )}
     
    </View>
  )
}

export default AddUserGroup