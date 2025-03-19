export interface CreateConversationModel {
    name ?: string
    // image ?: {
    //     uri ?: string
    //     name ?: string
    //     type ?: string
    // }
}

// export interface DeleteConversationModel {
//     id ?: string
// }

// export interface GetConversationByIdModel {
//     id ?: string
// }

export interface GetConversationModel {
    limit : number
    page : number
}

export interface ConversationResponseModel {
    id?: string;
    name?: string;
    image?: string;
}