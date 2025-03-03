import { Privacy } from "@/src/api/baseApiResponseModel/baseApiResponseModel"

export interface SharePostRequestModel {
  content?: string
  privacy?: Privacy
  location?: string
}