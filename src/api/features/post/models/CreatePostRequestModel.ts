import { Privacy } from "@/src/api/baseApiResponseModel/baseApiResponseModel"

export interface CreatePostRequestModel {
    content?: string
    privacy?: Privacy
    location?: string
    media?: {
        uri?: string,
        name?: string,
        type?: string
    }[]
}