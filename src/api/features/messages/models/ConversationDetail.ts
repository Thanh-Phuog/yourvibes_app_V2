export interface CreateConversationDetail {
    conversation_id ?: string
    user_ids ?: string | string[]
}

export interface ConversationDetailRequestModel {
    user_id ?: string
    conversation_id ?: string
}

export interface GetConversationDetailById {
    conversation_id ?: string
    limit : number
    page : number
}

export interface ConversationDetailResponseModel {
    conversation:{
        id?: string;
        name?: string;
        image?: string;
    }
    user: {
        id?: string;
        avatar_url?: string;
        family_name?: string;
        name?: string;
    };
    last_message?: string;
    last_message_status?: boolean;
}