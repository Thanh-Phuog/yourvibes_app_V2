import React from "react";
import { View, Text, ScrollView } from "react-native";
import useColor from "@/src/hooks/useColor";
import { Button, List, Modal, Provider, Switch } from "@ant-design/react-native";
import { useAuth } from "@/src/context/auth/useAuth";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { router } from "expo-router";
import Toast from "react-native-toast-message";

const SettingsTab = () => {
  const { brandPrimary, backgroundColor } = useColor();
  const { onLogout, changeLanguage, localStrings, changeTheme, theme } =
    useAuth();
  const { showActionSheetWithOptions } = useActionSheet();

  const handleLogout = () => {
    Modal.alert(
      localStrings.Public.Confirm,
      localStrings.Public.LogoutConfirm,
      [
        { text: localStrings.Public.Cancel, style: "cancel" },
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
      <List.Item
          extra={
            <Switch
              checked={theme === "dark"}
              onChange={(checked) => {if (changeTheme) {
                  changeTheme(checked ? "dark" : "light");
                }}
              }
            />
          }
          style={{    backgroundColor: backgroundColor,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: brandPrimary,}}
        >
          <Text style={{ color: brandPrimary, fontSize: 16 }}>
            {localStrings.Public.Theme}(
            {theme === "dark"
              ? localStrings?.Public.DarkMode
              : localStrings?.Public.LightMode}
            )
          </Text>
        </List.Item>
        <Button
          type="ghost"
          onPress={() => {
            router.push("/update-profile");
          }}
          style={{ marginTop: 10, backgroundColor: backgroundColor, borderColor: brandPrimary }}
        >
          <Text style={{ color: brandPrimary, fontSize: 16 }}>
            {localStrings.Public.EditProfile}
          </Text>
        </Button>
        <Button
          type="ghost"
          onPress={() => {
            router.push("/changePassword");
          }}
          style={{ marginTop: 10, backgroundColor: backgroundColor, borderColor: brandPrimary }}
        >
          <Text style={{ color: brandPrimary, fontSize: 16 }}>
            {localStrings.Public.ChangePassword}
          </Text>
        </Button>
        <Button
          type="ghost"
          onPress={showLanguageOptions}
          style={{ marginTop: 10, backgroundColor: backgroundColor, borderColor: brandPrimary }}
        >
          <Text style={{ color: brandPrimary, fontSize: 16 }}>
            {localStrings.Public.Language}
          </Text>
        </Button>
  
        <Button type="ghost" onPress={handleLogout} style={{ marginTop: 10, backgroundColor: backgroundColor, borderColor: brandPrimary }}>
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
