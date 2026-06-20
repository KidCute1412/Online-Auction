import db from "@/config/database.config.ts";

// Update the user profile detail row
export async function editUserProfile(data: any) {
  const sql = await db("users")
    .where({ user_id: data.user_id })
    .update({
      username: data.username || null,
      email: data.email || null,
      full_name: data.full_name || null,
      address: data.address || null,
      date_of_birth: data.date_of_birth ? new Date(data.date_of_birth) : null,
      avatar: data.avatar,
    })
    .returning("*");
  return sql;
}

// Update user authentication role
export async function updateUserRole(user_id: number, role: string) {
  return await db("users").where({ user_id }).update({ role });
}

// Fetch user profile detail and identify ownership
export async function getUserProfileDetail(params: {
  username: string;
  user_id: number;
  current_user_id: number | null;
}) {
  const isOwner = params.current_user_id === params.user_id;
  const sql = `
    select *
    from users u
    where u.username = ? and u.user_id = ?
  `;
  const result = await db.raw(sql, [params.username, params.user_id]);
  const data = result.rows[0];
  if (!data) {
    return null;
  }
  return {
    data,
    is_owner: isOwner,
  };
}
