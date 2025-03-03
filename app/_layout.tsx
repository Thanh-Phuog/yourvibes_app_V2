import { Provider } from "@ant-design/react-native";
import { Stack } from "expo-router";
import { Platform, StatusBar, View } from "react-native";
import useColor from "@/src/hooks/useColor";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AuthProvider } from "@/src/context/auth/useAuth";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import { PostProvider } from "@/src/context/post/usePostContext";

export default function RootLayout() {
  const screens = ["index", "login", "signUp", "forgotPassword", "(tabs)"];

  const { brandPrimary, brandPrimaryTap, backgroundColor } = useColor();

  return (
    <AuthProvider>
      <PostProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <ActionSheetProvider>
            <View
              style={{
                flex: 1,
                backgroundColor: backgroundColor,
              }}
            >
              <Provider
                theme={{
                  primary_button_fill: brandPrimary,
                  primary_button_fill_tap: brandPrimaryTap,
                  ghost_button_color: brandPrimary,
                  ghost_button_fill_tap: brandPrimaryTap,
                  brand_primary: brandPrimary,
                  prefix_padding: 0,
                }}
              >
                <StatusBar
                  backgroundColor={"transparent"}
                  barStyle={"dark-content"}
                />
                <Stack screenOptions={{ headerShown: false }}>
                  {screens?.map((screen, index) => (
                    <Stack.Screen key={index} name={screen} />
                  ))}
                </Stack>
              </Provider>
            </View>
          </ActionSheetProvider>
        </GestureHandlerRootView>
      </PostProvider>
    </AuthProvider>
  );
}
