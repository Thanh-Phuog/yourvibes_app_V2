import { MessageWebSOcketResponseModel } from "@/src/api/features/messages/models/Messages";

export interface SocketContextType {
    connetSoccketMessage: ()=> void;
    // sendSocketMessage: (message: string) => void;
    connetSocketNotification: () => void;
    // message: MessageWebSOcketResponseModel | null;
    messages: MessageWebSOcketResponseModel[];
}