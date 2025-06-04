import { MessagesRepo } from "@/src/api/features/messages/MessagesRepo";
import { ConversationDetailRequestModel, ConversationDetailResponseModel, CreateConversationDetail } from "@/src/api/features/messages/models/ConversationDetail";
import { useAuth } from "@/src/context/auth/useAuth";
import { CustomStatusCode } from "@/src/utils/helper/CustomStatus";
import { router } from "expo-router";
import { useState } from "react";
import Toast from "react-native-toast-message";

const useConversationDetailViewModel = (repo: MessagesRepo) => {
    const {localStrings} = useAuth();
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
            
            if (!response?.error) {
               return response;
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
            
            if (!response?.error) {
                return response;
            } else {
                if (response?.error?.code === CustomStatusCode.CantLeaveConversationIfIsOwners ){
                       Toast.show({
                    type: 'error',
                    text1: localStrings.Messages.CantLeaveGroup,
                });
                }
            }

        } catch (error: any) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    
    const TransferOwnerRole = async (data: ConversationDetailRequestModel) => {
        try {
            setLoading(true);
            const response = await repo.TransferOwnerRole(data);
            console.log('response', response);
            
            if (!response?.error) {
                fetchConversationsDetail();
                
            } else {
                Toast.show({
                    type: 'error',
                    text1: response?.error?.message,
                });
            }

        } catch (error: any) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }



    return { conversationsDetail, loading, pageDetail, total, hasMore, fetchConversationsDetail, createConversationDetail, loadMoreConversationsDetail, setConversationsDetail, UpdateConversationDetail, DeleteConversationDetail, TransferOwnerRole };
}

export default useConversationDetailViewModel;