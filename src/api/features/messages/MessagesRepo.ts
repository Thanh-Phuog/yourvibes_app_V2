import { TransferToFormData } from "@/src/utils/helper/TransferToFormData";
import { ApiPath } from "../../ApiPath";
import { BaseApiResponseModel } from "../../baseApiResponseModel/baseApiResponseModel";
import client from "../../client";
import { ConversationResponseModel, CreateConversationModel, GetConversationModel } from "./models/Conversation";
import { ConversationDetailResponseModel, CreateConversationDetail, ConversationDetailRequestModel, GetConversationDetailById } from "./models/ConversationDetail";
import { CreateMessageModel, GetMessagesByConversationIdModel, MessageResponseModel } from "./models/Messages";

interface IMessagesRepo {
    //Messages
    createMessage(data: CreateMessageModel): Promise<BaseApiResponseModel<any>>;
    getMessagesByConversationId(data: GetMessagesByConversationIdModel): Promise<BaseApiResponseModel<MessageResponseModel[]>>
    getMessageById(id: string): Promise<BaseApiResponseModel<MessageResponseModel>>;
    deleteMessage(id: string): Promise<BaseApiResponseModel<any>>;

    //Conversations
    createConversation(data: CreateConversationModel): Promise<BaseApiResponseModel<ConversationResponseModel>>;
    // getConversationById(id: string): Promise<BaseApiResponseModel<ConversationResponseModel>>;
    getConversations(data: GetConversationModel): Promise<BaseApiResponseModel<ConversationResponseModel[]>>;
    deleteConversation(id: string): Promise<BaseApiResponseModel<any>>;

    //Conversation details
    getConversationDetails(data: GetConversationDetailById): Promise<BaseApiResponseModel<ConversationDetailResponseModel[]>>;
    createConversationDetail(data: CreateConversationDetail): Promise<BaseApiResponseModel<ConversationDetailResponseModel>>;
    DeleteConversationDetail(data: ConversationDetailRequestModel): Promise<BaseApiResponseModel<any>>;  
    UpdateConversationDetail(data: ConversationDetailRequestModel): Promise<BaseApiResponseModel<any>>;  
}

export class MessagesRepo implements IMessagesRepo {
    async createMessage(data: CreateMessageModel): Promise<BaseApiResponseModel<MessageResponseModel>> {
        return await client.post(ApiPath.CREATE_MESSAGE, data, { headers: { "Content-Type": "application/json" } });
    }

    async getMessagesByConversationId(data: GetMessagesByConversationIdModel): Promise<BaseApiResponseModel<MessageResponseModel[]>> {
    //   const queryParams = new URLSearchParams({
    //       conversation_id: data.conversation_id,
    //       page: data.page.toString(),
    //       limit: data.limit.toString(),
    //     }).toString();

        return client.get(ApiPath.GET_MESSAGES_BY_CONVERSATION_ID, data );
    }

    async getMessageById(id: string): Promise<BaseApiResponseModel<MessageResponseModel>>
    {
        return client.get(ApiPath.GET_MESSAGE_BY_ID + id);
    }


    async deleteMessage(id: string): Promise<BaseApiResponseModel<any>> {
        return client.delete(ApiPath.DELETE_MESSAGE + id);
    }

    //Conversations
    async createConversation(data: CreateConversationModel): Promise<BaseApiResponseModel<ConversationResponseModel>> {
        const tranferedData = TransferToFormData(data);
        console.log([...tranferedData.entries()]);

        return client.post(ApiPath.CREATE_CONVERSATION, tranferedData, { headers: { "Content-Type": "multipart/form-data" } });
    }

    // async getConversationById(id: string): Promise<BaseApiResponseModel<ConversationResponseModel>> {
    //     return client.get(ApiPath.GET_CONVERSATION_BY_ID + id);
    // }

    async getConversations(data: GetConversationModel): Promise<BaseApiResponseModel<ConversationResponseModel[]>> {
        const queryParams = new URLSearchParams({
            page: data.page.toString(),
            limit: data.limit.toString(),
        }).toString();

        return client.get(`${ApiPath.GET_CONVERSATION}?${queryParams}`);
    }

    async deleteConversation(id: string): Promise<BaseApiResponseModel<any>> {
        return client.delete(ApiPath.DELETE_CONVERSATION + id);
    }

    //Conversation details  
    async getConversationDetails(data: GetConversationDetailById): Promise<BaseApiResponseModel<ConversationDetailResponseModel[]>> {
        const queryParams = new URLSearchParams({
            conversation_id: data.conversation_id || "",
            page: data.page.toString(),
            limit: data.limit.toString(),

        }).toString();

        return client.get(`${ApiPath.GET_CONVERSATION_DETAIL}?${queryParams}`);
    }

    async createConversationDetail(data: CreateConversationDetail): Promise<BaseApiResponseModel<ConversationDetailResponseModel>> {
        return await client.post(ApiPath.CREATE_MANY_CONVERSATION_DETAIL, data, { headers: { "Content-Type": "application/json" } });
    }

    async DeleteConversationDetail(data: ConversationDetailRequestModel): Promise<BaseApiResponseModel<any>> {
        return client.delete(ApiPath.DELETE_CONVERSATION_DETAIL + data.user_id + "/" + data.conversation_id);
    }

    async UpdateConversationDetail(data: ConversationDetailRequestModel): Promise<BaseApiResponseModel<any>> {
        return client.patch(ApiPath.UPDATE_CONVERSATION_DETAIL, data);
    }
}                           

export const defaultMessagesRepo = new MessagesRepo();