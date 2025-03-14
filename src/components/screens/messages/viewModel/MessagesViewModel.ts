import { useState, useEffect } from 'react';
import { MessagesResponse } from '@/src/api/features/messages/models/Messages';
import { UserModel } from '@/src/api/features/authenticate/model/LoginModel';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { ApiPath } from '@/src/api/ApiPath';
import { defaultProfileRepo } from '@/src/api/features/profile/ProfileRepository';
import { FriendResponseModel } from '@/src/api/features/profile/model/FriendReponseModel';
import Toast from 'react-native-toast-message';

const useMessagesViewModel = (repo: { getMessages: Function }) => {
  const [messages, setMessages] = useState<MessagesResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [friends, setFriends] = useState<FriendResponseModel[]>([]);
  const [loadingFriends, setLoadingFriends] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [replyTo, setReplyTo] = useState<MessagesResponse | null>(null);
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const autoResponses = [
    'Đây là tin nhắn phản hồi tự động.',
    'Xin chào! Đây là phản hồi tự động.',
];

  const fetchMessages = async (newPage: number = 1) => {
    try {
      setLoading(true);
      const response = await repo.getMessages({
        sort_by: 'created_at',
        isDescending: true,
        page: newPage,
        limit: 20,
      });

      if (response?.message === 'Success') {
        if (newPage === 1) {
          setMessages(response?.data || []);
        } else {
          setMessages((prevMessages) => [...prevMessages, ...(response?.data || [])]);
        }

        const { page: currentPage, limit: currentLimit, total: totalRecords } = response?.paging;

        setTotal(totalRecords);
        setPage(currentPage);
        setHasMore(currentPage * currentLimit < totalRecords);
      }
    } catch (error: any) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFriends = async (page: number, userId?: string) => {
  
      try {
        setLoadingFriends(true);
        const response = await defaultProfileRepo.getListFriends({
          user_id: userId,
        });
        if (response?.data ) {
          if (Array.isArray(response?.data)) {
            const friends = response.data.map(
              (friendResponse: FriendResponseModel) => ({
                id: friendResponse.id,
                family_name: friendResponse.family_name,
                name: friendResponse.name,
                avatar: friendResponse.avatar_url,
              })
            ) as FriendResponseModel[];
            setFriends(friends);
          } else {
           console.log("Không có bạn bè nào.");
           setFriends([]);
           
          }
        }
        return friends;
      } catch (error: any) {
        console.error(error);
        Toast.show({
          type: "error",
          text2: error.message,
        });
      } finally {
        setLoadingFriends(false);
      }
    };

  useEffect(() => {
    fetchMessages(); 
  }, []);

  const handleSendMessage = async (message: MessagesResponse) => {
    if(newMessage.trim() !== ''){
    setMessages((prevMessages) => [...prevMessages, message]);
    setNewMessage('');
    setReplyTo(null);}

    console.log('Sending message:', message);
    

    setTimeout(() => {
      const autoResponse = autoResponses[Math.floor(Math.random() * autoResponses.length)];
      setMessages((prevMessages) => [...prevMessages, { id: `${Date.now()}-${Math.floor(Math.random() * 10000)}`, sender: 'Hệ thống', contextChat: autoResponse, timestamp: new Date().toISOString() }]);
    } , 1000);
  };

  const handleReplyMessage = (message: MessagesResponse) => {
    setReplyTo(message);
  };

  const handleDeleteMessage = async (messageId: string) => {
    setMessages((prevMessages) => prevMessages.filter((msg) => msg.id !== messageId));
  };

  const handleAddReaction = (messageId: string, reaction: string) => {
    setMessages((prevMessages) =>
      prevMessages.map((msg) =>
        msg.id === messageId
          ? { ...msg, reactions: { ...msg.reactions, [reaction]: (msg.reactions?.[reaction] || 0) + 1 } }
          : msg
      )
    );
  };

  return {
    messages,
    loading,
    hasMore,
    newMessage,
    replyTo,
    activeChat,
    friends,
    loadingFriends,
    setNewMessage,
    setReplyTo,
    setActiveChat,
    fetchMessages,
    fetchFriends,
    handleSendMessage,
    handleReplyMessage,
    handleDeleteMessage,
    handleAddReaction,
  };
};

export default useMessagesViewModel;
