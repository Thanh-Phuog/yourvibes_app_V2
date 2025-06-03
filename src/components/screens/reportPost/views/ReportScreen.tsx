import { Keyboard, Platform, ScrollView, StatusBar, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import React, { useState } from 'react';
import useColor from '@/src/hooks/useColor';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuth } from '@/src/context/auth/useAuth';
import ReportViewModel from '../viewModel/ReportViewModel';
import { Button } from '@ant-design/react-native';
import Toast from 'react-native-toast-message';
import { defaultReportRepo } from '@/src/api/features/report/ReportRepo';

const ReportScreen = ({ postId, userId, commentId }: { postId?: string; userId?: string; commentId?: string }) => {
  const { brandPrimary, backgroundColor, backGround } = useColor();
  const [reportReason, setReportReason] = useState('');
  const { localStrings } = useAuth();
  const { reportLoading, report  } = ReportViewModel(defaultReportRepo);

  const handleReport = () => {
    // if (postId) {
    //   reportPost({ report_post_id: postId, reason: reportReason });
    // } else if (userId) {
    //   reportUser({ reported_user_id: userId, reason: reportReason });
    // }
    // else if (commentId) {
    //   reportComment({ report_comment_id: commentId, reason: reportReason });
    // }

    if (postId) {
      report({ type: 1, reason: reportReason, reported_id: postId });
    }
    else if (userId) {
      report({ type: 0, reason: reportReason, reported_id: userId });
    }
    else if (commentId) {
      report({ type: 2, reason: reportReason, reported_id: commentId });
    }
    setReportReason('');
    
  };
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView style={{ flex: 1, backgroundColor: backGround }}>
        {/* Header */}
        <View style={{ backgroundColor: backgroundColor, paddingTop: Platform.OS === 'ios' ? 20 : 0 }}>
          <StatusBar barStyle="dark-content" />
          <View style={{ flexDirection: 'row', alignItems: 'flex-end', height: 60, paddingBottom: 10 }}>
            <View style={{ flexDirection: 'row', paddingHorizontal: 10, alignItems: 'center', justifyContent: 'space-between' }}>
              <TouchableOpacity onPress={() => { router.back(); }}>
                <Ionicons name="arrow-back-outline" size={24} color={brandPrimary} />
              </TouchableOpacity>
              <Text style={{ fontWeight: 'bold', fontSize: 20, marginLeft: 10, color: brandPrimary }}>
                {localStrings.Public.ReportFriend}
              </Text>
            </View>
          </View>
        </View>

        {/* Content */}
        <ScrollView style={{ flex: 1,}}>
          {/* Nội dung báo cáo */}
          <View style={{ flex: 1, paddingHorizontal: 10 }}>
            <Text style={{
              fontWeight: 'bold', fontSize: 18, paddingBlockStart: 10, textAlign: 'center', color: brandPrimary
            }}>
              {postId && localStrings.Report.ReportPost}
              {userId && localStrings.Report.ReportUser}
              {commentId && localStrings.Report.ReportComment}
            </Text>
            <Text style={{ marginVertical: 10, color: 'gray', textAlign: 'center' }}>
              {localStrings.Report.Note}
            </Text>

            <TextInput
              style={{
                height: 180,
                borderWidth: 1,
                borderColor: '#ccc',
                borderRadius: 8,
                padding: 10,
                marginVertical: 10,
                textAlignVertical: 'top',
                color: brandPrimary,
                backgroundColor: backgroundColor,
              }}
              multiline
              value={reportReason}
              onChangeText={setReportReason}
            />
          </View>
        </ScrollView>

        {/* Footer */}
        <View style={{ paddingHorizontal: 10, paddingBottom: 20 }}>
          <Button type='primary' onPress={() => {
            handleReport();
          }}
          loading={reportLoading}
          >
            <Text style={{ color:  backGround, fontWeight: 'bold', fontSize: 16 }}>{localStrings.Public.ReportFriend}</Text>
          </Button>
        </View>
        <Toast />
      </ScrollView>
    </TouchableWithoutFeedback>
  );
}

export default ReportScreen;

