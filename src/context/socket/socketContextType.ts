import { MessageResponseModel, MessageWebSocketResponseModel } from "@/src/api/features/messages/models/Messages";

export interface SocketContextType {
    connetSocketMessage: ()=> void;
    // sendSocketMessage: (message: string) => void;
    connetSocketNotification: () => void;
    socketMessages: MessageWebSocketResponseModel[];
    setSocketMessages: (messages: MessageWebSocketResponseModel[]) => void;
  
}