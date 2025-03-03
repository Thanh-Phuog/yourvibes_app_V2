import { useState, useEffect } from 'react';
import { MessagesResponse } from '@/src/api/features/messages/models/Messages';

const useMessagesViewModel = (repo: { getMessages: Function }) => {
  const [messages, setMessages] = useState<MessagesResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const [newMessage, setNewMessage] = useState('');
  const [replyTo, setReplyTo] = useState<MessagesResponse | null>(null);
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const autoResponses = [
    'Đây là tin nhắn phản hồi tự động.',
    'Xin chào! Đây là phản hồi tự động.',
    'Chúng tôi sẽ liên hệ lại sớm nhất có thể.',
    'Cảm ơn bạn đã nhắn tin. Đây là phản hồi tự động.',
    'Hệ thống đang bận. Đây là phản hồi tự động.',
    'Chúng tôi đã nhận được tin nhắn của bạn.',
    'Tin nhắn tự động: Chúng tôi sẽ trả lời sớm.',
    'Cảm ơn bạn đã liên hệ. Đây là phản hồi tự động.',
    'Xin đợi trong giây lát, đây là phản hồi tự động.',
    'Phản hồi tự động: Chúng tôi sẽ sớm liên hệ lại.',
    'Tin nhắn của bạn đã được ghi nhận.',
    'Đây là phản hồi tự động từ hệ thống.',
    'Chúng tôi sẽ trả lời bạn trong thời gian sớm nhất.',
    'Phản hồi tự động: Cảm ơn bạn đã nhắn tin.',
    'Xin chào! Đây là phản hồi tự động từ hệ thống.',
    'Cảm ơn bạn, tin nhắn của bạn đã được tiếp nhận.',
    'Chúng tôi hiện không thể trả lời ngay lập tức.',
    'Đây là phản hồi tự động. Vui lòng chờ đợi.',
    'Tin nhắn tự động: Xin vui lòng kiên nhẫn chờ.',
    'Chúng tôi sẽ liên hệ lại trong thời gian sớm nhất.',
    'Xin cảm ơn! Đây là phản hồi tự động.',
    'Tin nhắn của bạn đã được chuyển đến bộ phận liên quan.',
    'Đây là phản hồi tự động. Chúng tôi đang kiểm tra.',
    'Phản hồi tự động: Xin vui lòng chờ thêm ít phút.',
    'Chúng tôi đánh giá cao phản hồi của bạn.',
    'Hệ thống đang xử lý yêu cầu của bạn.',
    'Đây là tin nhắn tự động, xin đừng trả lời.',
    'Cảm ơn bạn đã kiên nhẫn chờ đợi.',
    'Phản hồi tự động: Chúng tôi đang xử lý yêu cầu.',
    'Xin lỗi, hiện tại chúng tôi không thể trả lời.',
    'Tin nhắn của bạn rất quan trọng với chúng tôi.',
    'Đây là phản hồi tự động, xin vui lòng chờ.',
    'Chúng tôi sẽ trả lời ngay khi có thể.',
    'Xin chào! Đây là tin nhắn tự động.',
    'Chúng tôi đang xem xét yêu cầu của bạn.',
    'Tin nhắn tự động: Cảm ơn bạn đã liên hệ.',
    'Chúng tôi sẽ phản hồi trong thời gian sớm nhất.',
    'Phản hồi tự động: Chúng tôi đã nhận được tin nhắn.',
    'Đây là tin nhắn phản hồi tự động từ hệ thống.',
    'Xin vui lòng chờ, chúng tôi sẽ liên hệ lại.',
    'Chúng tôi trân trọng phản hồi của bạn.',
    'Phản hồi tự động: Hệ thống đang bận.',
    'Cảm ơn bạn đã kiên nhẫn.',
    'Tin nhắn tự động: Chúng tôi sẽ sớm trả lời.',
    'Đây là phản hồi tự động. Cảm ơn bạn.',
    'Chúng tôi đang xử lý yêu cầu của bạn.',
    'Phản hồi tự động: Xin vui lòng chờ đợi.',
    'Tin nhắn của bạn đã được ghi nhận.',
    'Chúng tôi sẽ liên hệ lại trong thời gian sớm nhất.',
    'Đây là phản hồi tự động từ hệ thống.',
    'Xin vui lòng chờ, chúng tôi sẽ phản hồi ngay.',
    'Phản hồi tự động: Hệ thống đang xử lý yêu cầu.',
    'Cảm ơn bạn đã liên hệ với chúng tôi.',
    'Tin nhắn tự động: Chúng tôi sẽ sớm trả lời.',
    'Phản hồi tự động: Xin vui lòng kiên nhẫn.',
    'Đây là tin nhắn phản hồi tự động.',
    'Xin cảm ơn! Đây là phản hồi tự động.',
    'Tin nhắn của bạn đã được chuyển đến bộ phận liên quan.',
    'Đây là phản hồi tự động. Chúng tôi đang kiểm tra.',
    'Phản hồi tự động: Xin vui lòng chờ thêm ít phút.',
    'Chúng tôi đánh giá cao phản hồi của bạn.',
    'Hệ thống đang xử lý yêu cầu của bạn.',
    'Đây là tin nhắn tự động, xin đừng trả lời.',
    'Cảm ơn bạn đã kiên nhẫn chờ đợi.',
    'Phản hồi tự động: Chúng tôi đang xử lý yêu cầu.',
    'Xin lỗi, hiện tại chúng tôi không thể trả lời.',
    'Tin nhắn của bạn rất quan trọng với chúng tôi.',
    'Đây là phản hồi tự động, xin vui lòng chờ.',
    'Chúng tôi sẽ trả lời ngay khi có thể.',
    'Xin chào! Đây là tin nhắn tự động.',
    'Chúng tôi đang xem xét yêu cầu của bạn.',
    'Tin nhắn tự động: Cảm ơn bạn đã liên hệ.',
    'Chúng tôi sẽ phản hồi trong thời gian sớm nhất.',
    'Phản hồi tự động: Chúng tôi đã nhận được tin nhắn.',
    'Đây là tin nhắn phản hồi tự động từ hệ thống.',
    'Xin vui lòng chờ, chúng tôi sẽ liên hệ lại.',
    'Chúng tôi trân trọng phản hồi của bạn.',
    'Phản hồi tự động: Hệ thống đang bận.',
    'Cảm ơn bạn đã kiên nhẫn.',
    'Tin nhắn tự động: Chúng tôi sẽ sớm trả lời.'
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
    setNewMessage,
    setReplyTo,
    setActiveChat,
    fetchMessages,
    handleSendMessage,
    handleReplyMessage,
    handleDeleteMessage,
    handleAddReaction,
  };
};

export default useMessagesViewModel;
