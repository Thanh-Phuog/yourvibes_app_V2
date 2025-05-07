import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { SocketContextType } from "./socketContextType";
import { ApiPath } from "@/src/api/ApiPath";
import { useAuth } from "../auth/useAuth";
import useTypeNotification from "@/src/hooks/useTypeNotification";
import Toast from "react-native-toast-message";
import { MessageWebSocketResponseModel } from "@/src/api/features/messages/models/Messages";
import { usePathname } from "expo-router";

interface MessageHandlingStrategy {
  handleMessage: (message: MessageWebSocketResponseModel) => void;
}

class ChatPageStrategy implements MessageHandlingStrategy {
  protected setSocketMessages: React.Dispatch<
    React.SetStateAction<MessageWebSocketResponseModel[]>
  >;

  constructor(
    setSocketMessages: React.Dispatch<
      React.SetStateAction<MessageWebSocketResponseModel[]>
    >,
  ) {
    this.setSocketMessages = setSocketMessages;
  }
  handleMessage(message: MessageWebSocketResponseModel): void {
    this.setSocketMessages((prev) => [message, ...prev]);
  }
}

class OtherPageStrategy implements MessageHandlingStrategy {
  private localStrings: any;
  constructor(localStrings: any) {
    this.localStrings = localStrings;
  }

  handleMessage(message: MessageWebSocketResponseModel): void {
    Toast.show({
      type: "info",
      text1: this.localStrings.Notification.Items.NewMessage,
      text2: message.content,
    });
  }
}


const WebSocketContext = createContext<SocketContextType | undefined>(
  undefined
);

