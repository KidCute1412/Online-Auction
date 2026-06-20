import db from "@/config/database.config.ts";

// Insert a new user account into the database
export const insertAccount = async (data: any) => {
  await db("users").insert(data);
};

// Find a user account by email
export const findEmail = async (email: string) => {
  return db("users").select("*").where({ email }).first();
};

// Update password for a specific email
export const updatePassword = async (email: string, newPassword: string) => {
  return db("users").where({ email }).update({ password: newPassword });
};

// Find account detail by user ID with formatted date of birth
export const findAccountByIdDetailed = async (user_id: number) => {
  const results = await db.raw(
    `
    select *, TO_CHAR(date_of_birth, 'YYYY-MM-DD') as date_of_birth
    from users
    where user_id = ?
  `,
    [user_id]
  );
  return results.rows[0];
};

// Find account by user ID
export const findAccountById = async (user_id: number) => {
  return db("users").select("*").where({ user_id }).first();
};

// Insert a new OTP record
export const insertOtpAndEmail = async (email: string, otp: string) => {
  return db("otp_codes").insert({ email, otp });
};

// Find OTP record by email
export const findOtpByEmail = async (email: string) => {
  return db("otp_codes").select("*").where({ email }).first();
};

// Verify email and OTP match
export const findEmailAndOtp = async (email: string, otp: string) => {
  return db("otp_codes").select("*").where({ email, otp }).first();
};

// Remove expired OTP records older than 2 minutes
export const deleteExpiredOTP = async () => {
  return db("otp_codes")
    .whereRaw("otp_expiry + interval '2 minutes' < now()")
    .del();
};

// Delete OTP records for an email
export const deletedOTP = async (email: string) => {
  return db("otp_codes").where({ email }).del();
};
