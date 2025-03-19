import { MessagesRepo } from '@/src/api/features/messages/MessagesRepo';
import { CreateMessageModel, MessageResponseModel } from '@/src/api/features/messages/models/Messages';
import { useState, useEffect } from 'react';

const useMessagesViewModel = (repo: MessagesRepo) => {
  const [messages, setMessages] = useState<MessageResponseModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const [newMessage, setNewMessage] = useState('');
  const [replyTo, setReplyTo] = useState<MessageResponseModel | null>(null);
 

  const fetchMessages = async (newPage: number = 1, conversation_id: string) => {
    try {
      setLoading(true);
      const response = await repo.getMessagesByConversationId({
        conversation_id: conversation_id,
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

  const handleSendMessage = async (message: CreateMessageModel) => {
   try {
    console.log("message", message);
    
      const response = await repo.createMessage(message);
      if (!response?.error) {
        setMessages((prevMessages) => [
          ...prevMessages,
          { ...message, conversation: replyTo?.conversation || '' } as MessageResponseModel,
        ]);
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

  // const handleAddReaction = (messageId: string, reaction: string) => {
  //   setMessages((prevMessages) =>
  //     prevMessages.map((msg) =>
  //       msg.id === messageId
  //         ? { ...msg, reactions: { ...msg.reactions, [reaction]: (msg.reactions?.[reaction] || 0) + 1 } }
  //         : msg
  //     )
  //   );
  // };

  
  return {
    messages,
    loading,
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
    // handleAddReaction,
  };
};

export default useMessagesViewModel;