export const WebSocketProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { user, localStrings } = useAuth();
  const pathname = usePathname(); 
  const pathnameRef = useRef(pathname); 
  const [socketMessages, setSocketMessages] = useState<
    MessageWebSocketResponseModel[]
  >([]);

  // Sử dụng useRef để lưu trữ WebSocket
  const wsMessageRef = useRef<WebSocket | null>(null);
  const wsNotificationRef = useRef<WebSocket | null>(null);
  const [newMessageTrigger, setNewMessageTrigger] = useState<number>(0);
  const MaxConnection = 3; // Số lần kết nối tối đa
  const [connectionAttempts, setConnectionAttempts] = useState(0); // Biến đếm số lần kết nối
  const [connectionAttemptsNotification, setConnectionAttemptsNotification] =
    useState(0); // Biến đếm số lần kết nối

  const {
    LIKE_POST,
    NEW_SHARE,
    NEW_COMMENT,
    FRIEND_REQUEST,
    ACCEPT_FRIEND_REQUEST,
    NEW_POST,
    LIKE_COMMENT,
    NEW_POST_PERSONAL,
    BLOCK_CREATE_POST,
    DEACTIVATE_POST,
    ACTIVACE_POST,
    DEACTIVATE_COMMENT,
    ACTIVACE_COMMENT,
  } = useTypeNotification();

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
      case NEW_POST_PERSONAL:
        return localStrings.Notification.Items.NewPostPersonal;
      case BLOCK_CREATE_POST:
        return localStrings.Notification.Items.BlockCreatePost;
      case DEACTIVATE_POST:
        return localStrings.Notification.Items.DeactivatePostContent;
      case ACTIVACE_POST:
        return localStrings.Notification.Items.ActivacePostContent;
      case DEACTIVATE_COMMENT:
        return localStrings.Notification.Items.DeactivateCommentContent;
      case ACTIVACE_COMMENT:
        return localStrings.Notification.Items.ActivaceCommentContent;

      default:
        return localStrings.Notification.Notification;
    }
  };

  // 👉 Hàm kết nối WebSocket Message
  const connectSocketMessage = () => {
    if (!user?.id || wsMessageRef.current) return; // Tránh kết nối lại khi đã có kết nối

    const ws = new WebSocket(`${ApiPath.GET_WS_PATH_MESSAGE}${user.id}`);
    wsMessageRef.current = ws;

    ws.onopen = () => console.log("🔗 WebSocket Message connected");

    ws.onmessage = (e) => {
      const message = JSON.parse(e.data);
      const currentPath = pathnameRef.current;
    console.log("currentPath", currentPath);
    
      const strategy: MessageHandlingStrategy =
        currentPath === "/chat" || currentPath.startsWith("/chat/")
          ? new ChatPageStrategy(setSocketMessages)
          : new OtherPageStrategy(localStrings);
    
      strategy.handleMessage(message);
      setNewMessageTrigger((prev) => prev + 1);
    };

    ws.onclose = (e) => {
      console.log("❌ WebSocket Message disconnected:", e.reason);
      wsMessageRef.current = null;
      setConnectionAttempts((prevAttempts) => {
        const newAttempts = prevAttempts + 1;
        if (newAttempts < MaxConnection) {
          setTimeout(() => connectSocketMessage(), 5000); // Thử lại sau 5 giây
        }
        return newAttempts;
      });
    };

    ws.onerror = (error) => {
      console.error("⚠️ WebSocket Message error:", error);
      Toast.show({
        type: "error",
        text1: "Lỗi WebSocket",
        text2: "Không thể kết nối WebSocket.",
      });
    };
  };

  // 👉 Hàm kết nối WebSocket Notification
  const connectSocketNotification = () => {
    if (!user?.id || wsNotificationRef.current) return;

    const ws = new WebSocket(`${ApiPath.GET_WS_PATH_NOTIFICATION}${user.id}`);
    wsNotificationRef.current = ws;

    ws.onopen = () => console.log("🔗 WebSocket Notification connected");

    ws.onmessage = (e) => {
      const notification = JSON.parse(e.data);
      const userName = notification?.from;
      const content = notification?.content;
      const type = notification?.notification_type;
      const mapType = mapNotifiCationContent(type);
      const getDescription = (content: string) => {
        if (content.includes("violence")) {
          return localStrings.Notification.Items.violence;
        }
        if (content.includes("nsfw")) {
          return localStrings.Notification.Items.nsfw;
        }
        if (content.includes("political")) {
          return localStrings.Notification.Items.political;
        }
        return content;
      };
      Toast.show({
        type: "info",
        text1: `${userName} ${mapType}`,
        text2: getDescription(content),
      });
    };

    ws.onclose = (e) => {
      console.log("❌ WebSocket Notification disconnected:", e.reason);
      wsNotificationRef.current = null;
      setConnectionAttemptsNotification((prevAttempts) => {
        const newAttempts = prevAttempts + 1;
        console.log("connectionAttemptsNotification", newAttempts);
        console.log("MaxConnection", MaxConnection);

        // Kiểm tra điều kiện và cố gắng kết nối lại nếu chưa đạt MaxConnection
        if (newAttempts < MaxConnection) {
          setTimeout(() => connectSocketNotification(), 5000); // Thử lại sau 5 giây
        }
        return newAttempts;
      });
    };

    ws.onerror = (error) => {
      console.error("⚠️ WebSocket Notification error:", error);
      Toast.show({
        type: "error",
        text1: "Lỗi WebSocket",
        text2: "Không thể kết nối WebSocket.",
      });
    };
  };

  // 👉 Xử lý cleanup khi user thay đổi hoặc component unmount
  useEffect(() => {
    if (user?.id) {
      connectSocketNotification();
      connectSocketMessage();
    }

    return () => {
      if (wsMessageRef.current) {
        wsMessageRef.current.close();
        wsMessageRef.current = null;
      }
      if (wsNotificationRef.current) {
        wsNotificationRef.current.close();
        wsNotificationRef.current = null;
      }
    };
  }, [user?.id]); // Kết nối lại khi user thay đổi hoặc pathname thay đổi

  useEffect(() => {
    pathnameRef.current = pathname; // Cập nhật pathnameRef khi pathname thay đổi
  }
  , [pathname]); // Cập nhật pathnameRef khi pathname thay đổi
  return (
    <WebSocketContext.Provider
      value={{
        socketMessages,
        setSocketMessages,
        connectSocketMessage,
        connectSocketNotification,
        newMessageTrigger,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

// Hook dùng WebSocket
export const useWebSocket = (): SocketContextType => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useWebSocket must be used within a WebSocketProvider");
  }
  return context;
};
