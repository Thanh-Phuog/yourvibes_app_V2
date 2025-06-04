"use client"
import { View, Text, Image, ActivityIndicator, SectionList, TouchableOpacity, Platform } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useAuth } from '@/src/context/auth/useAuth';
import { Checkbox, Form } from '@ant-design/react-native';
import useColor from '@/src/hooks/useColor';
import useListFriendsViewModel from '../../listFriends/viewModel/ListFriendsViewModel';
import useConversationDetailViewModel from '../../messages/viewModel/ConversationDetailsViewModel';
import { defaultMessagesRepo } from '@/src/api/features/messages/MessagesRepo';
import { AntDesign } from '@expo/vector-icons';
import { ConversationDetailResponseModel } from '@/src/api/features/messages/models/ConversationDetail';
import { CustomStatusCode } from '@/src/utils/helper/CustomStatus';

const AddUserGroup = ({ conversationsDetail, setShowUserGroupModel, setConversationsDetail }: { conversationsDetail: ConversationDetailResponseModel[]; setShowUserGroupModel: (show: boolean) => void; setConversationsDetail: React.Dispatch<React.SetStateAction<ConversationDetailResponseModel[]>> }) => {
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
  const { user } = useAuth();
  const [groupForm] = Form.useForm();
  const { brandPrimary, backGround, backgroundColor } = useColor();
  const { friends, page, fetchFriends, loading, hasMore } = useListFriendsViewModel();

  const { createConversationDetail, fetchConversationsDetail } = useConversationDetailViewModel(defaultMessagesRepo);

  // Lọc bạn bè chưa có trong nhóm
  const filteredFriends = friends.filter(
    (friend) => !conversationsDetail.some((conversation) => conversation.user.id === friend.id)
  );

  // Bật/tắt chọn bạn bè
  const toggleSelectFriend = (friendId: string) => {
    setSelectedFriends((prev) => {
      if (prev.includes(friendId)) {
        return prev.filter((id) => id !== friendId);
      } else {
        return [...prev, friendId];
      }
    });
  };

  // Load danh sách bạn bè lần đầu khi có user
  useEffect(() => {
    if (user) {
      fetchFriends(page, user.id);
    }
  }, [user]);

  // Xử lý khi cuộn tới cuối danh sách
  const handleEndReached = ({ distanceFromEnd }: { distanceFromEnd: number }) => {
    if (distanceFromEnd > 0 && !loading && hasMore) {
      fetchFriends(page + 1, user?.id);
    }
  };

  // Thêm thành viên vào nhóm
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

       const response = await createConversationDetail({
        conversation_id: conversationsDetail[0].conversation.id,
        user_ids: selectedFriends,
      });

      if (response && response.code === CustomStatusCode.Success) {
        
         await fetchConversationsDetail(1, conversationsDetail[0].conversation.id);
  


  setShowUserGroupModel(false);
  setSelectedFriends([]);
        setShowUserGroupModel(false);
        setSelectedFriends([]);
      }

    } catch (error) {
      console.error("Error adding user to group:", error);
    }
  };

  // Render từng bạn bè trong danh sách
  const renderFriend = ({
    item,
  }: {
    item: { id: string; avatar_url: string; family_name: string; name: string };
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
        source={{ uri: item.avatar_url }}
        style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: "#e0e0e0",
          marginRight: 10,
        }}
      />
      <Text style={{ fontSize: 16, color: brandPrimary }}>
        {item.family_name} {item.name}
      </Text>
    </View>
  );

  return (
    <View>
      <Form
        style={{
          backgroundColor: backgroundColor,
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
              backgroundColor: backGround,
              borderRadius: 50,
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
              onPress={handleAddUserGroup}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
              }}
            >
              <Text style={{ color: brandPrimary }}>Thêm thành viên</Text>
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
        ListEmptyComponent={() =>
          !loading ? (
            <Text
              style={{
                textAlign: "center",
                marginTop: 20,
                fontSize: 20,
                color: brandPrimary,
                backgroundColor,
              }}
            >
              Không có bạn bè nào để thêm vào nhóm.
            </Text>
          ) : null
        }
      />
    </View>
  );
};

export default AddUserGroup;
