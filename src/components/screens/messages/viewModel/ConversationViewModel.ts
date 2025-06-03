import { MessagesRepo } from "@/src/api/features/messages/MessagesRepo";
import { ConversationResponseModel, CreateConversationModel, UpdateConversationModel } from "@/src/api/features/messages/models/Conversation";
import { useState } from "react";
import Toast from "react-native-toast-message";

const useConversationViewModel = (repo : MessagesRepo) => {
    const [conversations, setConversations] = useState<ConversationResponseModel[]>([]);
    const [conversationId, setConversationId] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [total, setTotal] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [pageCv, setPageCv] = useState(1);
    
    const fetchConversations = async (newPage: number = 1) => {
        try {
            setLoading(true);
            const response = await repo.getConversations({ 
                page: newPage,
                limit: 10 });
           if (response?.message === 'Success') {
                if (newPage === 1) {
                    setConversations(response?.data as ConversationResponseModel[] || []);
                } else {
                    setConversations((prevConversations) => [...prevConversations, ...(response?.data as ConversationResponseModel[] || [])]);
                }
                const { page: currentPage, limit: currentLimit, total: totalRecords } = response?.paging;

                setTotal(totalRecords);
                setPageCv(currentPage);
                setHasMore(currentPage * currentLimit < totalRecords);
            }
        } catch (error: any) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const createConversation = async (data : CreateConversationModel) => {
        try {
            
            setLoading(true);
            const response = await repo.createConversation(data);  
            
            
            if (!response?.error) {
                Toast.show({
                    type: 'success',
                    text1: "Create Conversation Success",
                });
                setConversationId(response?.data?.id || '');
                return response?.data?.id;
            }else{
                if(response?.error?.message === 'Conversation has already exist') {
                     setConversationId(response?.error?.message_detail || ''); 
                     return response?.error?.message_detail;
                };         
            }
        } catch (error: any) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }


    const loadMoreConversations = () => {
        if (!loading && hasMore) {
            setPageCv((prevPage) => prevPage + 1);
            fetchConversations(pageCv + 1);
        }
    }

    const deleteConversation = async (id: string) => {
        try {
            setLoading(true);
            const response = await repo.deleteConversation(id);
console.log("res", response);

            if (!response?.error) {
                fetchConversations();
            }
        } catch (error: any) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const updateConversation = async (data: UpdateConversationModel) => {
        console.log("UpdateConversationModel", data);
        
        try {
            setLoading(true);
            const response = await repo.UpdateConversation(data.id, data);
            console.log("UpdateConversationResponse", response);
            
            if (!response?.error) {
                Toast.show({
                    type: 'success',
                    text1: "Update Conversation Success",
                });
                return response?.data;
            } else {
                Toast.show({
                    type: 'error',
                    text1: "Update Conversation Failed",
                    text2: response?.error?.message || "An error occurred",
                });
            }
        } catch (error: any) {
            console.error(error);
            Toast.show({
                type: 'error',
                text1: "Update Conversation Failed",
                text2: error?.message || "An error occurred",
            });
        }
         finally {
            setLoading(false);
        }
    }

    return {conversations, loading, createConversation, conversationId, fetchConversations, pageCv, hasMore, loadMoreConversations, deleteConversation, updateConversation};

}

export default useConversationViewModel;
