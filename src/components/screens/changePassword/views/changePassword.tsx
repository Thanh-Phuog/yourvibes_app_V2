import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
} from "react-native";
import { Button, Form} from '@ant-design/react-native';
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { useAuth } from "@/src/context/auth/useAuth";
import ChangPassword from "../viewModel/changePasswordViewModel";
import { defaultProfileRepo } from "@/src/api/features/profile/ProfileRepository";
import MyInput from "@/src/components/foundation/MyInput";
import useColor from "@/src/hooks/useColor";
import { ChangePasswordRequestModel } from "@/src/api/features/profile/model/ChangPasswordModel";
import Toast from "react-native-toast-message";


const ChangePasswordScreen = () => {
  const { language, localStrings } = useAuth();
  const {
    loading,
    changePassword,
  } = ChangPassword(defaultProfileRepo);
  const [seePasswordOld, setSeePasswordOld] = useState(false);
  const [seePasswordNew, setSeePasswordNew] = useState(false);
  const [seePasswordConfirm, setSeePasswordConfirm] = useState(false);
  const { brandPrimary } = useColor();
  const [changePasswordInForm] = Form.useForm();

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: "#fff",
      }}
    >
      {/* Header */}
      <View
        style={{
          marginTop: Platform.OS === "ios" ? 30 : 0,
          height: 50,
          paddingHorizontal: 16,
          paddingTop: 16,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "#fff",
          zIndex: 10,
          borderBottomColor: "black",
          borderBottomWidth: 1,
        }}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color="black" />
        </TouchableOpacity>
        <Text
          style={{
            textAlign: "center",
            fontSize: 18,
            fontWeight: "bold",
            flex: 1,
          }}
        >
          {localStrings.ChangePassword.ChangePassword}
        </Text>
      </View>

      {/* Form */}
      <Form
        layout="vertical"
        style={{
          width: "100%",
          backgroundColor: "none",
        }}
        form={changePasswordInForm}
      >
        <Form.Item
          name="oldPassword"
          rules={[
            {
              required: true,
              message:
                localStrings.Form.RequiredMessages.PasswordRequiredMessage,
            },
          ]}
        >
          <MyInput
            placeholder={localStrings.ChangePassword.OldPassword}
            type={seePasswordOld ? "text" : "password"}
            variant="outlined"
            suffix={
              <TouchableOpacity
                onPress={() => {
                  setSeePasswordOld(!seePasswordOld);
                }}
              >
                <Feather
                  name={seePasswordOld ? "eye" : "eye-off"}
                  size={20}
                  color={seePasswordOld ? brandPrimary : "gray"}
                />
              </TouchableOpacity>
            }
          />
        </Form.Item>
        <Form.Item
          name="newPassword"
          rules={[
            {
              required: true,
              message:
                localStrings.Form.RequiredMessages.ConfirmPasswordRequiredMessage,
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('oldPassword') !== value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error(localStrings.Form.TypeMessage.PleaseOldPasswordDifferentNewPassword));
              },
            }),
          ]}
        >
          <MyInput
            placeholder={localStrings.ChangePassword.NewPassword}
            type={seePasswordNew ? "text" : "password"}
            variant="outlined"
            
            suffix={
              <TouchableOpacity
                onPress={() => {
                  setSeePasswordNew(!seePasswordNew);
                }}
              >
                <Feather
                  name={seePasswordNew ? "eye" : "eye-off"}
                  size={20}
                  color={seePasswordNew ? brandPrimary : "gray"}
                />
              </TouchableOpacity>
            }
          />
        </Form.Item>
        {/* Conform Password */}
        <Form.Item
          name="confirmPassword"
          rules={[
            {
              required: true,
              message:
                localStrings.Form.RequiredMessages.ConfirmPasswordRequiredMessage,
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newPassword') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error(localStrings.Form.TypeMessage.ConfirmPasswordTypeMessage));
              },
            }),
          ]}
        >
          <MyInput
            placeholder={localStrings.ChangePassword.ConformPassword}
            type={seePasswordConfirm ? "text" : "password"}
            variant="outlined"
            suffix={
              <TouchableOpacity
                onPress={() => {
                  setSeePasswordConfirm(!seePasswordConfirm);
                }}
              >
                <Feather
                  name={seePasswordConfirm ? "eye" : "eye-off"}
                  size={20}
                  color={seePasswordConfirm ? brandPrimary : "gray"}
                />
              </TouchableOpacity>
            }
          />
        </Form.Item>

        {/* Submit Button */}
        <Form.Item>
          <Button type="primary" loading={loading} onPress={() => {
            changePasswordInForm
              .validateFields()
              .then(() => {
                const { oldPassword, newPassword } = changePasswordInForm.getFieldsValue();
                const data: ChangePasswordRequestModel = {
                  old_password: oldPassword,
                  new_password: newPassword,
                };
                changePassword(data);
                
              })
              .catch((error) => {
                console.log("error", error);
                  Toast.show({
                                type: "error",
                                text1: "Change Password Failed",
                                text2: error?.message,
                              });
              }
            );
          }}>
            {localStrings.ChangePassword.ConformChangePassword}
          </Button>
        </Form.Item>
      </Form>
      <Toast />
    </ScrollView>
  );
};

export default ChangePasswordScreen;
