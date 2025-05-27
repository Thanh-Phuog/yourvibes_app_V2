import { MessagesRepo } from '@/src/api/features/messages/MessagesRepo';
import { CreateMessageModel, MessageResponseModel } from '@/src/api/features/messages/models/Messages';
import { useWebSocket } from '@/src/context/socket/useSocket';
import { useState, useEffect } from 'react';

const useMessagesViewModel = (repo: MessagesRepo) => {
  const [messages, setMessages] = useState<MessageResponseModel[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const {socketMessages} = useWebSocket();
  const [newMessage, setNewMessage] = useState('');
  const [replyTo, setReplyTo] = useState<MessageResponseModel | null>(null);
 

  const fetchMessages = async (newPage: number = 1, conversation_id: string) => {
    try {
      setLoadingMessages(true);
      const response = await repo.getMessagesByConversationId({
        conversation_id: conversation_id,
        sort_by: "created_at",
        is_descending: true,
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
      setLoadingMessages(false);
    }
  };

  const handleSendMessage = async (message: CreateMessageModel) => {
   try {
    
      const response = await repo.createMessage(message);
      if (!response?.error) {
        // setMessages((prevMessages) => [
        //   ...prevMessages,
        //   { ...message, conversation: replyTo?.conversation || '' } as MessageResponseModel,
        // ]);
        setNewMessage('');
      }else{
        console.log(response?.error?.message);
      }
    }
    catch (error: any) {
      console.error(error);
    }
    
  };

  const handleReplyMessage = (message: MessageResponseModel) => {
    setReplyTo(message);
  };

  const handleDeleteMessage = async (messageId: string) => {
    setMessages((prevMessages) => prevMessages.filter((msg) => msg.id !== messageId));
  };

 const loadMoreMessages = (conversation_id: string) => {
    if (!loadingMessages && hasMore) {
      setPage((prevPage) => prevPage + 1);
      fetchMessages(page + 1, conversation_id);
    }
  }

  // useEffect(() => {
  //   if (socketMessages) {
  //    if (socketMessages.length > 0) {
  //      fetchMessages(1, socketMessages[0].conversation_id);
  //    }
  //   }
  // }, [socketMessages]);

  return {
    messages,
    setMessages,
    loadingMessages,
    hasMore,
    newMessage,
    replyTo,
    setNewMessage,
    setReplyTo,
    fetchMessages,
    handleSendMessage,
    handleReplyMessage,
    handleDeleteMessage,
    page,
    loadMoreMessages
  };
};

export default useMessagesViewModel;
