import db from "./config/database.config.ts";

async function run() {
  try {
    const categories = await db("categories").select("*");
    console.log("Categories in database:", categories.map((c: any) => ({ id: c.id, name: c.name, created_by: c.created_by })));
    
    const users = await db("users").select("*");
    console.log("Users in database:", users.map((u: any) => ({ user_id: u.user_id, full_name: u.full_name })));

    // Test query with join
    const filtered = await db("categories")
      .select("categories.*")
      .join("users", "categories.created_by", "users.user_id")
      .andWhereILike("users.full_name", "%Anh Vũ Dương%");
    console.log("Filtered categories:", filtered);
  } catch (error) {
    console.error("Error executing database query:", error);
  } finally {
    process.exit(0);
  }
}
run();
