
export interface MessagesResponse {
    id?: string
    sender?: string
    avatar_url?: string
    lastOnline?: string
    contextChat?: string
    timestamp?: string
    reactions?: { [key: string]: number };
    replyTo?: MessagesResponse;
}
    