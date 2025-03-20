import { View, Text, TouchableOpacity, Image, Platform, ActivityIndicator, SectionList } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import useListFriendsViewModel from '../../listFriends/viewModel/ListFriendsViewModel';
import { router } from 'expo-router';
import { useAuth } from '@/src/context/auth/useAuth';
import { Checkbox, Form, Input } from '@ant-design/react-native';
import { AntDesign } from '@expo/vector-icons';
import useColor from '@/src/hooks/useColor';
import useConversationViewModel from '../viewModel/ConversationViewModel';
import { defaultMessagesRepo } from '@/src/api/features/messages/MessagesRepo';
import useConversationDetailViewModel from '../viewModel/ConversationDetailsViewModel';

const AddGroupModel = () => {
    const {user} = useAuth();
    const [groupForm] = Form.useForm();
    const {brandPrimary} = useColor();
    const {
        friends,
        page,
        fetchFriends,
        loading,
        hasMore,
        handleEndReached,
      } = useListFriendsViewModel();
  
  const {createConversation,} = useConversationViewModel(defaultMessagesRepo);
  const {createConversationDetail} = useConversationDetailViewModel(defaultMessagesRepo);
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);

const toggleSelectFriend = (friendId: string) => {
  setSelectedFriends((prev) => {
    if (prev.includes(friendId)) {
      return prev.filter((id) => id !== friendId); // Bỏ chọn
    } else {
      return [...prev, friendId]; // Chọn
    }
  });
};


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
    >    <Checkbox
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
    
    const handleAddGroup = async () => {
      try {
        if (selectedFriends.length === 0) {
          alert("Vui lòng chọn ít nhất một người bạn!");
          return;
        }
    
        // 🔥 Dữ liệu tạo nhóm
        const data = {
          name: groupForm.getFieldValue("message"),
        };
    
        // 🔥 Gọi API tạo conversation
        const newConversation = await createConversation(data);
        if (!newConversation || !newConversation.id) {
          alert("Lỗi khi tạo nhóm!");
          return;
        }
    
        const conversationId = newConversation.id;
    
        // 🔥 Thêm chính bạn vào danh sách
        const allMembers = [...selectedFriends, user?.id];
    
        // 🔥 Gọi API tạo `conversation_detail` cho tất cả thành viên
        await Promise.all(
          allMembers.map((friendId) =>
            createConversationDetail({
              conversation_id: conversationId,
              user_id: friendId,
            })
          )
        );
        
        router.push(`/chat?conversation_id=${conversationId}`);
      } catch (error) {
        console.error("Lỗi khi tạo nhóm:", error);
        alert("Có lỗi xảy ra, vui lòng thử lại!");
      }
    };
    
  return (
    <View>
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
                paddingBottom: Platform.OS === "ios" ? 10 : 40,
              }}
            >
              <Form.Item noStyle name="message">
                <Input
                  placeholder={"Type your message here"}
                  style={{
                    flex: 1,
                    borderColor: "#ccc",
                    borderWidth: 1,
                    borderRadius: 5,
                    padding: 10,
                    backgroundColor: "#fff",
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5,
                  }}
                //   value={newMessage}
                //   onChangeText={(text) => setNewMessage(text)}
                />
              </Form.Item>

              <View
                style={{
                  backgroundColor: "white",
                  borderRadius: 50,
                  marginLeft: 10,
                  padding: 10,
                  justifyContent: "center",
                  alignItems: "center",
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.2,
                  shadowRadius: 1.5,
                  elevation: 5,
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    handleAddGroup();
                  }}
                >
                  {/* <FontAwesome name="send-o" size={30} color={brandPrimary} /> */}
                  <AntDesign name="addusergroup" size={24} color={brandPrimary} style={{ marginLeft: 'auto' }} />
                </TouchableOpacity>
              </View>
            </View>
          </Form>
           <SectionList
                        sections={[{ title: "", data: friends as any }]}
                        renderItem={renderFriend}
                        keyExtractor={(item) => item.id}
                        onEndReached={handleEndReached}
                        onEndReachedThreshold={0.5}
                        ListFooterComponent={
                          loading && hasMore ? (
                            <ActivityIndicator size="small" color="blue" />
                          ): null
                        }
                      />
    </View>
  )
}

export default AddGroupModel