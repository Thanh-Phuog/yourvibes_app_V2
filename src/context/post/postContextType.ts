import { Privacy } from "@/src/api/baseApiResponseModel/baseApiResponseModel";
import { ImagePickerAsset } from "expo-image-picker";

export interface PostContextType {
  savedPostContent?: string;
  setSavedPostContent?: (postContent: string | undefined) => void;
  savedPrivacy?: Privacy;
  setSavedPrivacy?: (privacy: Privacy | undefined) => void;
  savedSelectedImageFiles?: ImagePickerAsset[];
  setSavedSelectedImageFiles?: (selectedImageFiles: ImagePickerAsset[] | undefined) => void;
  clearSavedPost?: () => void
}