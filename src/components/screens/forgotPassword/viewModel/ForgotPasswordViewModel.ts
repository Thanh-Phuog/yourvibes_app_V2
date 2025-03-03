import { VerifyOTPRequestModel } from "@/src/api/features/authenticate/model/VerifyOTPModel";
import { IForgotPasswordRepo } from "@/src/api/features/forgotPassword/ForgotPasswordRepo";
import { ForgotPasswordRequestModel } from "@/src/api/features/forgotPassword/models/ForgotPassword";
import { useAuth } from "@/src/context/auth/useAuth";
import { router } from "expo-router";
import { useState } from "react";
import Toast from "react-native-toast-message";

const forgotPasswordViewModel = (repo: IForgotPasswordRepo) => {
  const [otpLoading, setOtpLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const { localStrings } = useAuth();

  const verifyOTP = async (data: VerifyOTPRequestModel) => {
    if (!data?.email) {
      Toast.show({
        type: "error",
        text1: localStrings.Form.RequiredMessages.EmailRequiredMessage,
      });
      return;
    }
    try {
      setOtpLoading(true);
      const response = await repo.verifyOTP(data);
      if (!response?.error) {
        Toast.show({
          type: "success",
          text1: localStrings.SignUp.OTPSuccess,
        });
      } else {
        if (response?.error?.code === 60009) {
          Toast.show({
            type: "error",
            text1: localStrings.SignUp.OTPAlreadySent,
            text2: response?.error?.message,
          });
        } else {
          Toast.show({
            type: "error",
            text1: localStrings.SignUp.OTPFailed,
            text2: response?.error?.message,
          });
        }
      }
    } catch (error) {
      console.error(error);
      Toast.show({
        type: "error",
        text1: localStrings.SignUp.OTPFailed,
      });
    } finally {
      setOtpLoading(false);
    }
  };

  const resetPassword = async (data: ForgotPasswordRequestModel) => {
    try {
      setLoading(true);
      const response = await repo.resetPassword(data);
      if (!response?.error) {
        Toast.show({
          type: "success",
          text1: localStrings.ForgotPassword.ConformChangePasswordSuccess,
        });
        router.replace("/login");
      } else {
        Toast.show({
          type: "error",
          text1: localStrings.ForgotPassword.ConformChangePasswordFailed,
          text2: response?.error?.message,
        });
      }
    } catch (error: any) {
      console.error(error);
      Toast.show({
        type: "error",
        text1: localStrings.ForgotPassword.ConformChangePasswordFailed,
        text2: error?.error?.message,
      })
    } finally {
      setLoading(false);
    }
  }

  return {
    loading,
    verifyOTP,
    otpLoading,
    resetPassword
  }
}

export default forgotPasswordViewModel