import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import useColor from '@/src/hooks/useColor';
import { Button, Modal } from '@ant-design/react-native';
import { useAuth } from '@/src/context/auth/useAuth';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { router } from 'expo-router';
import Toast from 'react-native-toast-message';

const SettingsTab = () => {
  const { brandPrimary } = useColor();
  const { onLogout, changeLanguage, localStrings } = useAuth();
  const { showActionSheetWithOptions } = useActionSheet();

  const handleLogout = () => {
    Modal.alert(
      localStrings.Public.Confirm,
      localStrings.Public.LogoutConfirm,
      [
        { text: localStrings.Public.Cancel, style: 'cancel' },
        { text: localStrings.Public.Confirm, onPress: onLogout },
      ]
    );
  };

  // Hiển thị tuỳ chọn ngôn ngữ
  const showLanguageOptions = () => {
    const options = [
      localStrings.Public.English,
      localStrings.Public.Vietnamese,
      localStrings.Public.Cancel,
    ];

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex: options.length - 1,
      },
      (buttonIndex) => {
        if (buttonIndex === 0 || buttonIndex === 1) {
          changeLanguage();
        }
      }
    );
  };

  return (
    <View style={{ padding: 20, flex: 1 }}>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <Button
          type="ghost"
          onPress={() => {
            router.push('/update-profile');
          }}
        >
          <Text style={{ color: brandPrimary, fontSize: 16 }}>
            {localStrings.Public.EditProfile}
          </Text>
        </Button>
        <Button
          type="ghost"
          onPress={() => {
            router.push('/changePassword');
          }}
          style={{ marginTop: 10 }}
        >
          <Text style={{ color: brandPrimary, fontSize: 16 }}>
            {localStrings.Public.ChangePassword}
          </Text>
        </Button>
        <Button
          type="ghost"
          onPress={showLanguageOptions}
          style={{ marginTop: 10 }}
        >
          <Text style={{ color: brandPrimary, fontSize: 16 }}>
            {localStrings.Public.Language}
          </Text>
        </Button>
        <Button
          type="ghost"
          onPress={handleLogout}
          style={{ marginTop: 10 }}
        >
          <Text style={{ color: brandPrimary, fontSize: 16 }}>
            {localStrings.Public.LogOut}
          </Text>
        </Button>
      </ScrollView>
      <Toast />
    </View>
  );
};

export default SettingsTab;
