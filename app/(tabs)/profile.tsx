import React from 'react';
import ProfileFeatures from '@/src/components/screens/profile/view/ProfileFeature';
import { useLocalSearchParams } from 'expo-router';
import Toast from 'react-native-toast-message';

const Profile = () => {
  const { tabNum } = useLocalSearchParams();

  const getTabNum = () => {
    if (!tabNum) {
      return 0;
    }
    if (Array.isArray(tabNum)) {
      return Number(tabNum[0]);
    } else {
      return Number(tabNum);
    }
  }

  return (
    <>
      <ProfileFeatures tab={getTabNum()} />
      <Toast />
    </>
  );
};

export default Profile;
