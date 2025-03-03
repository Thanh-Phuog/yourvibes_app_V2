import { View, Text, KeyboardAvoidingView, Platform, TouchableOpacity, TouchableWithoutFeedback, Keyboard, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Image } from 'expo-image';
import { useAuth } from '@/src/context/auth/useAuth';
import useColor from '@/src/hooks/useColor';
import { Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Button, Form, WhiteSpace, WingBlank } from '@ant-design/react-native';
import Toast from 'react-native-toast-message';
import MyInput from '@/src/components/foundation/MyInput';
import MyDateTimePicker from '@/src/components/foundation/MyDateTimePicker';
import dayjs from 'dayjs';
import * as ImagePicker from 'expo-image-picker';
import UpdateProfileViewModel from '../viewModel/UpdateProfileViewModel';
import { defaultProfileRepo } from '@/src/api/features/profile/ProfileRepository';

const UpdateProfileScreen = () => {
  const { backgroundColor, lightGray, brandPrimary } = useColor();
  const { user, localStrings } = useAuth();
  const [updatedForm] = Form.useForm();
  const [newAvatar, setNewAvatar] = useState({
    uri: "",
    name: "",
    type: ""
  });
  const [newCapwall, setNewCapwall] = useState({
    uri: "",
    name: "",
    type: ""
  });
  const [showPicker, setShowPicker] = useState(false);
  const {
    loading,
    updateProfile
  } = UpdateProfileViewModel(defaultProfileRepo);

  const pickAvatarImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: false,
        quality: 1,
      });

      if (!result?.canceled && result?.assets) {
        setNewAvatar(
          {
            uri: result.assets[0].uri,
            name: result.assets[0].fileName as string,
            type: result.assets[0].mimeType as string
          }
        );
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: localStrings.AddPost.PickImgFailed,
      })
    }
  };

  const pickCapwallImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: false,
        quality: 1,
      });

      if (!result?.canceled && result?.assets) {
        setNewCapwall(
          {
            uri: result.assets[0].uri,
            name: result.assets[0].fileName as string,
            type: result.assets[0].mimeType as string
          }
        );
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: localStrings.AddPost.PickImgFailed,
      })
    }
  };

  useEffect(() => {
    updatedForm.setFieldsValue({
      name: user?.name,
      family_name: user?.family_name,
      email: user?.email,
      birthday: user?.birthday
        ? dayjs(user?.birthday).format('DD/MM/YYYY')
        : dayjs().format('DD/MM/YYYY'),
      phone_number: user?.phone_number,
      biography: user?.biography
    });

  }, []);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: backgroundColor, width: '100%' }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View
          style={{ flex: 1 }} >
          <ScrollView
            showsVerticalScrollIndicator={false}
          >
            {/* Header */}
            <View
              style={{
                marginTop: Platform.OS === 'ios' ? 30 : 0,
                height: 50,
                paddingHorizontal: 16,
                paddingTop: 16,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: '#fff',
                zIndex: 10,
                borderBottomColor: 'black',
                borderBottomWidth: 1,
              }}
            >
              <TouchableOpacity onPress={() => router.back()}>
                <Feather name="arrow-left" size={24} color="black" />
              </TouchableOpacity>
              <Text style={{ textAlign: 'center', fontSize: 18, fontWeight: 'bold', flex: 1 }}>
                {localStrings.UpdateProfile.UpdateProfile}
              </Text>
            </View>

            {/* Cover Image */}
            <View style={{ width: '100%', height: 200, backgroundColor: lightGray }}>
              <Image
                source={{ uri: newCapwall?.uri || user?.capwall_url }}
                style={{ width: '100%', height: '100%', backgroundColor: lightGray }}
              />
              <TouchableOpacity
                style={{
                  position: 'absolute',
                  top: 10,
                  left: 10,
                  backgroundColor: backgroundColor,
                  borderRadius: 20,
                  padding: 5,
                }}
                onPress={pickCapwallImage}
              >
                <MaterialIcons name="camera-alt" size={20} color={brandPrimary} />
              </TouchableOpacity>
              {newCapwall?.uri && (
                <TouchableOpacity
                  style={{
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    backgroundColor: backgroundColor,
                    borderRadius: 20,
                    padding: 5,
                    zIndex: 10,
                  }}
                  onPress={() => setNewCapwall({ uri: "", name: "", type: "" })}
                >
                  <Ionicons name="close" size={20} color={brandPrimary} />
                </TouchableOpacity>
              )}
            </View>

            {/* Profile Image */}
            <View style={{ alignItems: 'center', marginTop: -60 }}>
              <View style={{ position: 'relative' }}>
                <Image
                  source={{ uri: newAvatar?.uri || user?.avatar_url }}
                  style={{ width: 120, height: 120, borderRadius: 60, backgroundColor: lightGray }}
                />
                <TouchableOpacity
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 10,
                    backgroundColor: backgroundColor,
                    borderRadius: 20,
                    padding: 5,
                  }}
                  onPress={pickAvatarImage}
                >
                  <MaterialIcons name="camera-alt" size={20} color={brandPrimary} />
                </TouchableOpacity>
                {newAvatar?.uri && (
                  <TouchableOpacity
                    style={{
                      position: 'absolute',
                      top: 0,
                      right: 10,
                      backgroundColor: backgroundColor,
                      borderRadius: 20,
                      padding: 5,
                    }}
                    onPress={() => setNewAvatar({ uri: "", name: "", type: "" })}
                  >
                    <Ionicons name="close" size={20} color={brandPrimary} />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* User Information */}
            <WhiteSpace size="lg" />
            <Form
              layout="vertical"
              style={{ width: "100%", backgroundColor: "none" }}
              form={updatedForm}
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
                    style={{ height: 65 }}
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
                    style={{ height: 65 }}
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
                style={{ height: 65 }}
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
                  style={{ height: 65 }}
                >
                  <MyInput
                    placeholder={localStrings.Form.Label.BirthDay}
                    variant="outlined"
                    moreStyle={{
                      width: '100%'
                    }}
                    value={updatedForm.getFieldValue('birthday')}
                    onPress={() => {
                      Platform.OS === 'ios' && setShowPicker(true)
                    }}
                    readOnly
                  />
                </Form.Item>
              </TouchableOpacity>

              {/* Email */}
              <Form.Item
                name="email"
                rules={[
                  { required: true, message: localStrings.Form.RequiredMessages.EmailRequiredMessage },
                  { type: "email", message: localStrings.Form.TypeMessage.EmailTypeMessage },
                ]}
                style={{ height: 65 }}
              >
                <MyInput
                  placeholder={localStrings.Form.Label.Email}
                  variant="outlined"
                  type="email-address"
                  disabled
                />
              </Form.Item>

              {/* Biography */}
              <Form.Item
                name="biography"
                style={{ height: 65 }}
              >
                <MyInput
                  placeholder={localStrings.Form.Label.Biography}
                  variant="outlined"
                  type="text"
                />
              </Form.Item>

              <WhiteSpace size="lg" />
              {/* Register button */}
              <WingBlank size="lg">
                <Button
                  type="primary"
                  loading={loading}
                  onPress={() => {
                    updatedForm.validateFields()
                      .then(() => {
                        updateProfile({
                          ...updatedForm.getFieldsValue(),
                          avatar_url: newAvatar?.uri ? newAvatar : undefined,
                          capwall_url: newCapwall?.uri ? newCapwall : undefined,
                          birthday:
                            dayjs(updatedForm.getFieldValue("birthday"), "DD/MM/YYYY").isValid()
                              ? dayjs(updatedForm.getFieldValue("birthday"), "DD/MM/YYYY").format('YYYY-MM-DDT00:00:00[Z]')
                              : dayjs().format('YYYY-MM-DDT00:00:00[Z]'),
                        })
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
                    {localStrings.Public.Save}
                  </Text>
                </Button>
              </WingBlank>
              <WhiteSpace size="lg" />
            </Form>

            {/* Date Picker Modal */}
            <MyDateTimePicker
              value={dayjs(updatedForm.getFieldValue("birthday"), "DD/MM/YYYY").toDate()}
              onSubmit={(date) => {
                updatedForm.setFieldValue(
                  "birthday",
                  dayjs(date).format("DD/MM/YYYY")
                );
                updatedForm.validateFields(["birthday"]);
              }}
              show={showPicker}
              onCancel={() => setShowPicker(false)}
              maxDate={new Date()}
            />
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
      <Toast />
    </KeyboardAvoidingView>
  )
}

export default UpdateProfileScreen