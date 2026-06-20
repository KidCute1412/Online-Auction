import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const SALT_ROUNDS = 10;
const SECTION_TYPES = ["long", "short"];

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  return await bcrypt.hash(password, salt);
}

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
