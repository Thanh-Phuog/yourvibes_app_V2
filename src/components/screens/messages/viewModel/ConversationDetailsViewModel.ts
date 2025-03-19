import { MessagesRepo } from "@/src/api/features/messages/MessagesRepo";
import { ConversationDetailResponseModel } from "@/src/api/features/messages/models/ConversationDetail";
import { useState } from "react";

const useConversationDetailViewModel = (repo: MessagesRepo) => {
    const [conversationsDetail, setConversationsDetail] = useState<ConversationDetailResponseModel[]>([]);
    const [loading, setLoading] = useState(false);
    const [pageDetail, setPageDetail] = useState(1);
    const [total, setTotal] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    const fetchConversationsDetail = async (newPage: number = 1, user_id ?: string, conversation_id ?: string) => {
        try {
            setLoading(true);
            const response = await repo.getConversationDetails({
                conversation_id: conversation_id ?? undefined,
                user_id: user_id ?? undefined,
                page: newPage,
                limit: 20,
            })

            if (response?.message === 'Success') {
                if (newPage === 1) {
                    setConversationsDetail(response?.data as ConversationDetailResponseModel[] || []);
                } else {
                    setConversationsDetail((prevConversations) => [...prevConversations, ...(response?.data as ConversationDetailResponseModel[] || [])]);
                }

                const { page: currentPage, limit: currentLimit, total: totalRecords } = response?.paging;

                setTotal(totalRecords);
                setPageDetail(currentPage);
                setHasMore(currentPage * currentLimit < totalRecords);
            }
        } catch (error: any) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    return { conversationsDetail, loading, pageDetail, total, hasMore, fetchConversationsDetail };
}

export default useConversationDetailViewModel;