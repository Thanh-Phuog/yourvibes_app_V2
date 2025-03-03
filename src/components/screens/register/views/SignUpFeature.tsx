import {
  View,
  Text,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Platform,
  Keyboard,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import {
  Button,
  WingBlank,
  WhiteSpace,
  Form,
  Checkbox,
} from "@ant-design/react-native";
import MyInput from "@/src/components/foundation/MyInput";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import useColor from "@/src/hooks/useColor";
import dayjs from "dayjs";
import Toast from "react-native-toast-message";
import { defaultAuthenRepo } from "@/src/api/features/authenticate/AuthenRepo";
import SignUpViewModel from "../viewModel/signUpViewModel";
import MyDateTimePicker from "@/src/components/foundation/MyDateTimePicker";
import { useAuth } from "@/src/context/auth/useAuth";

var customParseFormat = require("dayjs/plugin/customParseFormat");
dayjs.extend(customParseFormat)

const SignUpFeature = () => {
  const router = useRouter();
  const [seePassword, setSeePassword] = useState(false);
  const [seeConfirmPassword, setSeeConfirmPassword] = useState(false);
  const { backgroundColor, brandPrimaryTap } = useColor();
  const [signUpForm] = Form.useForm();
  const [showPicker, setShowPicker] = useState(false);
  const { brandPrimary } = useColor();
  const { handleSignUp, verifyOTP, loading, otpLoading } = SignUpViewModel(defaultAuthenRepo);
  const [isOtpClicked, setIsOtpClicked] = useState(false);
  const { localStrings } = useAuth();

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: backgroundColor, width: "100%" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
          }}
        >
          <ScrollView
            style={{ width: "100%" }}
            contentContainerStyle={{
              flexGrow: 1,
              alignItems: "center",
              justifyContent: "center",
              marginVertical: 30,
            }}
          >
            <Text
              style={{
                textAlign: "center",
                fontWeight: "bold",
                fontSize: 24,
                color: brandPrimaryTap,
              }}
            >
              {localStrings.SignUp.SignUpButton.toUpperCase()}
            </Text>
            <WhiteSpace size="xl" />
            <Form
              layout="vertical"
              style={{ width: "100%", backgroundColor: "none" }}
              form={signUpForm}
            >
              {/* Name */}
              <View
                style={{
                  width: "100%",
                  flexDirection: "row",
                  display: "flex",
                  justifyContent: "flex-start",
                  flexWrap: "wrap",
                }}
              >
                {/* familyName */}
                <View style={{ width: "50%" }}>
                  <Form.Item
                    name="family_name"
                    rules={[{ required: true, message: localStrings.Form.RequiredMessages.FamilyNameRequiredMessage }]}
                  >
                    <MyInput
                      placeholder={localStrings.Form.Label.FamilyName}
                      variant="outlined"
                      type="text"
                      moreStyle={{ width: "100%" }}
                    />
                  </Form.Item>
                </View>
                {/* firstName */}
                <View style={{ width: "50%" }}>
                  <Form.Item
                    name="name"
                    rules={[{ required: true, message: localStrings.Form.RequiredMessages.NameRequiredMessage }]}
                  >
                    <MyInput
                      placeholder={localStrings.Form.Label.Name}
                      variant="outlined"
                      type="text"
                      moreStyle={{ width: "100%" }}
                    />
                  </Form.Item>
                </View>
              </View>
              {/* Phone */}
              <Form.Item
                name="phone_number"
                rules={[
                  { required: true, message: localStrings.Form.RequiredMessages.PhoneRequiredMessage },
                  { pattern: /^[0-9]{10}$/, message: localStrings.Form.TypeMessage.PhoneTypeMessage },
                ]}
              >
                <MyInput
                  placeholder={localStrings.Form.Label.Phone}
                  variant="outlined"
                  type="number"
                  maxLength={10}
                />
              </Form.Item>
              {/* birthdate */}
              <TouchableOpacity
                style={{ width: "100%" }}
                onPress={() => {
                  Platform.OS === 'android' && setShowPicker(true)
                }}
              >
                <Form.Item
                  name="birthday"
                  rules={[
                    { required: true, message: localStrings.Form.RequiredMessages.BirthDayRequiredMessage },
                  ]}
                >
                  <MyInput
                    placeholder={localStrings.Form.Label.BirthDay}
                    variant="outlined"
                    moreStyle={{
                      width: '100%',
                      height: 54,
                    }}
                    value={signUpForm.getFieldValue('birthday')}
                    onPress={() => {
                      Platform.OS === 'ios' && setShowPicker(true)
                    }}
                    readOnly
                  />
                </Form.Item>
              </TouchableOpacity>
              {/* Email and OTP */}
              <View
                style={{
                  width: "100%",
                  flexDirection: "row",
                  display: "flex",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                }}
              >
                {/* Email input */}
                <View style={{ width: "70%" }}>
                  <Form.Item
                    name="email"
                    rules={[
                      { required: true, message: localStrings.Form.RequiredMessages.EmailRequiredMessage },
                      { type: "email", message: localStrings.Form.TypeMessage.EmailTypeMessage },
                    ]}
                  >
                    <MyInput
                      placeholder={localStrings.Form.Label.Email}
                      variant="outlined"
                      type="email-address"
                    />
                  </Form.Item>
                </View>

                {/* OTP button */}
                <View style={{ width: "30%" }}>
                  <Form.Item>
                    <Button
                      type="primary"
                      style={{ width: "100%" }}
                      onPress={() => {
                        setIsOtpClicked(true);
                        verifyOTP({ email: signUpForm.getFieldValue("email") });
                      }}
                      loading={otpLoading}
                    >
                      <Text
                        style={{
                          color: "white",
                          textAlign: "center",
                          fontWeight: "semibold",
                        }}
                      >
                        {localStrings.Form.Label.GetOTP}
                      </Text>
                    </Button>
                  </Form.Item>
                </View>
              </View>
              {/* OTP */}
              <Form.Item
                name="otp"
                rules={[
                  { required: true, message: localStrings.Form.RequiredMessages.OTPRequiredMessage },
                  { pattern: /^[0-9]{6}$/, message: localStrings.Form.TypeMessage.OTPTypeMessage },
                ]}
              >
                <MyInput
                  placeholder={localStrings.Form.Label.OTP}
                  variant="outlined"
                  type="number"
                  maxLength={6}
                />
              </Form.Item>
              {/* password */}
              <Form.Item
                name="password"
                rules={[
                  {
                    validator: (_, value) => {
                      if (!value) {
                        return Promise.reject(localStrings.Form.RequiredMessages.PasswordRequiredMessage);
                      }
                      if (value.length < 8) {
                        return Promise.reject(localStrings.Form.TypeMessage.PasswordTypeMessage);
                      }
                      return Promise.resolve();
                    }
                  }
                ]}
              >
                <MyInput
                  placeholder={localStrings.Form.Label.Password}
                  type={seePassword ? "text" : "password"}
                  variant="outlined"
                  suffix={
                    <TouchableOpacity
                      onPress={() => setSeePassword(!seePassword)}
                    >
                      <Feather
                        name={seePassword ? "eye" : "eye-off"}
                        size={20}
                        color={seePassword ? brandPrimary : "gray"}
                      />
                    </TouchableOpacity>
                  }
                />
              </Form.Item>
              {/* confirmPassword */}
              <Form.Item
                name="confirmPassword"
                rules={[
                  {
                    validator: (_, value) => {
                      if (!value) {
                        return Promise.reject(localStrings.Form.RequiredMessages.ConfirmPasswordRequiredMessage);
                      }
                      if (value.length < 6) {
                        return Promise.reject(localStrings.Form.TypeMessage.PasswordTypeMessage);
                      }
                      if (value === signUpForm.getFieldValue("password")) {
                        return Promise.resolve();
                      }
                      return Promise.reject(localStrings.Form.TypeMessage.ConfirmPasswordTypeMessage);
                    }
                  }
                ]}
              >
                <MyInput
                  placeholder={localStrings.Form.Label.ConfirmPassword}
                  type={seeConfirmPassword ? "text" : "password"}
                  variant="outlined"
                  suffix={
                    <TouchableOpacity
                      onPress={() => setSeeConfirmPassword(!seeConfirmPassword)}
                    >
                      <Feather
                        name={seeConfirmPassword ? "eye" : "eye-off"}
                        size={20}
                        color={seeConfirmPassword ? brandPrimary : "gray"}
                      />
                    </TouchableOpacity>
                  }
                />
              </Form.Item>
              {/* Checkbox */}
              <Form.Item
                name={"agree"}
                rules={[
                  {
                    validator: (_, value) => {
                      if (value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(localStrings.Form.RequiredMessages.AgreeRequiredMessage);
                    }
                  }
                ]}
                valuePropName="checked"
              >
                <Checkbox>
                  <Text>{localStrings.SignUp.AgreePolicies}</Text>
                </Checkbox>
              </Form.Item>
              <WhiteSpace size="lg" />
              {/* Register button */}
              <WingBlank size="lg">
                <Button type="primary" loading={loading} onPress={() => {
                  signUpForm.validateFields()
                    .then(() => {
                      if (!isOtpClicked) {
                        Toast.show({
                          type: "error",
                          text1: localStrings.Form.RequiredMessages.OTPPressRequiredMessage,
                        })
                        return;
                      }
                      handleSignUp(signUpForm.getFieldsValue());
                    })
                    .catch((error) => {
                      Toast.show({
                        type: "error",
                        text1: error?.errorFields[0]?.errors[0],
                      })
                    })
                }}>
                  <Text
                    style={{
                      color: "white",
                      textAlign: "center",
                      fontWeight: "bold",
                    }}
                  >
                    {localStrings.SignUp.SignUpButton.toUpperCase()}
                  </Text>
                </Button>
              </WingBlank>
              <WhiteSpace size="lg" />
            </Form>
            {/* Sign in */}
            <TouchableOpacity
              onPress={() => router.push('/login')}
              style={{ alignItems: 'center', justifyContent: 'center' }}
            >
              <Text>
                {localStrings.SignUp.AlreadyHaveAccount}
                <Text style={{ fontWeight: 'bold' }}>{" " + localStrings.SignUp.LoginNow}</Text>
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
      {/* Date Picker Modal */}
      <MyDateTimePicker
        value={dayjs(signUpForm.getFieldValue("birthday")).toDate()}
        onSubmit={(date) => {
          signUpForm.setFieldValue(
            "birthday",
            dayjs(date).format("DD/MM/YYYY")
          );
          signUpForm.validateFields(["birthday"]);
        }}
        show={showPicker}
        onCancel={() => setShowPicker(false)}
        maxDate={new Date()}
        minDate={new Date(1900, 0, 1)}
      />
      <Toast />
    </KeyboardAvoidingView>
  );
};

export default SignUpFeature;
