import { MessagesRepo } from "@/src/api/features/messages/MessagesRepo";
import { ConversationDetailRequestModel, ConversationDetailResponseModel, CreateConversationDetail } from "@/src/api/features/messages/models/ConversationDetail";
import { useState } from "react";

const useConversationDetailViewModel = (repo: MessagesRepo) => {
    const [conversationsDetail, setConversationsDetail] = useState<ConversationDetailResponseModel[]>([]);
    const [loading, setLoading] = useState(false);
    const [pageDetail, setPageDetail] = useState(1);
    const [total, setTotal] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    const fetchConversationsDetail = async (newPage: number = 1, conversation_id ?: string) => {
        try {
            setLoading(true);
            const response = await repo.getConversationDetails({
                conversation_id: conversation_id ?? undefined,
                page: newPage,
                limit: 10,
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

    const createConversationDetail = async (data: CreateConversationDetail) => {
        try { 
            setLoading(true);
            const response = await repo.createConversationDetail(data);
            console.log("CreateConversationDetail response:", response);
            
            if (!response?.error) {
                fetchConversationsDetail();
            }
        } catch (error: any) {
            console.error(error);
        }
        finally {
            setLoading(false);
        }
    }

    const loadMoreConversationsDetail = (user_id ?: string, conversation_id ?: string) => {
        if (!loading && hasMore) {
            setPageDetail((prevPage) => prevPage + 1);
            fetchConversationsDetail(pageDetail + 1, conversation_id);
        }
    }

    const UpdateConversationDetail = async (data: ConversationDetailRequestModel) => {
        try {
            setLoading(true);
            const response = await repo.UpdateConversationDetail(data);
            console.log("UpdateConversationDetail response:", response);

            if (!response?.error) {
                return response?.data ;
            }
        } catch (error: any) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const DeleteConversationDetail = async (data: ConversationDetailRequestModel) => {
        try {
            setLoading(true);
            const response = await repo.DeleteConversationDetail(data);
            console.log("DeleteConversationDetail response:", response);

            if (!response?.error) {
                fetchConversationsDetail();
            }
        } catch (error: any) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }



    return { conversationsDetail, loading, pageDetail, total, hasMore, fetchConversationsDetail, createConversationDetail, loadMoreConversationsDetail, setConversationsDetail, UpdateConversationDetail, DeleteConversationDetail };
}

export default useConversationDetailViewModel;