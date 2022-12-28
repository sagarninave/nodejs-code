const message = {
  INVALID_EMAIL: "Email is invalid",
  INVALID_PASSWORD: "Password is invalid",
  USER_FOUND: "User found",
  USER_NOT_EXISTS: "User does not exists",
  USER_EXISTS: "User exists with this email",
  USER_REGISTERATION: "User registered",
  VERIFICATION_CODE_SEND: "Email verification code sent",
  VERIFICATION_CODE_ALREADY_SEND: "Email verification code is already sent",
  VERIFICATION_CODE_RESEND: "Verification code resend",
  EMAIL_VERIFIED: "Email verified",
  EMAIL_ALREADY_VERIFIED: "Email already verified",
  EMAIL_VERIFICATION_FAILED: "Email verification failed",
  LOGIN: "Login user",
  LOGIN_EMAIL_SEND: "Recent login email send",
  WRONG_PASSWORD: "Password does not match",
  FORGET_PASSWORD: "Forget password link sent",
  FORGET_PASSWORD_LINK_ALREADY_SEND: "Forget password link send already",
  FORGET_PASSWORD_LINK_RESEND: "Send forget password link again",
  FORGET_PASSWORD_FAILED: "Forget password link send failed",
  FORGET_PASSWORD_CODE_MISMATCH: "Forget password code does not match",
  PASSWORD_CHANGED: "Password changed",
  PASSWORD_CHANGED_FAILED: "Password change failed",
  PASSWORD_NOT_MATCHED: "Password and confirm password should match",
  OLD_PASSWORD_MISMATCH: "Old password and new password does not matched",
  USER_PROFILE: "User profile retrived",
  USER_PROFILE_UPDATE_FAILED: "User profile update failed",
  USER_PROFILE_UPDATE: "User profile updated",
  USERS: "Get all users",
  PROFILE_PHOTO_UPLOAD_FAILED: "Profile photo upload failed",
  PROFILE_PHOTO_UPLOAD: "Profile photo uploaded",
  PROFILE_PHOTO_SIZE: "File size should not more than 1 MB"
};

const regex = { 
  EMAIL_RE: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
  PASSWORD_RE: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
}


module.exports = {
  message, regex
};