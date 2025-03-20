import { MessagesRepo } from "@/src/api/features/messages/MessagesRepo";
import { ConversationResponseModel, CreateConversationModel } from "@/src/api/features/messages/models/Conversation";
import { useState } from "react";
import Toast from "react-native-toast-message";

const useConversationViewModel = (repo : MessagesRepo) => {
    const [conversations, setConversations] = useState<ConversationResponseModel>();
    const [loading, setLoading] = useState(false);
    
    const fetchConversationsById = async (id: string) => {
        try {
            setLoading(true);
            const response = await repo.getConversationById(id);
            if (!response?.error) {
                setConversations(response?.data);


            }else{
                Toast.show({
                    type: 'error',
                    text1: "Get Conversation Failed",
                    text2: response?.error?.message,
                });
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
                return response?.data;
            }else{
                Toast.show({
                    type: 'error',
                    text1: "Create Conversation Failed",
                    text2: response?.error?.message,
                });
            }
        } catch (error: any) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    return {conversations, loading, fetchConversationsById, createConversation};

}

export default useConversationViewModel;
