import { View, Text, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import React from "react";
import { NotificationResponseModel } from "@/src/api/features/notification/models/NotifiCationModel";
import { Ionicons } from "@expo/vector-icons";
import { getTimeDiff } from "@/src/utils/helper/DateTransfer";
import { useAuth } from "@/src/context/auth/useAuth";
import { router } from "expo-router";
import useColor from "@/src/hooks/useColor";

const NotificationItem = ({
  notification,
  onUpdate,
}: {
  notification: NotificationResponseModel;
  onUpdate: () => void;
}) => {
  const {
    from,
    from_url,
    content,
    created_at,
    notification_type,
    status,
    content_id,
  } = notification;
  const { user, localStrings } = useAuth();
  const { backGround, backgroundColor, brandPrimary, brandPrimaryTap, theme } =
    useColor();

  const type = mapNotifiCationType(notification_type || "");

  function mapNotifiCationType(type: string) {
    switch (type) {
      case "like_post":
        return "like";
      case "new_share":
        return "share";
      case "new_comment":
        return "comment";
      case "friend_request":
        return "friend";
      case "accept_friend_request":
        return "friend";
      case "new_post":
        return "post";
      case "like_comment":
        return "like_comment";
      case "new_post_personal":
        return "post";
      case "block_create_post":
        return "post";
      case "deactivate_post":
        return "post";
      case "activace_post":
        return "post";
      case "deactivate_comment":
        return "comment";
      case "activace_comment":
        return "comment";
      default:
        return "notifications";
    }
  }

  const getIcons = () => {
    switch (type) {
      case "like":
        return "heart-circle";
      case "share":
        return "arrow-redo-circle";
      case "comment":
        return "chatbubble-ellipses";
      case "friend":
        return "person-circle";
      case "post":
        return "notifications";
      case "like_comment":
        return "heart-circle";
      default:
        return "notifications";
    }
  };

  const getColor = () => {
    switch (type) {
      case "like":
        return "#CC0033";
      case "share":
        return "#004073";
      case "comment":
        return "#008800";
      case "friend":
        return "#54473F";
      case "post":
        return "#000";
      case "like_comment":
        return "#CC0033";
      default:
        return "#000";
    }
  };

  const mapNotifiCationContent = (type: string) => {
    switch (type) {
      case "like_post":
        return `${localStrings.Notification.Items.LikePost}`;
      case "new_share":
        return `${localStrings.Notification.Items.SharePost}`;
      case "new_comment":
        return `${localStrings.Notification.Items.CommentPost}`;
      case "friend_request":
        return `${localStrings.Notification.Items.Friend}`;
      case "accept_friend_request":
        return `${localStrings.Notification.Items.AcceptFriend}`;
      case "new_post":
        return `${localStrings.Notification.Items.NewPost}`;
      case "like_comment":
        return `${localStrings.Notification.Items.LikeComment}`;
      case "new_post_personal":
        return `${localStrings.Notification.Items.NewPostPersonal}`;
      case "block_create_post":
        return `${localStrings.Notification.Items.BlockCreatePost}`;
      case "deactivate_post":
        return `${localStrings.Notification.Items.DeactivatePostContent}`;
      case "activace_post":
        return `${localStrings.Notification.Items.ActivacePostContent}`;
      case "deactivate_comment":
        return `${localStrings.Notification.Items.DeactivateCommentContent}`;
      case "activace_comment":
        return `${localStrings.Notification.Items.ActivaceCommentContent}`;
      default:
        return "notifications";
    }
  };

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
    if (content.includes("abuse")) {
      return localStrings.Notification.Items.abuse;
    }
    return content;
  };
  return (
    <TouchableOpacity
      onPress={() => {
        onUpdate();
        if (
          notification_type === "friend_request" ||
          notification_type === "accept_friend_request"
        ) {
          router.push(`/(tabs)/user/${content_id}`);
        }
        if (
          notification_type === "like_post" ||
          notification_type === "new_comment" ||
          notification_type === "new_share" ||
          notification_type === "new_post"
        ) {
          router.push(`/postDetails?postId=${content_id}`);
        }
      }}
      style={{ backgroundColor: status ? backgroundColor : backGround }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 5,
        }}
      >
        <View style={{ position: "relative" }}>
          {/* Avatar */}
          <Image
            source={{ uri: from_url }}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              marginRight: 10,
              backgroundColor: "#ccc",
            }}
          />
          {/* Icon hiển thị cho từng hành động */}
          <Ionicons
            name={getIcons()}
            size={20}
            color={getColor()}
            style={{
              position: "absolute",
              top: type === "friend" ? 22 : 25,
              right: 5,
              backgroundColor: theme === "dark" ? "#fff" : "transparent",
              borderRadius: 20,
            }}
          />
        </View>

        {/* Nội dung thông báo */}
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 14, color: brandPrimary }}>
            <Text style={{ fontWeight: "bold" }}>{from}</Text>{" "}
            {mapNotifiCationContent(notification_type || "")}
          </Text>
          {content ? (
            <Text
              numberOfLines={2}
              ellipsizeMode="tail"
              style={{ fontSize: 14, color: brandPrimaryTap }}
            >
              {getDescription(content)}
            </Text>
          ) : null}
          <Text style={{ fontSize: 12, color: "#888", marginTop: 4 }}>
            {getTimeDiff(created_at, localStrings)}
          </Text>
        </View>
      </View>
      <View style={{ borderBottomWidth: 1, borderColor: "#fff" }} />
    </TouchableOpacity>
  );
};

export default NotificationItem;
