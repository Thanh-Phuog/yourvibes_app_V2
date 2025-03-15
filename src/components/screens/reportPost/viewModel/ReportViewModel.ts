
import { ReportRequestModel } from "@/src/api/features/report/models/ReportRequestModel";
import { ReportRepo } from "@/src/api/features/report/ReportRepo";
import { useAuth } from "@/src/context/auth/useAuth";
import { useState } from "react";
import Toast from "react-native-toast-message";

const ReportViewModel = (repo: ReportRepo) => {
  const { localStrings } = useAuth();
  const [loading, setLoading] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);

  const report = async (params: ReportRequestModel) => {
    try {
      setReportLoading(true);
      const res = await repo.report(params);

      console.log("ReportViewModel -> report -> res", res);
      

      if (!res?.error) {
        Toast.show({
          type: 'success',
          text1: localStrings.Report.ReportSuccess,
        });
      } else {
        Toast.show({
          type: 'error',
          text1: localStrings.Report.ReportFailed,
          text2: res?.error?.message,
        });
      }
    } catch (error: any) {
      console.error(error);
      Toast.show({
        type: 'error',
        text1: localStrings.Report.ReportFailed,
        text2: error?.error?.message,
      });
    } finally {
      setReportLoading(false);
    }

  }
  return {
    loading,
    reportLoading,
    report
  }
}
export default ReportViewModel;