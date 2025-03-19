export const ApiPath = {
  // Auth
  LOGIN: getApiPath("users/login"),
  REGISTER: getApiPath("users/register"),
  VERIFIED_EMAIL: getApiPath("users/verifyemail"),
  GOOGLE_LOGIN: getApiPath("users/app_auth_google"),

  // User
  PROFILE: getApiPath("users/"),
  SEARCH: getApiPath("users/"),
  CHANGE_PASSWORD: getApiPath("users/change_password"),

  //Friend
  FRIEND_REQUEST: getApiPath("users/friends/friend_request/"),
  FRIEND_RESPONSE: getApiPath("users/friends/friend_response/"),
  UNFRIEND: getApiPath("users/friends/"),
  LIST_FRIENDS: getApiPath("users/friends/"),

  // Post
  CREATE_POST: getApiPath("posts/"),
  UPDATE_POST: getApiPath("posts/"),
  GET_POSTS: getApiPath("posts/"),
  DELETE_POST: getApiPath("posts/"),
  // GET_USER_LIKES: getApiPath("posts/get_like_user/"),
  LIKE_POST: getApiPath("posts/like_post/"),
  SHARE_POST: getApiPath("posts/share_post/"),
  ADVERTISE_POST: getApiPath("advertise/"),


    //Report
    REPORT: getApiPath("report/"),

  //Comment
  CREATE_COMMENT: getApiPath("comments/"),
  UPDATE_COMMENT: getApiPath("comments/"),
  GET_COMMENTS: getApiPath("comments/"),
  DELETE_COMMENT: getApiPath("comments/"),
  GET_COMMENT_REPLIES: getApiPath("comments/"),

  //Like Comment
  GET_LIKE_COMMENT: getApiPath("comments/like_comment/"),
  POST_LIKE_COMMENT: getApiPath("comments/like_comment/"),

  // Notification
  GET_WS_PATH_NOTIFICATION: getWSPath("notification/ws/"),
  GET_NOTIFICATIONS: getApiPath("notification"),
  READ_NOTIFICATION: getApiPath("notification/"),
  READ_ALL_NOTIFICATION: getApiPath("notification/"),

  //New Feeds
  GET_NEW_FEEDS: getApiPath("posts/new_feeds/"),
  DELETE_NEW_FEED: getApiPath("posts/new_feeds/"),

  //Forgot Password
  GET_OTP_FORGOOT_PASSWORD: getApiPath("users/get_otp_forgot_user_password"),
  FORGOT_PASSWORD: getApiPath("users/forgot_user_password"),

  //Conversation
  GET_CONVERSATION: getApiPath("conversations/"),
  CREATE_CONVERSATION: getApiPath("conversations/"),
  DELETE_CONVERSATION: getApiPath("conversations/"),
  GET_CONVERSATION_BY_ID: getApiPath("conversations/"),

  //Message
  GET_WS_PATH_MESSAGE: getWSPath("messages/ws/"),
  GET_MESSAGES_BY_CONVERSATION_ID: getApiPath("messages/get_by_conversation_id/"),
  CREATE_MESSAGE: getApiPath("messages/"),
  GET_MESSAGE_BY_ID: getApiPath("messages/message/"),
  DELETE_MESSAGE: getApiPath("messages/message/"),


  //Conversation_Detail
  GET_CONVERSATION_DETAIL: getApiPath("conversation_details/get_by_id/"),
  CREATE_CONVERSATION_DETAIL: getApiPath("conversation_details/"),
  DELETE_CONVERSATION_DETAIL: getApiPath("conversation_details/"),

};

function getApiPath(path: string) {
  return `${process.env.EXPO_PUBLIC_SERVER_ENDPOINT!}/v1/2024/${path}`;
}
function getWSPath(path: string) {
  return `${process.env.EXPO_PUBLIC_SERVER_ENDPOINT!.replace("http", "ws")!}/v1/2024/${path}`;
}
