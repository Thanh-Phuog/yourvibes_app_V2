export interface CreateConversationDetail {
    conversation_id ?: string
    user_id ?: string
}

export interface DeleteConversationDetail {
    user_id ?: string
    conversation_id ?: string
}

export interface GetConversationDetailById {
    user_id ?: string
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
}