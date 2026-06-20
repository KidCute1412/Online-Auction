import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import * as AccountsModel from "./accounts.model.ts";

const SALT_ROUNDS = 10;
const SECTION_TYPES = ["long", "short"];

// Hash passwords using bcrypt
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  return await bcrypt.hash(password, salt);
}

// Compare password with hash
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

// Verify Google reCAPTCHA token validity
export async function verifyCaptcha(token: string): Promise<boolean> {
  try {
    const secretKey = process.env.CAPTCHA_SECRET_KEY;
    if (!secretKey) {
      console.error("Missing CAPTCHA_SECRET_KEY in env configuration");
      return false;
    }
    const params = new URLSearchParams({ secret: secretKey, response: token });
    const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    });
    const data = await response.json();
    return (data as any).success === true;
  } catch (error) {
    console.error("Error validating CAPTCHA:", error);
    return false;
  }
}

type UserPayload = {
  user_id: number;
  role: string;
};

// Generate access JWT token with expiry
export function generateAccessToken(user: UserPayload, rememberMe?: boolean): string {
  const payload = { user_id: user.user_id, role: user.role };
  return jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: rememberMe ? "3d" : "1d",
  });
}

// Generate refresh JWT token with expiry
export function generateRefreshToken(user: UserPayload, rememberMe: boolean): string {
  const payload = {
    id: user.user_id,
    role: user.role,
    section: rememberMe ? SECTION_TYPES[0] : SECTION_TYPES[1],
  };
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET as string, {
    expiresIn: rememberMe ? "7d" : "1d",
  });
}

// Delete expired OTP verification entries
export async function deleteExpiredOTP(): Promise<void> {
  await AccountsModel.deleteExpiredOTP();
}

// Verify email and OTP match in database
export async function findEmailAndOtp(email: string, otp: string) {
  return await AccountsModel.findEmailAndOtp(email, otp);
}

// Delete OTP verification record
export async function deletedOTP(email: string): Promise<void> {
  await AccountsModel.deletedOTP(email);
}

// Find user account details by email
export async function findEmail(email: string) {
  return await AccountsModel.findEmail(email);
}

// Find user OTP entry by email
export async function findOtpByEmail(email: string) {
  return await AccountsModel.findOtpByEmail(email);
}

// Insert OTP code record into database
export async function insertOtpAndEmail(email: string, otp: string): Promise<void> {
  await AccountsModel.insertOtpAndEmail(email, otp);
}

// Create new user account registration entry
export async function insertAccount(data: any): Promise<void> {
  await AccountsModel.insertAccount(data);
}

// Update user account password
export async function updatePassword(email: string, newPassword: string): Promise<void> {
  await AccountsModel.updatePassword(email, newPassword);
}

// Retrieve detailed account data for password changes
export async function findAccountByIdDetailed(user_id: number) {
  return await AccountsModel.findAccountByIdDetailed(user_id);
}
