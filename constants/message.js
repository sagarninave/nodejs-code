const invalidConstants = {
  INVALID_EMAIL: "provided email is invalid",
  INVALID_PASSWORD: "provided password is invalid"
}

const userConstants = {
  USER_NOT_EXISTS: "user does not exists",
  USER_EXISTS: "user exists with this email",
  USER_REGISTERATION: "user registered successfully",
  VERIFICATION_CODE_SEND: "email verification code sent successfully",
  VERIFICATION_CODE_ALREADY_SEND: "email verification code is already sent",
  VERIFICATION_CODE_RESEND: "verification code resend",
  EMAIL_VERIFIED: "email verified successfully",
  EMAIL_ALREADY_VERIFIED: "email already verified",
  EMAIL_VERIFICATION_FAILED: "email verification failed",
  LOGIN: "user login successfully",
  LOGIN_EMAIL_SEND: "recent login email send",
  WRONG_PASSWORD: "password does not match",
  FORGET_PASSWORD: "forget password link has been send",
  FORGET_PASSWORD_LINK_ALREADY_SEND: "forget password link has been send already",
  FORGET_PASSWORD_LINK_RESEND: "send forget password link again",
  FORGET_PASSWORD_FAILED: "forget password link send failed",
  FORGET_PASSWORD_CODE_MISMATCH: "forget password code is mismatch",
  PASSWORD_CHANGED: "password has been changed successfully",
  PASSWORD_CHANGED_FAILED: "password change has been failed",
  PASSWORD_NOT_MATCHED: "password and confirm password should match",
  OLD_PASSWORD_MISMATCH: "old password is not matched with new password",
  USER_PROFILE: "user profile successfully retrived",
  USER_PROFILE_UPDATE_FAILED: "user profile update failed",
  USER_PROFILE_UPDATE: "user profile updated",
  USERS: "get all users",
  USER_FOUND: "user found",
  PROFILE_PHOTO_UPLOAD_FAILED: "profile photo upload has been failed",
  PROFILE_PHOTO_UPLOAD: "profile photo has been successfully uploaded",
};

const openConstants = {
  MESSAGE_SEND: "message send successfully",
  MESSAGE_SEND_FAILED: "message does not send",
};

module.exports = {
  invalidConstants,
  userConstants,
  openConstants
};