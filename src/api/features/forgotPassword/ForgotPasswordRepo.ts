import { ApiPath } from "../../ApiPath";
import { BaseApiResponseModel } from "../../baseApiResponseModel/baseApiResponseModel";
import client from "../../client";
import { VerifyOTPRequestModel } from "../authenticate/model/VerifyOTPModel";
import { ForgotPasswordRequestModel } from "./models/ForgotPassword";

export interface IForgotPasswordRepo {
  verifyOTP(data: VerifyOTPRequestModel): Promise<BaseApiResponseModel<any>>;
  resetPassword(data: ForgotPasswordRequestModel): Promise<BaseApiResponseModel<any>>;
}

class ForgotPasswordRepo implements IForgotPasswordRepo {
  async verifyOTP(data: VerifyOTPRequestModel): Promise<BaseApiResponseModel<any>> {
    return client.post(ApiPath.GET_OTP_FORGOOT_PASSWORD, data);
  }

  async resetPassword(data: ForgotPasswordRequestModel): Promise<BaseApiResponseModel<any>> {
    return client.post(ApiPath.FORGOT_PASSWORD, data);
  }
}

export const forgotPasswordRepo = new ForgotPasswordRepo();