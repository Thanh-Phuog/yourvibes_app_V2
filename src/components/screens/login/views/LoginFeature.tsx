import {
  View,
  Text,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  SafeAreaView,
  Platform,
  Keyboard,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import { Image } from 'expo-image';
import React, { useEffect, useState } from 'react';
import { Button, WingBlank, WhiteSpace, Form, ActivityIndicator, Modal } from '@ant-design/react-native';
import MyInput from '@/src/components/foundation/MyInput';
import { Feather } from '@expo/vector-icons';
import { useRouter, useGlobalSearchParams } from 'expo-router';
import useColor from '@/src/hooks/useColor';
import { useAuth } from '@/src/context/auth/useAuth';
import Toast from 'react-native-toast-message';
import LoginViewModel from '../viewModel/LoginViewModel';
import { defaultAuthenRepo } from '@/src/api/features/authenticate/AuthenRepo';
import { LoginRequestModel } from '@/src/api/features/authenticate/model/LoginModel';

const LoginFeature = () => {
  const router = useRouter();
  const [seePassword, setSeePassword] = useState(false);
  const { backgroundColor } = useColor();
  const [signInForm] = Form.useForm();
  const { brandPrimary } = useColor();
  const { onLogin, localStrings } = useAuth();
  const {
    loading,
    login,
    googleLoading,
    // getGoogleLoginUrl,
    // handleGGButtonClicked,
    promtAsync,
    setGoogleLoading
  } = LoginViewModel(defaultAuthenRepo, onLogin);
  const { email, password } = useGlobalSearchParams();

  useEffect(() => {
    if (email && password) {
      signInForm.setFieldsValue({ email, password });
    }
  }, [email, password]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: backgroundColor, width: '100%' }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={{
          flexGrow: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <ScrollView
            style={{ width: '100%' }}
            contentContainerStyle={{
              flexGrow: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <View style={{ width: '100%' }}>
              <Image
                source={require('@/assets/images/yourvibes_black.png')}
                style={{
                  width: '100%',
                  height: 80
                }}
                contentFit='contain'
              />
            </View>
            <WhiteSpace size="xl" />
            <WhiteSpace size="md" />
            <Form
              layout='vertical'
              style={{
                width: '100%',
                backgroundColor: "none",
              }}
              form={signInForm}
            >
              <Form.Item
                name="email"
                rules={[
                  { required: true, message: localStrings.Form.RequiredMessages.EmailRequiredMessage },
                  { type: 'email', message: localStrings.Form.TypeMessage.EmailTypeMessage },
                ]}
              >
                <MyInput
                  placeholder={localStrings.Form.Label.Email}
                  variant="outlined"
                  type='email-address'
                />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[{ required: true, message: localStrings.Form.RequiredMessages.PasswordRequiredMessage }]}
              >
                <MyInput
                  placeholder={localStrings.Form.Label.Password}
                  type={seePassword ? "text" : "password"}
                  variant="outlined"
                  suffix={
                    <TouchableOpacity onPress={() => { setSeePassword(!seePassword) }}>
                      <Feather name={seePassword ? "eye" : "eye-off"} size={20} color={seePassword ? brandPrimary : "gray"} />
                    </TouchableOpacity>
                  }
                />
              </Form.Item>
              <WhiteSpace size="md" />
              <WingBlank>
                <TouchableOpacity onPress={() => router.push('/forgotPassword')}>
                  <Text
                    style={{
                      color: 'gray',
                    }}
                  >
                    {localStrings.Login.ForgotPasswordText}
                  </Text>
                </TouchableOpacity>
              </WingBlank>
              <WhiteSpace size="md" />
              <Form.Item>
                <Button type="primary" loading={loading} onPress={() => {
                  signInForm
                    .validateFields()
                    .then(() => {
                      const { email, password } = signInForm.getFieldsValue();
                      const data: LoginRequestModel = {
                        email: email,
                        password: password,
                      }
                      login(data);
                    })
                    .catch(() => {
                      console.log('error');
                    });
                }}>
                  {localStrings.Login.LoginButton}
                </Button>
              </Form.Item>
              <WhiteSpace size="xl" />
            </Form>
            <TouchableOpacity
              onPress={() => router.push('/signUp')}
              style={{
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text>
                {localStrings.Login.DontHaveAccout}
                <Text style={{ fontWeight: 'bold' }}>{" " + localStrings.Login.SignUpNow}</Text>
              </Text>
            </TouchableOpacity>
            <WhiteSpace size="xl" />
            <Text style={{
              textAlign: 'center',
            }}>
              {localStrings.Login.Or}
            </Text>
            <WhiteSpace size="lg" />
            <TouchableOpacity style={{ width: '100%' }} onPress={async () => {
              try {
                setGoogleLoading(true);
                await promtAsync();
              } catch (error) {
                console.error(error);
              } finally {
                setGoogleLoading(false);
              }
            }}>
              <Image
                source={{ uri: "https://img.icons8.com/?size=100&id=17949&format=png" }}
                style={{
                  width: '100%',
                  height: 50,
                }}
                contentFit='contain'
              />
            </TouchableOpacity>
            <ActivityIndicator
              animating={googleLoading}
              toast
              size="large"
              text='Loading...'
            />
          </ScrollView>
        </SafeAreaView>
      </TouchableWithoutFeedback>
      <Toast />
    </KeyboardAvoidingView>
  );
};

export default LoginFeature;