import { AuthenRepo } from "@/src/api/features/authenticate/AuthenRepo"
import { LoginRequestModel } from "@/src/api/features/authenticate/model/LoginModel"
import { useEffect, useState } from "react";
import Toast from "react-native-toast-message";
import { useAuth } from "@/src/context/auth/useAuth";
import * as Linking from 'expo-linking';
import * as Google from 'expo-auth-session/providers/google';
import { Platform } from "react-native";

const LoginViewModel = (repo: AuthenRepo, onLogin: (user: any) => void) => {
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { localStrings } = useAuth();
  const [request, response, promtAsync] = Google.useAuthRequest({
    webClientId: process.env.EXPO_PUBLIC_WEB_CLIENT_ID!,
    androidClientId: process.env.EXPO_PUBLIC_ANDROID_CLIENT_ID!,
    iosClientId: process.env.EXPO_PUBLIC_IOS_CLIENT_ID!,
    redirectUri: `${Linking.createURL("/login")}`,
  })

  const login = async (data: LoginRequestModel) => {
    try {
      setLoading(true);
      const res = await repo.login(data);
      if (res?.data) {
        onLogin(res?.data);
      } else {
        Toast.show({
          type: 'error',
          text1: localStrings.Login.LoginFailed,
          text2: res?.error?.message
        })
      }
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: localStrings.Login.LoginFailed,
        text2: error?.message
      })
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      if (response?.type === "success") {
        setGoogleLoading(true);
        console.log("param",response?.params);
        const res = await repo.googleLogin({
          open_id: response?.params?.id_token,
          platform: Platform.OS === 'ios' ? 'ios' : 'android',
          redirect_url: `${Linking.createURL("/login")}`,
        });
        if (res?.data) {
          onLogin(res?.data);
        } else {
          Toast.show({
            type: 'error',
            text1: localStrings.Login.LoginFailed,
            text2: res?.error?.message
          })
        }
      }
    } catch (error: any) {
      console.error(error);
      Toast.show({
        type: 'error',
        text1: localStrings.Login.LoginFailed,
      })
    } finally {
      setGoogleLoading(false);
    }
  };

  useEffect(() => {
    if (response)
      handleGoogleLogin();
  }, [response]);

  return {
    login,
    googleLoading,
    setGoogleLoading,
    loading,
    promtAsync,
  }
}

export default LoginViewModel