import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { SocketContextType } from "./socketContextType";
import { ApiPath } from "@/src/api/ApiPath";
import { useAuth } from "../auth/useAuth";
import useTypeNotification from "@/src/hooks/useTypeNotification";
import Toast from "react-native-toast-message";
import { MessageResponseModel, MessageWebSocketResponseModel } from "@/src/api/features/messages/models/Messages";

const WebSocketContext = createContext<SocketContextType | undefined>(undefined);

export const WebSocketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const {user, localStrings} = useAuth();
    const [socketMessages, setSocketMessages] = useState<MessageWebSocketResponseModel[]>([]);
  
    
    const {LIKE_POST, NEW_SHARE, NEW_COMMENT, FRIEND_REQUEST, ACCEPT_FRIEND_REQUEST, NEW_POST, LIKE_COMMENT} = useTypeNotification();
    const mapNotifiCationContent = (type: string) => {
        switch (type) {
            case LIKE_POST:
                return localStrings.Notification.Items.LikePost;
            case NEW_SHARE:
                return localStrings.Notification.Items.SharePost;
            case NEW_COMMENT:
                return localStrings.Notification.Items.CommentPost;
            case FRIEND_REQUEST:
                return localStrings.Notification.Items.Friend;
            case ACCEPT_FRIEND_REQUEST:
                return localStrings.Notification.Items.AcceptFriend;
            case NEW_POST:
                return localStrings.Notification.Items.NewPost;
            case LIKE_COMMENT:
                return localStrings.Notification.Items.LikeComment;
            default:
                return 'notifications';
        }
    }
    const connetSocketMessage = () => {
        if (!user?.id) return; // Chỉ kết nối khi có user.id

        const ws = new WebSocket(`${ApiPath.GET_WS_PATH_MESSAGE}${user?.id}`);
        ws.onopen = () => {
            console.log('Web Socket connected');
        };
        ws.onmessage = (e) => {
            const message = JSON.parse(e.data);
            console.log("Nhận tin nhắn:", message);
            setSocketMessages((prev) => [...prev, message]); // Cập nhật danh sách tin nhắn

            if (message.user.id !== user?.id) {
                Toast.show({
                    type: "info",
                    text1: `${message.user.name} đã gửi tin nhắn`,
                    text2: message.content,
                });
            }
            
        };

        ws.onclose = (e) => {
            console.log('WebSocket disconnected:', e.reason);
        };

        ws.onerror = (error) => {
            console.log('WebSocket error:', error);
            Toast.show({
                type: 'error',
                text1: localStrings.webSocker.WebSocketError,
                text2: localStrings.webSocker.WebSocketErrorText,
            });
        };

        return () => {
            ws.close();
        };
    }
    const connetSocketNotification = () => {
        if (!user?.id) return; // Chỉ kết nối khi có user.id

        const ws = new WebSocket(`${ApiPath.GET_WS_PATH_NOTIFICATION}${user?.id}`);
        ws.onopen = () => {
            console.log('Web Socket connected');
        };
        ws.onmessage = (e) => {
            const notification = JSON.parse(e.data);
            const userName = notification?.from;
            const content = notification?.content;
            const type = notification?.notification_type;
            const status = notification?.status;
            const mapType = mapNotifiCationContent(type);
            Toast.show({
                type: 'info',
                text1: `${userName} ${mapType}`,
                text2: `${content}`,
            });
        } 

        ws.onclose = (e) => {
      console.log('WebSocket disconnected:', e.reason);
    };

    ws.onerror = (error) => {
      console.log('WebSocket error:', error);
      Toast.show({
        type: 'error',
        text1: localStrings.webSocker.WebSocketError,
        text2: localStrings.webSocker.WebSocketErrorText,
      });

    };

    return () => {
      ws.close();
    };
  };

  useEffect(() => {
    if (user?.id)
    connetSocketNotification();
    connetSocketMessage();
  }
    , [user?.id]);
	return (
		<WebSocketContext.Provider value={
            {
                socketMessages,
                setSocketMessages,
                connetSocketMessage,
                connetSocketNotification
            }
        }>
			{children}
		</WebSocketContext.Provider>
	);
}

export const useWebSocket = (): SocketContextType => {
    const context = useContext(WebSocketContext);
    if (context === undefined) {
        throw new Error('useWebSocket must be used within a WebSocketProvider');
    }
    return context;
}