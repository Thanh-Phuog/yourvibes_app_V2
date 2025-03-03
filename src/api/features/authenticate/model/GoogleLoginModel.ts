export interface GoogleLoginRequestModel {
  open_id?: string,
  platform?: "web" | "android" | "ios"
  redirect_url?: string
}