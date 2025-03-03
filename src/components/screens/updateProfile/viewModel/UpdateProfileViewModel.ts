import { UpdateProfileRequestModel } from '@/src/api/features/profile/model/UpdateProfileModel';
import { ProfileRepo } from '@/src/api/features/profile/ProfileRepository'
import { useAuth } from '@/src/context/auth/useAuth';
import { router } from 'expo-router';
import { useState } from 'react'
import Toast from 'react-native-toast-message'

const UpdateProfileViewModel = (repo: ProfileRepo) => {
  const [loading, setLoading] = useState(false);
  const { localStrings, onUpdateProfile } = useAuth();

  const updateProfile = async (data: UpdateProfileRequestModel) => {
    try {
      setLoading(true)
      const res = await repo.updateProfile(data);
      if (!res?.error) {
        Toast.show({
          type: 'success',
          text1: localStrings.UpdateProfile.UpdateSuccess,
        })
        onUpdateProfile(res?.data)
        router.back();
      } else {
        Toast.show({
          type: 'error',
          text1: localStrings.UpdateProfile.UpdateFailed,
          text2: res?.error?.detail_err
        })
      }
    } catch (error: any) {
      console.error(error)
      Toast.show({
        type: 'error',
        text1: localStrings.UpdateProfile.UpdateFailed,
        text2: error?.error?.message
      })
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    updateProfile
  }
}

export default UpdateProfileViewModel